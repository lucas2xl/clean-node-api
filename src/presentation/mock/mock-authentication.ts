import { AuthenticationUsecase } from '@/domain/usecases/authentication/authentication-usecase';

export function mockAuthenticationUsecase(): AuthenticationUsecase {
  class AuthenticationStub implements AuthenticationUsecase {
    async auth(): Promise<string> {
      return 'any-token';
    }
  }

  return new AuthenticationStub();
}
