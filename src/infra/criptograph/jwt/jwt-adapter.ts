import { Encrypter } from '@/data/protocols/criptography/encrypter';
import * as jsonwebtoken from 'jsonwebtoken';

export class JwtAdapter implements Encrypter {
  constructor(private readonly secret: string) {}

  async encrypt(value: string): Promise<string> {
    return jsonwebtoken.sign({ id: value }, this.secret);
  }
}
