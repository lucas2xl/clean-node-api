import { AccountModel } from '@/domain/models/account-model';
import { AddAccountParams } from '@/domain/usecases/account/add-account-usecase';

export interface AddAccountRepository {
  add(accountData: AddAccountParams): Promise<AccountModel>;
}
