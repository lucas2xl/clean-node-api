export interface AuthenticationModel {
  email: string;
  password: string;
}

export interface AuthenticationUsecase {
  auth(authenticationData: AuthenticationModel): Promise<string>;
}
