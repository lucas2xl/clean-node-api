import { Encrypter } from '@/data/protocols/criptography/encrypter';
import { HashComparer } from '@/data/protocols/criptography/hash-comparer';
import { LoadAccountByEmailRepository } from '@/data/protocols/database/account/load-account-by-email-repository';
import { UpdateAccessTokenRepository } from '@/data/protocols/database/account/update-access-token-repository';
import { DbAuthentication } from '@/data/usecases/authentication/db-authentication';
import { AccountModel } from '@/domain/models/account-model';
import {
  AuthenticationModel,
  AuthenticationUsecase,
} from '@/domain/usecases/authentication/authentication-usecase';

type SutTypes = {
  sut: AuthenticationUsecase;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
  hashCompareStub: HashComparer;
  encrypterStub: Encrypter;
};

function makeFakeAccount(): AccountModel {
  return {
    id: 'any-id',
    name: 'any-name',
    email: 'any-email',
    password: 'hashed-password',
  };
}

function makeFakeAuthenticationData(): AuthenticationModel {
  return {
    email: 'any-email',
    password: 'any-password',
  };
}

function makeHashCompare(): HashComparer {
  class HashCompareStub implements HashComparer {
    async compare(): Promise<boolean> {
      return true;
    }
  }

  return new HashCompareStub();
}

function makeEncrypter(): Encrypter {
  class EncrypterStub implements Encrypter {
    async encrypt(): Promise<string> {
      return 'any-token';
    }
  }

  return new EncrypterStub();
}

function makeUpdateAccessTokenRepository(): UpdateAccessTokenRepository {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken(): Promise<void> {
      return;
    }
  }

  return new UpdateAccessTokenRepositoryStub();
}

function makeLoadAccountByEmailRepository(): LoadAccountByEmailRepository {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository
  {
    async loadByEmail(): Promise<AccountModel> {
      return makeFakeAccount();
    }
  }

  return new LoadAccountByEmailRepositoryStub();
}

function makeSut(): SutTypes {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository();
  const hashCompareStub = makeHashCompare();
  const encrypterStub = makeEncrypter();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    updateAccessTokenRepositoryStub,
    hashCompareStub,
    encrypterStub,
  );

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    updateAccessTokenRepositoryStub,
    hashCompareStub,
    encrypterStub,
  };
}

describe('DbAuthentication UseCase', () => {
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');
    await sut.auth(makeFakeAuthenticationData());

    expect(loadSpy).toHaveBeenCalledWith('any-email');
  });

  it('should return null if LoadAccountByEmailRepository return null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(null);
    const token = await sut.auth(makeFakeAuthenticationData());

    expect(token).toBe(null);
  });

  it('should return null if HashComparer return false', async () => {
    const { sut, hashCompareStub } = makeSut();
    jest
      .spyOn(hashCompareStub, 'compare')
      .mockReturnValueOnce(Promise.resolve(null));
    const token = await sut.auth(makeFakeAuthenticationData());

    expect(token).toBe(null);
  });

  it('should call HashComparer with correct values', async () => {
    const { sut, hashCompareStub } = makeSut();
    const compareSpy = jest.spyOn(hashCompareStub, 'compare');
    await sut.auth(makeFakeAuthenticationData());

    expect(compareSpy).toHaveBeenCalledWith('any-password', 'hashed-password');
  });

  it('should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut();
    const generateSpy = jest.spyOn(encrypterStub, 'encrypt');
    await sut.auth(makeFakeAuthenticationData());

    expect(generateSpy).toHaveBeenCalledWith('any-id');
  });

  it('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockRejectedValueOnce(new Error());
    const promise = sut.auth(makeFakeAuthenticationData());

    await expect(promise).rejects.toThrow();
  });

  it('should throw if HashComparer throws', async () => {
    const { sut, hashCompareStub } = makeSut();
    jest.spyOn(hashCompareStub, 'compare').mockRejectedValueOnce(new Error());
    const promise = sut.auth(makeFakeAuthenticationData());

    await expect(promise).rejects.toThrow();
  });

  it('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(new Error());
    const promise = sut.auth(makeFakeAuthenticationData());

    await expect(promise).rejects.toThrow();
  });

  it('should throw if UpdateAccessToken throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    jest
      .spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
      .mockRejectedValueOnce(new Error());
    const promise = sut.auth(makeFakeAuthenticationData());

    await expect(promise).rejects.toThrow();
  });

  it('should call Encrypter with correct id', async () => {
    const { sut } = makeSut();
    const token = await sut.auth(makeFakeAuthenticationData());

    expect(token).toBe('any-token');
  });

  it('should call UpdateAccessToken with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(
      updateAccessTokenRepositoryStub,
      'updateAccessToken',
    );
    await sut.auth(makeFakeAuthenticationData());

    expect(updateSpy).toHaveBeenCalledWith('any-id', 'any-token');
  });
});
