import { Decrypter } from '@/data/protocols/criptography/decrypter';
import { DbLoadAccountByToken } from '@/data/usecases/account/db-load-account-by-token';

interface SutTypes {
  sut: DbLoadAccountByToken;
  decrypterStub: Decrypter;
}

function makeDecrypter(): Decrypter {
  class DecrypterStub implements Decrypter {
    async decrypt(): Promise<string> {
      return 'any-value';
    }
  }

  return new DecrypterStub();
}

function makeSut(): SutTypes {
  const decrypterStub = makeDecrypter();
  const sut = new DbLoadAccountByToken(decrypterStub);
  return { sut, decrypterStub };
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
});
