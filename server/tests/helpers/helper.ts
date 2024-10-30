// This file contains code that is reuse between tests.
import { FastifyInstance } from 'fastify';
import { createFastifyServer, destroyFastifyServer } from '../../src/fastify';

// build and tear down the server instance
export const createServer = (): FastifyInstance => {
  const server = createFastifyServer({ options: { logger: false } });
  beforeAll(async () => {
    await server.ready();
  });

  beforeEach(async () => {
    // Add service starts
  });

  afterAll(async () => {
    await destroyFastifyServer();
  });

  return server;
};
