import { AccountModel } from '@/domain/models/account-model';

export type AddAccountParams = Omit<AccountModel, 'id'>;

export interface AddAccountUsecase {
  add(accountData: AddAccountParams): Promise<AccountModel>;
}
