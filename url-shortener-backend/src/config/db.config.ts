import { registerAs } from '@nestjs/config';

export default registerAs('db', () => ({
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database_name',
}));
