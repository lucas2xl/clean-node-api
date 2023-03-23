export interface AccountModel {
  id: string;
  name: string;
  email: string;
  password: string;
  token?: string;
  role?: string;
}
