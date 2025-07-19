import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import config from './config/environment';
import path from 'path';

// Import routes
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';
import paymentRoutes from './routes/paymentRoutes';

// Create Express app
const app = express();

// Custom rate limiting middleware
const requestCounts = new Map<string, { count: number; resetTime: number }>();

const rateLimitMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = config.rateLimitWindowMs;
  const maxRequests = config.rateLimitMaxRequests;

  const requestInfo = requestCounts.get(ip) || { count: 0, resetTime: now + windowMs };

  if (now > requestInfo.resetTime) {
    requestInfo.count = 0;
    requestInfo.resetTime = now + windowMs;
  }

  requestInfo.count++;
  requestCounts.set(ip, requestInfo);

  if (requestInfo.count > maxRequests) {
    return res.status(429).json({
      status: 'error',
      message: 'Too many requests from this IP, please try again later.'
    });
  }

  return next();
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));
app.use(rateLimitMiddleware);

// Database connection
mongoose
  .connect(config.mongodbUri)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    if (config.nodeEnv === 'production') {
      process.exit(1);
    } else {
      console.log('⚠️  Server will continue running without database connection');
    }
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);

// Serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check route
app.get('/api/health', (_req, res) => {
  res.json({ 
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

// Basic route
app.get('/', (_req, res) => {
  res.json({ 
    message: 'Welcome to the TriCharge E-commerce API',
    version: '1.0.0',
    environment: config.nodeEnv
  });
});

// 404 handler
app.use('*', (_req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('❌ Server error:', err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong!';
  
  res.status(statusCode).json({
    status: 'error',
    message: config.nodeEnv === 'production' ? 'Internal server error' : message,
    ...(config.nodeEnv === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(config.port, () => {
  console.log(`🚀 Server is running on port ${config.port}`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`�� API Documentation: http://localhost:${config.port}/api/health`);
}); 