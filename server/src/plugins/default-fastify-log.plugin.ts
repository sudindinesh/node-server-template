import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

const fastifyDefaultLogPlugin = async (fastify: FastifyInstance): Promise<void> => {
  fastify.addHook('onRequest', async (request: FastifyRequest) => {
    if (`${request.raw.url}`.startsWith('/health')) {
      return;
    }

    fastify.log.info('Received request', {
      url: request.raw.url,
      method: request.raw.method,
      headers: request.raw.headers,
      'x-amzn-trace-id': request.id,
    });
  });

  fastify.addHook('onResponse', async (request: FastifyRequest, response: FastifyReply) => {
    if (`${request.raw.url}`.startsWith('/health')) {
      return;
    }

    fastify.log.info('Request completed', {
      url: request.raw.url,
      method: request.raw.method,
      statusCode: response.raw.statusCode,
      'x-amzn-trace-id': request.id,
      responseTime: response.elapsedTime / 1000,
    });
  });
};

export default fp(fastifyDefaultLogPlugin);
