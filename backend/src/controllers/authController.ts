import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../config/environment';
import { pgPool } from '../db';
import { UserRow, toPublicUser } from '../models/User';

const generateToken = (id: string): string => {
  const options: SignOptions = {
    expiresIn: config.jwtExpiresIn as unknown as jwt.SignOptions['expiresIn'],
  };
  return jwt.sign({ id }, config.jwtSecret, options);
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body as Record<string, string>;

    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Name, email and password are required',
      });
    }

    const existing = await pgPool.query('select id from public.users where email = $1 limit 1', [email]);

    if (existing.rows.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists',
      });
    }

    const hash = await bcrypt.hash(password, config.bcryptRounds);

    const insert = await pgPool.query<UserRow>(
      `insert into public.users (name, email, password_hash)
       values ($1, $2, $3)
       returning id, name, email, role, created_at, updated_at, password_hash`,
      [name, email, hash],
    );

    const userRow = insert.rows[0];
    const token = generateToken(userRow.id);

    return res.status(201).json({
      status: 'success',
      data: {
        token,
        user: toPublicUser(userRow),
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(400).json({
      status: 'error',
      message: 'Error creating user',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as Record<string, string>;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password',
      });
    }

    const result = await pgPool.query<UserRow & { password_hash: string }>(
      `select id, name, email, role, password_hash, created_at, updated_at
       from public.users
       where email = $1
       limit 1`,
      [email],
    );

    const userRow = result.rows[0];

    if (!userRow) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password',
      });
    }

    const passwordMatch = await bcrypt.compare(password, userRow.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password',
      });
    }

    const token = generateToken(userRow.id);

    return res.status(200).json({
      status: 'success',
      data: {
        token,
        user: toPublicUser(userRow),
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(400).json({
      status: 'error',
      message: 'Error logging in',
    });
  }
};

