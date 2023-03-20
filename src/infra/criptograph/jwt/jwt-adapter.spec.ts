import { Encrypter } from '@/data/protocols/criptography/encrypter';
import { JwtAdapter } from '@/infra/criptograph/jwt/jwt-adapter';
import * as jwt from 'jsonwebtoken';

function makeSut(): Encrypter {
  return new JwtAdapter('secret');
}

describe('Jwt Adapter', () => {
  it('should call sign if correct values', async () => {
    const sut = makeSut();
    const signSpy = jest.spyOn(jwt, 'sign');
    await sut.encrypt('any-id');

    expect(signSpy).toHaveBeenCalledWith({ id: 'any-id' }, 'secret');
  });
});
