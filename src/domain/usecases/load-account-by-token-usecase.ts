import { AccountModel } from '@/domain/models/account-model';

export interface LoadAccountByTokenUsecase {
  load(token: string, role?: string): Promise<AccountModel>;
}
