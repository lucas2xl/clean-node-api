export type AuthenticationModel = {
  email: string;
  password: string;
};

export interface AuthenticationUsecase {
  auth(authenticationData: AuthenticationModel): Promise<string>;
}
