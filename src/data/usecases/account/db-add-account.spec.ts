import { mockHasher } from '@/data/mock/mock-criptografy';
import {
  mockAddAccountRepository,
  mockLoadAccountByEmailRepository,
} from '@/data/mock/mock-db-account';
import { Hasher } from '@/data/protocols/criptography/hasher';
import { AddAccountRepository } from '@/data/protocols/database/account/add-account-repository';
import { LoadAccountByEmailRepository } from '@/data/protocols/database/account/load-account-by-email-repository';
import { DbAddAccount } from '@/data/usecases/account/db-add-account';
import {
  mockAccountModel,
  mockAddAccountParams,
} from '@/domain/mock/mock-account';
import { AddAccountUsecase } from '@/domain/usecases/account/add-account-usecase';

type SutTypes = {
  sut: AddAccountUsecase;
  hasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
};

function makeSut(): SutTypes {
  const hasherStub = mockHasher();
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository();
  const addAccountRepositoryStub = mockAddAccountRepository();
  const sut = new DbAddAccount(
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub,
  );

  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub,
  };
}

describe('DbAddAccount Usecase', () => {
  it('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut();
    const hashSpy = jest.spyOn(hasherStub, 'hash');
    await sut.add(mockAddAccountParams());

    expect(hashSpy).toHaveBeenCalledWith('any-password');
  });

  it('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut();
    jest.spyOn(hasherStub, 'hash').mockRejectedValue(new Error());
    const promise = sut.add(mockAddAccountParams());

    await expect(promise).rejects.toThrow();
  });

  it('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
    await sut.add(mockAddAccountParams());

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any-name',
      email: 'any-email',
      password: 'hashed-password',
    });
  });

  it('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest.spyOn(addAccountRepositoryStub, 'add').mockRejectedValue(new Error());
    const promise = sut.add(mockAddAccountParams());

    await expect(promise).rejects.toThrow();
  });

  it('Should return null if LoadAccountByEmailRepository not return null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(null);
    const account = await sut.add(mockAddAccountParams());

    await expect(account).toBeNull();
  });

  it('Should return an account on success', async () => {
    const { sut } = makeSut();
    const account = await sut.add(mockAddAccountParams());
    await expect(account).toEqual(mockAccountModel());
  });

  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');
    await sut.add(mockAccountModel());

    expect(loadSpy).toHaveBeenCalledWith('any-email');
  });
});
