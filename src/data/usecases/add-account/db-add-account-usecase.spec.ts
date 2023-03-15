import { DbAddAccount } from '@/data/usecases/add-account/db-add-account-usecase';
import { Encrypter } from '@/data/protocols/encrypter';

interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
}

function makeEncrypter(): Encrypter {
  class EncrypterStub implements Encrypter {
    async encrypt(_: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'));
    }
  }

  return new EncrypterStub();
}

function makeSut(): SutTypes {
  const encrypterStub = makeEncrypter();
  const sut = new DbAddAccount(encrypterStub);
  return { sut, encrypterStub };
}

describe('DbAddAccount Usecase', () => {
  it('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };

    await sut.add(accountData);

    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });
});
