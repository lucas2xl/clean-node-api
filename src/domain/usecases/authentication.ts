export interface AuthenticationModel {
  email: string;
  password: string;
}

export interface Authentication {
  auth(authenticationData: AuthenticationModel): Promise<string>;
}
