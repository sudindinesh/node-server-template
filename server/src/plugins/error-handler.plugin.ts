import fp from 'fastify-plugin';
import {
  FastifyError, FastifyInstance, FastifyReply, FastifyRequest,
} from 'fastify';

/**
 * This plugin adds an error handler which converts our app exceptions to HTTP error responses
 */
const errorHandlerPlugin = async (fastify: FastifyInstance): Promise<void> => {
  fastify.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    reply.header('Content-Type', 'application/json; charset=utf-8');

    switch (error.name) {
      case 'NotFoundError':
        reply.code(404).send({ message: error.message });
        break;
      case 'AuthorisationError':
        reply.code(403).send({ message: error.message });
        break;
      case 'ValidationError':
      case 'BadRequestError':
        reply.code(400).send({ message: error.message });
        break;
      case 'PreconditionError':
        reply.code(428).send({ message: error.message });
        break;
      default:
        reply.code(500).send({ message: `Internal server error: ${error.message}` });
    }

    (reply.raw.statusCode < 500 ? fastify.log.warn : fastify.log.error)({
      error,
      stack: error.stack,
      meta: {
        url: request.raw.url,
        method: request.raw.method,
        statusCode: reply.raw.statusCode,
      },
    });
  });
};

export default fp(errorHandlerPlugin);
