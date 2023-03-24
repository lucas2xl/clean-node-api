export type AuthenticationParams = {
  email: string;
  password: string;
};

export interface AuthenticationUsecase {
  auth(authenticationData: AuthenticationParams): Promise<string>;
}
