import { mockDecrypter } from '@/data/mock/mock-criptografy';
import { mockLoadAccountByTokenRepository } from '@/data/mock/mock-db-account';
import { Decrypter } from '@/data/protocols/criptography/decrypter';
import { LoadAccountByTokenRepository } from '@/data/protocols/database/account/load-account-by-token-repository';
import { DbLoadAccountByToken } from '@/data/usecases/account/db-load-account-by-token';
import { mockAccountModel } from '@/domain/mock/mock-account';

type SutTypes = {
  sut: DbLoadAccountByToken;
  decrypterStub: Decrypter;
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository;
};

function makeSut(): SutTypes {
  const loadAccountByTokenRepositoryStub = mockLoadAccountByTokenRepository();
  const decrypterStub = mockDecrypter();
  const sut = new DbLoadAccountByToken(
    loadAccountByTokenRepositoryStub,
    decrypterStub,
  );
  return { sut, decrypterStub, loadAccountByTokenRepositoryStub };
}

describe('DbLoadAccountByToken Usecase', () => {
  it('should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut();
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt');
    await sut.loadByToken('any-token', 'any-role');

    expect(decryptSpy).toHaveBeenCalledWith('any-token');
  });

  it('should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut();
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(null);
    const account = await sut.loadByToken('any-token', 'any-role');

    expect(account).toBeNull();
  });

  it('should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    const decryptSpy = jest.spyOn(
      loadAccountByTokenRepositoryStub,
      'loadByToken',
    );
    await sut.loadByToken('any-token', 'any-role');

    expect(decryptSpy).toHaveBeenCalledWith('any-token', 'any-role');
  });

  it('should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockReturnValueOnce(null);
    const account = await sut.loadByToken('any-token', 'any-role');

    expect(account).toBeNull();
  });

  it('should return an account on success', async () => {
    const { sut } = makeSut();

    const account = await sut.loadByToken('any-token', 'any-role');

    expect(account).toEqual(mockAccountModel());
  });

  it('Should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut();
    jest.spyOn(decrypterStub, 'decrypt').mockRejectedValue(new Error());
    const promise = sut.loadByToken('any-token');

    await expect(promise).rejects.toThrow();
  });

  it('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockRejectedValue(new Error());
    const promise = sut.loadByToken('any-token');

    await expect(promise).rejects.toThrow();
  });
});
