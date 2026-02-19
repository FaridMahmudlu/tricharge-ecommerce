import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import config from './config/environment';
import { pgPool } from './db';

import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';
import paymentRoutes from './routes/paymentRoutes';

const app = express();

const requestCounts = new Map<string, { count: number; resetTime: number }>();

const rateLimitMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = config.rateLimitWindowMs;
  const maxRequests = config.rateLimitMaxRequests;

  const info = requestCounts.get(ip) ?? { count: 0, resetTime: now + windowMs };

  if (now > info.resetTime) {
    info.count = 0;
    info.resetTime = now + windowMs;
  }

  info.count += 1;
  requestCounts.set(ip, info);

  if (info.count > maxRequests) {
    return res.status(429).json({
      status: 'error',
      message: 'Too many requests from this IP, please try again later.',
    });
  }

  return next();
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));
app.use(rateLimitMiddleware);

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', async (_req, res) => {
  try {
    await pgPool.query('select 1');
    res.json({
      status: 'success',
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv,
      database: 'connected',
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: 'Database connection failed',
      environment: config.nodeEnv,
    });
  }
});

app.get('/', (_req, res) => {
  res.json({
    message: 'Welcome to the TriCharge E-commerce API',
    version: '1.0.0',
    environment: config.nodeEnv,
  });
});

app.use('*', (_req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
  });
});

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Server error:', err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong!';

  res.status(statusCode).json({
    status: 'error',
    message: config.nodeEnv === 'production' ? 'Internal server error' : message,
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
});

const startServer = async () => {
  try {
    await pgPool.query('select 1');
    console.log('Connected to Supabase Postgres');
  } catch (error) {
    console.error('Supabase connection error:', error);
    if (config.nodeEnv === 'production') {
      process.exit(1);
    } else {
      console.warn('Continuing without database connectivity');
    }
  }

  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
    console.log(`Environment: ${config.nodeEnv}`);
    console.log(`Health check: http://localhost:${config.port}/api/health`);
  });
};

void startServer();
