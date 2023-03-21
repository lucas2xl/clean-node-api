import * as process from 'process';

export default {
  port: process.env.PORT || 3000,
  mongoUrl: process.env.MONGO_URL || 'mongodb://0.0.0.0:27017/clean-node-api',
  jwtSecret: process.env.JWT_SECRET || '827ccb0eea8a706c4c34a16891f84e7b',
};
