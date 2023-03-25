import env from '@/main/config/env';
import { sign } from 'jsonwebtoken';

export async function mockToken(id: string): Promise<string> {
  return sign({ id }, env.jwtSecret);
}
