import { AuthenticationUsecase } from '@/domain/usecases/authentication/authentication-usecase';

export function mockAuthenticationParams(): AuthenticationUsecase.Params {
  return {
    email: 'any-email',
    password: 'any-password',
  };
}
