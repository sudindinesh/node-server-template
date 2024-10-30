import 'source-map-support/register';
import { v4 as uuidv4 } from 'uuid';
import { createFastifyServer, destroyFastifyServer, getFastifyServer } from './fastify';
import { getEnvironmentVariables } from './services/environment-variables.service';
import { getPinoLoggerOptions } from './pino-logger';

export const stop = async (): Promise<void> => {
  await destroyFastifyServer();
};

export const start = async (): Promise<void> => {
  const env = getEnvironmentVariables();

  try {
    const server = createFastifyServer({
      options: {
        logger: getPinoLoggerOptions(env.LOGGER_LEVEL),
        genReqId: () => uuidv4(),
        requestIdHeader: 'x-amzn-trace-id',
        requestIdLogLabel: 'x-amzn-trace-id',
        disableRequestLogging: true,
      },
    });
    await server.listen({ port: env.FASTIFY_PORT, host: env.FASTIFY_HOST });
  } catch (err) {
    // eslint-disable-next-line
    console.log('Unable to start server', err);
    await stop();
    process.exit(1);
  }
};

process.on('uncaughtException', (error: Error) => {
  try {
    getFastifyServer().log.error('Uncaught exception', error);
  } catch {
    // eslint-disable-next-line no-console
    console.error('Failed to log uncaught exception', error);
  }
});

process.on('unhandledRejection', (reason: unknown) => {
  try {
    getFastifyServer().log.error('Unhandled rejection', reason);
  } catch {
    // eslint-disable-next-line no-console
    console.error('Failed to log unhandled rejection', reason);
  }
});

start();
