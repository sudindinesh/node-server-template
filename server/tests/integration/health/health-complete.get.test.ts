import request from 'supertest';
import { createServer } from '../../helpers/helper';

describe('GET: /health/complete', () => {
  const fastify = createServer();

  beforeEach(() => {
    jest.clearAllMocks();

    // jest.spyOn(GraphDBService, 'isConnected').mockResolvedValue(true);
  });

  it('should map to GET /health/complete', () => request(fastify.server).get('/health/complete').expect(200));

  describe('response payload', () => {
    describe('.integrations', () => {
      describe('GraphDB', () => {
        it('should return ok status if check succeeds', async () => {
          await request(fastify.server)
            .get('/health/complete')
            .expect(200)
            .then((res) => expect(res.body.integrations).toEqual(
              expect.arrayContaining([
                {
                  name: 'graphdb',
                  status: 'ok',
                  message: expect.any(String),
                },
              ]),
            ));
        });

        // it('should return error status if check fails', async () => {
        //   jest.spyOn(GraphDBService, 'isConnected').mockReturnValueOnce(Promise.resolve(false));
        //
        //   await request(fastify.server)
        //     .get('/health/complete')
        //     .expect(200)
        //     .then((res) =>
        //       expect(res.body.integrations).toEqual(
        //         expect.arrayContaining([
        //           {
        //             name: 'postgres',
        //             status: 'error',
        //             message: expect.any(String)
        //           }
        //         ])
        //       )
        //     );
        // });
      });
    });

    describe('.endpoints', () => {
      it('should contain endpoint GET: /health/', async () => {
        await request(fastify.server)
          .get('/health/complete')
          .expect(200)
          .then((res) => expect(res.body.endpoints).toEqual(
            expect.arrayContaining([
              {
                name: 'GET: /health/',
                status: 'available',
              },
            ]),
          ));
      });

      it('should contain endpoint GET: /health/complete', async () => {
        await request(fastify.server)
          .get('/health/complete')
          .expect(200)
          .then((res) => expect(res.body.endpoints).toEqual(
            expect.arrayContaining([
              {
                name: 'GET: /health/complete',
                status: 'available',
              },
            ]),
          ));
      });
    });

    describe('.tag', () => {
      it('should display a tag on the complete healthcheck', async () => {
        await request(fastify.server)
          .get('/health/complete')
          .expect(200)
          .then((res) => expect(res.body.tag).toBe('local'));
      });
    });
  });
});
