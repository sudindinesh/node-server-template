import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { getEnvironmentVariables } from '../services/environment-variables.service';

/**
 * This plugin adds Swagger the documentation front-end to Fastify
 */
const swaggerPlugin = async (fastify: FastifyInstance): Promise<void> => {
  const env = getEnvironmentVariables();

  // disable in production
  if (env.SERVER_ENV === 'live') {
    return;
  }

  fastify.register(fastifySwaggerUi, {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  });
};

export default fp(swaggerPlugin, {
  name: 'fastify-swagger-ui',
  dependencies: ['fastify-swagger'],
});
