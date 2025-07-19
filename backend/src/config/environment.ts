import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface EnvironmentConfig {
  // Server
  port: number;
  nodeEnv: string;
  
  // Database
  mongodbUri: string;
  
  // JWT
  jwtSecret: string;
  jwtExpiresIn: string;
  
  // Stripe
  stripeSecretKey: string;
  stripeWebhookSecret: string;
  
  // Security
  bcryptRounds: number;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  
  // File Upload
  maxFileSize: number;
  uploadPath: string;
}

const config: EnvironmentConfig = {
  // Server
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database - Use local MongoDB for development
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tricharge',
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '30d',
  
  // Stripe
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_your_stripe_test_key_here',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_your_webhook_secret_here',
  
  // Security
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  
  // File Upload
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),
  uploadPath: process.env.UPLOAD_PATH || './uploads',
};

// Validate required environment variables
const validateConfig = () => {
  const required = ['jwtSecret'];
  const missing = required.filter(key => !config[key as keyof EnvironmentConfig]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  if (config.nodeEnv === 'production') {
    const productionRequired = ['mongodbUri', 'stripeSecretKey'];
    const productionMissing = productionRequired.filter(key => 
      !config[key as keyof EnvironmentConfig] || 
      config[key as keyof EnvironmentConfig] === 'your-super-secret-jwt-key-change-this-in-production'
    );
    
    if (productionMissing.length > 0) {
      throw new Error(`Missing production environment variables: ${productionMissing.join(', ')}`);
    }
  }
};

validateConfig();

export default config; 