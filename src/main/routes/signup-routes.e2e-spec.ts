import * as request from 'supertest';
import app from '@/main/config/app';

describe('SignUp Routes', () => {
  it('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'any-name',
        email: 'any-email',
        password: 'any-password',
        passwordConfirmation: 'any-password',
      })
      .expect(200);
  });
});
