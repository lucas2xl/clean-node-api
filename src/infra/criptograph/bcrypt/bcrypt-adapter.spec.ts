import { BcryptAdapter } from '@/infra/criptograph/bcrypt/bcrypt-adapter';
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

  it('Should return true when comparer succeeds', async () => {
    const sut = makeSut();
    const isValid = await sut.compare('any_value', 'any-hashed');

    expect(isValid).toBe(true);
  });

  it('Should throw if hash throws', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.hash('any_value');

    await expect(promise).rejects.toThrow();
  });

  it('Should throw if comparer throws', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.compare('any_value', 'any-hash');

    await expect(promise).rejects.toThrow();
  });

  it('Should return false when comparer fails', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false);
    const isValid = await sut.compare('any_value', 'any-hash');

    expect(isValid).toBe(false);
  });
});
