import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'adaptlearn_secret_key_jwt_2026_capstone',
  get ML_SERVICE_URL(): string {
    return process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';
  },
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db'
};
