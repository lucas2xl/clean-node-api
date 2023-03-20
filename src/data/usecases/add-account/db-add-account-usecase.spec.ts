import { Encrypter } from '@/data/protocols/criptography/encrypter';
import { AddAccountRepository } from '@/data/protocols/database/add-account-repository';
import { DbAddAccount } from '@/data/usecases/add-account/db-add-account-usecase';
import { AccountModel } from '@/domain/models/account-model';
import { AddAccountModel } from '@/domain/usecases/add-account-usecase';

interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
  addAccountRepositoryStub: AddAccountRepository;
}

function makeFakeAccountData(): AddAccountModel {
  return {
    name: 'valid-name',
    email: 'valid-email',
    password: 'valid-password',
  };
}

function makeFakeAccount(): AccountModel {
  return {
    id: 'valid-id',
    name: 'valid-name',
    email: 'valid-email',
    password: 'hashed-password',
  };
}

function makeEncrypter(): Encrypter {
  class EncrypterStub implements Encrypter {
    async encrypt(): Promise<string> {
      return 'hashed-password';
    }
  }

  return new EncrypterStub();
}

function makeAddAccountRepository(): AddAccountRepository {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(): Promise<AccountModel> {
      return makeFakeAccount();
    }
  }

  return new AddAccountRepositoryStub();
}

function makeSut(): SutTypes {
  const encrypterStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);

  return { sut, encrypterStub, addAccountRepositoryStub };
}

describe('DbAddAccount Usecase', () => {
  it('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    await sut.add(makeFakeAccountData());

    expect(encryptSpy).toHaveBeenCalledWith('valid-password');
  });

  it('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValue(new Error());
    const promise = sut.add(makeFakeAccountData());

    await expect(promise).rejects.toThrow();
  });

  it('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
    await sut.add(makeFakeAccountData());

    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid-name',
      email: 'valid-email',
      password: 'hashed-password',
    });
  });

  it('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest.spyOn(addAccountRepositoryStub, 'add').mockRejectedValue(new Error());
    const promise = sut.add(makeFakeAccountData());

    await expect(promise).rejects.toThrow();
  });

  it('Should return an account on success', async () => {
    const { sut } = makeSut();
    const account = await sut.add(makeFakeAccountData());

    await expect(account).toEqual(makeFakeAccount());
  });
});
