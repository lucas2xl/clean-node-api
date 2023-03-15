import { DbAddAccount } from '@/data/usecases/add-account/db-add-account-usecase';
import { Encrypter } from '@/data/protocols/encrypter';

interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
}

class EncrypterStub {
  async encrypt(_: string): Promise<string> {
    return new Promise(resolve => resolve('hashed_password'));
  }
}

function makeSut(): SutTypes {
  const encrypterStub = new EncrypterStub();
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
