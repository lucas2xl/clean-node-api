import { AuthenticationParams } from '@/domain/usecases/authentication/authentication-usecase';

export function mockAuthenticationParams(): AuthenticationParams {
  return {
    email: 'any-email',
    password: 'any-password',
  };
}
