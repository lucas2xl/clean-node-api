import { AccountModel } from '@/domain/models/account-model';
import { AddAccountUsecase } from '@/domain/usecases/account/add-account-usecase';

export function mockAddAccountParams(): AddAccountUsecase.Params {
  return {
    name: 'any-name',
    email: 'any-email',
    password: 'any-password',
  };
}

export function mockAddAccountWithTokenParams(): AddAccountUsecase.Params {
  return {
    name: 'any-name',
    email: 'any-email',
    password: 'any-password',
    token: 'any-token',
  };
}

export function mockAddAccountWithTokenAndRoleParams(
  role = 'admin',
): AddAccountUsecase.Params {
  return {
    name: 'any-name',
    email: 'any-email',
    password: 'any-password',
    token: 'any-token',
    role,
  };
}

export function mockAccountModel(): AccountModel {
  return {
    id: 'any-id',
    name: 'any-name',
    email: 'any-email',
    password: 'any-password',
  };
}
