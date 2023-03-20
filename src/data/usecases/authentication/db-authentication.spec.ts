import { HashComparer } from '@/data/protocols/criptography/hash-comparer';
import { TokenGenerator } from '@/data/protocols/criptography/token-generator';
import { LoadAccountByEmailRepository } from '@/data/protocols/database/load-account-by-email-repository';
import { DbAuthentication } from '@/data/usecases/authentication/db-authentication';
import { AccountModel } from '@/domain/models/account-model';
import { AuthenticationModel } from '@/domain/usecases/authentication';

interface SutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  hashCompareStub: HashComparer;
  tokenGeneratorStub: TokenGenerator;
}

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
    async compare(value: string, hash: string): Promise<boolean> {
      return true;
    }
  }

  return new HashCompareStub();
}

function makeTokenGenerator(): TokenGenerator {
  class TokenGeneratorStub implements TokenGenerator {
    async generate(_: string): Promise<string> {
      return 'any-token';
    }
  }

  return new TokenGeneratorStub();
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
  const hashCompareStub = makeHashCompare();
  const tokenGeneratorStub = makeTokenGenerator();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    tokenGeneratorStub,
  );

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    tokenGeneratorStub,
  };
}

describe('DbAuthentication UseCase', () => {
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');
    await sut.auth(makeFakeAuthenticationData());

    expect(loadSpy).toHaveBeenCalledWith('any-email');
  });

  it('should return null if LoadAccountByEmailRepository return null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'load')
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

  it('should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate');
    await sut.auth(makeFakeAuthenticationData());

    expect(generateSpy).toHaveBeenCalledWith('any-id');
  });

  it('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'load')
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

  it('should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    jest
      .spyOn(tokenGeneratorStub, 'generate')
      .mockRejectedValueOnce(new Error());
    const promise = sut.auth(makeFakeAuthenticationData());

    await expect(promise).rejects.toThrow();
  });

  it('should call TokenGenerator with correct id', async () => {
    const { sut } = makeSut();
    const token = await sut.auth(makeFakeAuthenticationData());

    expect(token).toBe('any-token');
  });
});
