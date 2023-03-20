import { Encrypter } from '@/data/protocols/criptography/encrypter';
import { JwtAdapter } from '@/infra/criptograph/jwt/jwt-adapter';
import * as jsonwebtoken from 'jsonwebtoken';

function makeSut(): Encrypter {
  return new JwtAdapter('secret');
}

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return 'any-token';
  },
}));

describe('Jwt Adapter', () => {
  it('should call sign if correct values', async () => {
    const sut = makeSut();
    const signSpy = jest.spyOn(jsonwebtoken, 'sign');
    await sut.encrypt('any-id');

    expect(signSpy).toHaveBeenCalledWith({ id: 'any-id' }, 'secret');
  });

  it('should return a token on sign success', async () => {
    const sut = makeSut();
    const token = await sut.encrypt('any-id');

    expect(token).toBe('any-token');
  });

  it('should throw if sign throw', async () => {
    const sut = makeSut();
    jest.spyOn(jsonwebtoken, 'sign').mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.encrypt('any-id');

    await expect(promise).rejects.toThrow();
  });
});
