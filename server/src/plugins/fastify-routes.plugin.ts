import fp from 'fastify-plugin';
import fastifyRoutes from '@fastify/routes';
import { FastifyInstance } from 'fastify';

/**
 * This plugin registers the fastify-routes plugin
 */
const routesPlugin = async (fastify: FastifyInstance): Promise<void> => {
  fastify.register(fastifyRoutes);
};

export default fp(routesPlugin);
