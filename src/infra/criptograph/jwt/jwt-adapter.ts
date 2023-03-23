import { Decrypter } from '@/data/protocols/criptography/decrypter';
import { Encrypter } from '@/data/protocols/criptography/encrypter';
import * as jsonwebtoken from 'jsonwebtoken';

export class JwtAdapter implements Encrypter, Decrypter {
  constructor(private readonly secret: string) {}

  async encrypt(value: string): Promise<string> {
    return jsonwebtoken.sign({ id: value }, this.secret);
  }

  async decrypt(value: string): Promise<string> {
    return Promise.resolve('');
  }
}
