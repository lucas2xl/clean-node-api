import * as request from 'supertest';
import app from '@/main/config/app';

describe('Body Parses Middleware', () => {
  it('Should parse body as json', async () => {
    app.post('/test_body_parse', (req, res) => {
      res.send(req.body);
    });

    await request(app)
      .post('/test_body_parse')
      .send({ name: 'name' })
      .expect({ name: 'name' });
  });
});
