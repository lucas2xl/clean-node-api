import { AddAccountModel } from '@/domain/usecases/add-account-usecase';
import { AccountModel } from '@/domain/models/account-model';

export interface AddAccountRepository {
  add(accountData: AddAccountModel): Promise<AccountModel>;
}
