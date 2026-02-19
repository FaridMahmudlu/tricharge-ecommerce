import dotenv from 'dotenv';

dotenv.config();

interface SupabaseConfig {
  url: string;
  serviceRoleKey: string;
  dbUrl: string;
}

interface EnvironmentConfig {
  port: number;
  nodeEnv: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  stripeSecretKey: string;
  stripeWebhookSecret: string;
  supabase: SupabaseConfig;
  bcryptRounds: number;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  maxFileSize: number;
  uploadPath: string;
}

const config: EnvironmentConfig = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '30d',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_your_stripe_test_key_here',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_your_webhook_secret_here',
  supabase: {
    url: process.env.SUPABASE_URL || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    dbUrl: process.env.SUPABASE_DB_URL || '',
  },
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),
  uploadPath: process.env.UPLOAD_PATH || './uploads',
};

const validateConfig = () => {
  if (!config.jwtSecret) {
    throw new Error('Missing required environment variables: jwtSecret');
  }

  const missingSupabase = Object.entries(config.supabase)
    .filter(([, value]) => !value)
    .map(([key]) => `SUPABASE_${key.toUpperCase()}`);

  if (missingSupabase.length > 0) {
    throw new Error(`Missing Supabase configuration: ${missingSupabase.join(', ')}`);
  }

  if (config.nodeEnv === 'production') {
    if (!config.stripeSecretKey || config.stripeSecretKey === 'sk_test_your_stripe_test_key_here') {
      throw new Error('Missing production environment variables: stripeSecretKey');
    }
  }
};

validateConfig();

export default config;
