import { Decrypter } from '@/data/protocols/criptography/decrypter';
import { LoadAccountByTokenRepository } from '@/data/protocols/database/account/load-account-by-token-repository';
import { DbLoadAccountByToken } from '@/data/usecases/account/db-load-account-by-token';
import { AccountModel } from '@/domain/models/account-model';

interface SutTypes {
  sut: DbLoadAccountByToken;
  decrypterStub: Decrypter;
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository;
}

function makeDecrypter(): Decrypter {
  class DecrypterStub implements Decrypter {
    async decrypt(): Promise<string> {
      return 'any-value';
    }
  }

  return new DecrypterStub();
}

function makeLoadAccountByTokenRepository(): LoadAccountByTokenRepository {
  class LoadAccountByTokenRepositoryStub
    implements LoadAccountByTokenRepository
  {
    async loadByToken(): Promise<AccountModel> {
      return Promise.resolve(undefined);
    }
  }

  return new LoadAccountByTokenRepositoryStub();
}

function makeSut(): SutTypes {
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository();
  const decrypterStub = makeDecrypter();
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
});
