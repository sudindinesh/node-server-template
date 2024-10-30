import request from 'supertest';
import { createServer } from '../../helpers/helper';

describe('GET: /health', () => {
  const fastify = createServer();

  it('should return 200 with empty object response', () => request(fastify.server)
    .get('/health')
    .expect(200)
    .then((res) => expect(res.body).toEqual({})));
});
