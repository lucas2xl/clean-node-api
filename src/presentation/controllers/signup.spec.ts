import { SignUpController } from './signup';

describe('SignUp Controller', () => {
  it('Should return 400 if no name is provided', () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    delete httpRequest.body.name;

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
  });
});