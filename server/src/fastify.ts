import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import path from 'path';
import fastifyAutoload from '@fastify/autoload';

export interface FastifyServerProps {
  options: FastifyServerOptions;
}

let fastifyServer: FastifyInstance | null;
declare global {
  // eslint-disable-next-line
  var fastify: FastifyInstance;
}

export const createFastifyServer = (props: FastifyServerProps): FastifyInstance => {
  if (fastifyServer) {
    return fastifyServer;
  }

  const { options } = props;
  const server: FastifyInstance = fastify(options);
  globalThis.fastify = server;

  // This loads all plugins defined in plugins
  server.register(fastifyAutoload, {
    dir: path.resolve(__dirname, 'plugins'),
    options: { ...options },
  });

  // This loads all routes defined in routes folder
  server.register(fastifyAutoload, {
    dir: path.resolve(__dirname, 'routes'),
    options: { ...options },
    ignorePattern: /.*(schema|service).(js|ts)/,
  });

  fastifyServer = server;
  return server;
};

export const getFastifyServer = (): FastifyInstance => {
  if (!fastifyServer) {
    throw new Error('Fastify server is not started!');
  }
  return fastifyServer;
};

export const destroyFastifyServer = async (): Promise<void> => {
  if (!fastifyServer) {
    return;
  }
  await fastifyServer.close();
  fastifyServer = null;
};
