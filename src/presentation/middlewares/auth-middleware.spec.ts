import { mockLoadAccountByTokenRepository } from '@/data/mock/mock-db-account';
import { LoadAccountByTokenRepository } from '@/data/protocols/database/account/load-account-by-token-repository';
import { AccessDeniedError } from '@/presentation/errors/access-denied-error';
import {
  forbidden,
  ok,
  serverError,
} from '@/presentation/helpers/http/http-helper';
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware';
import { HttpRequest } from '@/presentation/protocols/http';

type SutTypes = {
  sut: AuthMiddleware;
  loadAccountByTokenStub: LoadAccountByTokenRepository;
};

function mockRequest(): HttpRequest {
  return {
    headers: {
      'x-access-token': 'any-token',
    },
  };
}

function makeSut(role?: string): SutTypes {
  const loadAccountByTokenStub = mockLoadAccountByTokenRepository();
  const sut = new AuthMiddleware(loadAccountByTokenStub, role);
  return { sut, loadAccountByTokenStub };
}

describe('Auth Middleware', () => {
  it('should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  it('should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest.spyOn(loadAccountByTokenStub, 'loadByToken').mockReturnValueOnce(null);
    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  it('should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenStub, 'loadByToken')
      .mockRejectedValueOnce(new Error());
    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should call LoadAccountByToken with correct token', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'loadByToken');
    await sut.handle(mockRequest());

    expect(loadSpy).toHaveBeenCalledWith('any-token', undefined);
  });

  it('should call LoadAccountByToken with correct token and role', async () => {
    const role = 'any-role';
    const { sut, loadAccountByTokenStub } = makeSut(role);
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'loadByToken');
    await sut.handle(mockRequest());

    expect(loadSpy).toHaveBeenCalledWith('any-token', role);
  });

  it('should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(ok({ accountId: 'any-id' }));
  });
});
