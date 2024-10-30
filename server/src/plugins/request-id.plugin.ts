import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import rTracer from 'cls-rtracer';

const requestIdPlugin = async (fastify: FastifyInstance): Promise<void> => {
  fastify.register(rTracer.fastifyPlugin, {
    useFastifyRequestId: true,
    headerName: 'x-amzn-trace-id',
  });
};

export default fp(requestIdPlugin);
