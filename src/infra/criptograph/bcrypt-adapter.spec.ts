import { BcryptAdapter } from '@/infra/criptograph/bcrypt-adapter';
import * as bcrypt from 'bcrypt';
import { hash } from 'bcrypt';

const salt = 12;

function makeSut(): BcryptAdapter {
  return new BcryptAdapter(salt);
}

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return Promise.resolve('hash');
  },
}));

describe('Bcrypt Adapter', () => {
  it('Should call bcrypt with correct values', async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.encrypt('any_value');

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  it('Should return a hash on success', async () => {
    const sut = makeSut();
    const hash = await sut.encrypt('any_value');

    expect(hash).toBe('hash');
  });

  it('Should throw if bcrypt throws', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.encrypt('any_value');

    await expect(promise).rejects.toThrow();
  });
});
