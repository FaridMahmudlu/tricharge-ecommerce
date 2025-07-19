import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../models/User';
import { Types, Document } from 'mongoose';
import config from '../config/environment';

interface UserDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Generate JWT Token
const generateToken = (id: Types.ObjectId): string => {
  const options: SignOptions = {
    expiresIn: config.jwtExpiresIn as unknown as jwt.SignOptions['expiresIn']
  };
  return jwt.sign({ id }, config.jwtSecret, options);
};

// Register new user
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        status: 'error',
        message: 'User already exists' 
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
    }) as UserDocument;

    // Generate token
    const token = generateToken(user._id);

    return res.status(201).json({
      status: 'success',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
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

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password',
      });
    }

    // Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password') as UserDocument;
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    return res.status(200).json({
      status: 'success',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
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