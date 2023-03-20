import { LoadAccountByEmailRepository } from '@/data/protocols/load-account-by-email-repository';
import { DbAuthentication } from '@/data/usecases/authentication/db-authentication';
import { AccountModel } from '@/domain/models/account-model';
import { AuthenticationModel } from '@/domain/usecases/authentication';

interface SutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
}

function makeFakeAccount(): AccountModel {
  return {
    id: 'any-id',
    name: 'any-name',
    email: 'any-email',
    password: 'any-password',
  };
}

function makeFakeAuthenticationData(): AuthenticationModel {
  return {
    email: 'any-email',
    password: 'any-password',
  };
}

function makeLoadAccountByEmailRepository(): LoadAccountByEmailRepository {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository
  {
    async load(_: string): Promise<AccountModel> {
      return makeFakeAccount();
    }
  }

  return new LoadAccountByEmailRepositoryStub();
}

function makeSut(): SutTypes {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);

  return { sut, loadAccountByEmailRepositoryStub };
}

describe('DbAuthentication UseCase', () => {
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');
    await sut.auth(makeFakeAuthenticationData());

    expect(loadSpy).toHaveBeenCalledWith('any-email');
  });

  it('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockRejectedValueOnce(new Error());
    const promise = sut.auth(makeFakeAuthenticationData());

    await expect(promise).rejects.toThrow();
  });
});
