import { mockEncrypter, mockHashComparer } from '@/data/mock/mock-criptografy';
import { mockLoadAccountByEmailRepository } from '@/data/mock/mock-db-account';
import { mockUpdateAccessTokenRepository } from '@/data/mock/mock-db-authentication';
import { Encrypter } from '@/data/protocols/criptography/encrypter';
import { HashComparer } from '@/data/protocols/criptography/hash-comparer';
import { LoadAccountByEmailRepository } from '@/data/protocols/database/account/load-account-by-email-repository';
import { UpdateAccessTokenRepository } from '@/data/protocols/database/account/update-access-token-repository';
import { DbAuthentication } from '@/data/usecases/authentication/db-authentication';
import { mockAuthenticationParams } from '@/domain/mock/mock-authentication';
import { AuthenticationUsecase } from '@/domain/usecases/authentication/authentication-usecase';

type SutTypes = {
  sut: AuthenticationUsecase;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
  hashCompareStub: HashComparer;
  encrypterStub: Encrypter;
};

function makeSut(): SutTypes {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository();
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository();
  const hashCompareStub = mockHashComparer();
  const encrypterStub = mockEncrypter();
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
    await sut.auth(mockAuthenticationParams());

    expect(loadSpy).toHaveBeenCalledWith({ email: 'any-email' });
  });

  it('should return null if LoadAccountByEmailRepository return null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(null);
    const token = await sut.auth(mockAuthenticationParams());

    expect(token).toBe(null);
  });

  it('should return null if HashComparer return false', async () => {
    const { sut, hashCompareStub } = makeSut();
    jest
      .spyOn(hashCompareStub, 'compare')
      .mockReturnValueOnce(Promise.resolve(null));
    const token = await sut.auth(mockAuthenticationParams());

    expect(token).toBe(null);
  });

  it('should call HashComparer with correct values', async () => {
    const { sut, hashCompareStub } = makeSut();
    const compareSpy = jest.spyOn(hashCompareStub, 'compare');
    await sut.auth(mockAuthenticationParams());

    expect(compareSpy).toHaveBeenCalledWith('any-password', 'any-password');
  });

  it('should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut();
    const generateSpy = jest.spyOn(encrypterStub, 'encrypt');
    await sut.auth(mockAuthenticationParams());

    expect(generateSpy).toHaveBeenCalledWith('any-id');
  });

  it('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockRejectedValueOnce(new Error());
    const promise = sut.auth(mockAuthenticationParams());

    await expect(promise).rejects.toThrow();
  });

  it('should throw if HashComparer throws', async () => {
    const { sut, hashCompareStub } = makeSut();
    jest.spyOn(hashCompareStub, 'compare').mockRejectedValueOnce(new Error());
    const promise = sut.auth(mockAuthenticationParams());

    await expect(promise).rejects.toThrow();
  });

  it('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(new Error());
    const promise = sut.auth(mockAuthenticationParams());

    await expect(promise).rejects.toThrow();
  });

  it('should throw if UpdateAccessToken throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    jest
      .spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
      .mockRejectedValueOnce(new Error());
    const promise = sut.auth(mockAuthenticationParams());

    await expect(promise).rejects.toThrow();
  });

  it('should call Encrypter with correct id', async () => {
    const { sut } = makeSut();
    const token = await sut.auth(mockAuthenticationParams());

    expect(token).toBe('any-token');
  });

  it('should call UpdateAccessToken with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(
      updateAccessTokenRepositoryStub,
      'updateAccessToken',
    );
    await sut.auth(mockAuthenticationParams());

    expect(updateSpy).toHaveBeenCalledWith({
      id: 'any-id',
      token: 'any-token',
    });
  });
});
