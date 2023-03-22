import { AccountModel } from '@/domain/models/account-model';
import { LoadAccountByTokenUsecase } from '@/domain/usecases/load-account-by-token-usecase';
import { AccessDeniedError } from '@/presentation/errors/access-denied-error';
import { forbidden } from '@/presentation/helpers/http/http-helper';
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware';
import { HttpRequest } from '@/presentation/protocols/http';

interface SutTypes {
  sut: AuthMiddleware;
  loadAccountByTokenStub: LoadAccountByTokenUsecase;
}

function makeFakeAccount(): AccountModel {
  return {
    id: 'valid-id',
    name: 'valid-name',
    email: 'valid-email',
    password: 'hashed-password',
  };
}

function makeFakeRequest(): HttpRequest {
  return {
    headers: {
      'x-access-token': 'any-token',
    },
  };
}

function makeLoadAccountByToken(): LoadAccountByTokenUsecase {
  class LoadAccountByTokenStub implements LoadAccountByTokenUsecase {
    async load(): Promise<AccountModel> {
      return makeFakeAccount();
    }
  }

  return new LoadAccountByTokenStub();
}

function makeSut(): SutTypes {
  const loadAccountByTokenStub = makeLoadAccountByToken();
  const sut = new AuthMiddleware(loadAccountByTokenStub);
  return { sut, loadAccountByTokenStub };
}

describe('Auth Middleware', () => {
  it('should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  it('should call LoadAccountByToken with correct token', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load');
    await sut.handle(makeFakeRequest());

    expect(loadSpy).toHaveBeenCalledWith('any-token');
  });
});
