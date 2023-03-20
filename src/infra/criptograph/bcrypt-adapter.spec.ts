import { BcryptAdapter } from '@/infra/criptograph/bcrypt-adapter';
import * as bcrypt from 'bcrypt';

const salt = 12;

function makeSut(): BcryptAdapter {
  return new BcryptAdapter(salt);
}

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return 'hash';
  },

  async compare(): Promise<boolean> {
    return true;
  },
}));

describe('Bcrypt Adapter', () => {
  it('Should call hash with correct values', async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.hash('any_value');

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  it('Should call compare with correct values', async () => {
    const sut = makeSut();
    const compareSpy = jest.spyOn(bcrypt, 'compare');
    await sut.compare('any_value', 'any-hash');

    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any-hash');
  });

  it('Should return a valid hash on hash success', async () => {
    const sut = makeSut();
    const hash = await sut.hash('any_value');

    expect(hash).toBe('hash');
  });

  it('Should throw if hash throws', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.hash('any_value');

    await expect(promise).rejects.toThrow();
  });
});
