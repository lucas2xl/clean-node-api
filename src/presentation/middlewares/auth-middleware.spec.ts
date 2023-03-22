import { AccessDeniedError } from '@/presentation/errors/access-denied-error';
import { forbidden } from '@/presentation/helpers/http/http-helper';
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware';
import { HttpRequest } from '@/presentation/protocols/http';

interface SutTypes {
  sut: any;
}

function makeFakeRequest(): HttpRequest {
  return {
    headers: {},
  };
}

function makeSut(): SutTypes {
  const sut = new AuthMiddleware();
  return { sut };
}

describe('Auth Middleware', () => {
  it('should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });
});
