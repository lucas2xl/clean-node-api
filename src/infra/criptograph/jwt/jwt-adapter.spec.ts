import { JwtAdapter } from '@/infra/criptograph/jwt/jwt-adapter';
import * as jsonwebtoken from 'jsonwebtoken';

function makeSut(): JwtAdapter {
  return new JwtAdapter('secret');
}

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return 'any-token';
  },
  async verify(): Promise<string> {
    return 'decrypted-token';
  },
}));

describe('Jwt Adapter', () => {
  describe('sign()', () => {
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

  describe('verify()', () => {
    it('should call verify if correct value', async () => {
      const sut = makeSut();
      const verifySpy = jest.spyOn(jsonwebtoken, 'verify');
      await sut.decrypt('any-token');

      expect(verifySpy).toHaveBeenCalledWith('any-token', 'secret');
    });

    it('should return a value on verify success', async () => {
      const sut = makeSut();
      const value = await sut.decrypt('any-token');

      expect(value).toBe('decrypted-token');
    });
  });
});
