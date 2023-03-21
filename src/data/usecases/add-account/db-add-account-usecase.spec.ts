import { Hasher } from '@/data/protocols/criptography/hasher';
import { AddAccountRepository } from '@/data/protocols/database/account/add-account-repository';
import { DbAddAccount } from '@/data/usecases/add-account/db-add-account-usecase';
import { AccountModel } from '@/domain/models/account-model';
import { AddAccountModel } from '@/domain/usecases/add-account-usecase';

interface SutTypes {
  sut: DbAddAccount;
  hasherStub: Hasher;
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

function makeHasher(): Hasher {
  class HasherStub implements Hasher {
    async hash(): Promise<string> {
      return 'hashed-password';
    }
  }

  return new HasherStub();
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
  const hasherStub = makeHasher();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub);

  return { sut, hasherStub, addAccountRepositoryStub };
}

describe('DbAddAccount Usecase', () => {
  it('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut();
    const hashSpy = jest.spyOn(hasherStub, 'hash');
    await sut.add(makeFakeAccountData());

    expect(hashSpy).toHaveBeenCalledWith('valid-password');
  });

  it('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut();
    jest.spyOn(hasherStub, 'hash').mockRejectedValue(new Error());
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
