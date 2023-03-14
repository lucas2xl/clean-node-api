import { MissingParamError } from '../errors/missing-param-error';
import { SignUpController } from './signup';

interface CreateUser {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}
let user: CreateUser;

beforeEach(() => {
  user = {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password',
  };
});

describe('SignUp Controller', () => {
  it('Should return 400 if no name is provided', () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: user,
    };
    delete httpRequest.body.name;

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  it('Should return 400 if no email is provided', () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: user,
    };
    delete httpRequest.body.email;

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  it('Should return 400 if no password is provided', () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: user,
    };
    delete httpRequest.body.password;

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });
});
