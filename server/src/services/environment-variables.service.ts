import { z } from 'zod';
import { zodValidate, ZodValidateType } from './zod.service';

/*
 * We use Zod to be able to define the schema. This is then used to validate and map the env variables
 * sourced from process.env upon the server loading and throwing an ENV ERROR in case the sourced variables
 * don't match the zod schema. The retrieved env is then typed as 'EnvironmentVariables' for convenience.
 * How to use this:
 * In order to add a variable, simple add it to 'environmentVariablesSchema' Zod schema object defining the schema.
 * Then source the variable from process.env in 'envVariables' const within 'getEnvironmentVariables' function
 * for it to be validated.
 */

export const environmentVariablesSchema = z.object({
  SERVER_ENV: z.string().default('local'),
  FASTIFY_HOST: z.string(),
  FASTIFY_PORT: z.number().default(3000),
  BASE_URL: z.string(),
  BASE_PORT: z.number(),
  AWS_REGION: z.string(),
  VERSION: z.string().default('local'),

  LOGGER_LEVEL: z.string().default('info'),

  HTTP_REQUEST_TIMEOUT: z.number().optional().default(10000), // 10 seconds
});

export type EnvironmentVariables = z.infer<typeof environmentVariablesSchema>;

let envVariables: EnvironmentVariables;

export const createEnvironmentVariables = (): EnvironmentVariables => {
  const envs = {
    SERVER_ENV: process.env.SERVER_ENV,
    FASTIFY_HOST: process.env.FASTIFY_HOST,
    FASTIFY_PORT: process.env.FASTIFY_PORT ? parseInt(process.env.FASTIFY_PORT, 10) : undefined,
    BASE_URL: process.env.BASE_URL,
    BASE_PORT: process.env.BASE_PORT ? parseInt(process.env.BASE_PORT, 10) : undefined,
    AWS_REGION: process.env.AWS_REGION,
    VERSION: process.env.VERSION,

    LOGGER_LEVEL: process.env.LOGGER_LEVEL,

    HTTP_REQUEST_TIMEOUT: process.env.HTTP_REQUEST_TIMEOUT ? parseInt(process.env.HTTP_REQUEST_TIMEOUT, 10) : undefined,
  };

  envVariables = zodValidate(environmentVariablesSchema, envs, ZodValidateType.ENV);
  return envVariables;
};

export const getEnvironmentVariables = (): EnvironmentVariables => {
  if (!envVariables) {
    createEnvironmentVariables();
  }
  return envVariables;
};
