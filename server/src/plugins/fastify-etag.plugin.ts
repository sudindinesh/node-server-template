import fp from 'fastify-plugin';
import fastifyEtag from '@fastify/etag';
import { FastifyInstance } from 'fastify';

/**
 * This plugin registers the fastify-etag plugin
 */
const etagPlugin = async (fastify: FastifyInstance): Promise<void> => {
  fastify.register(fastifyEtag);
};

export default fp(etagPlugin);
