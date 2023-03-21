import * as dotenv from 'dotenv';
import * as process from 'process';

dotenv.config();
export default {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
};
