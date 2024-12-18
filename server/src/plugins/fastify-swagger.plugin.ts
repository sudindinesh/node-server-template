import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import fastifySwagger, { JSONObject } from '@fastify/swagger';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { FastifySchema } from 'fastify/types/schema';
import { ZodSchema } from 'zod';
import { getEnvironmentVariables } from '../services/environment-variables.service';

/**
 * This plugin adds Swagger documentation to Fastify
 */
const swaggerPlugin = async (fastify: FastifyInstance): Promise<void> => {
  const env = getEnvironmentVariables();

  // disable in production
  if (env.SERVER_ENV === 'live') {
    return;
  }

  fastify.register(fastifySwagger, {
    swagger: {
      info: {
        title: 'Fastify Server',
        description: 'Swagger docs for Fastify server',
        version: '0.1.0',
      },
      host: `${env.BASE_URL}:${env.BASE_PORT}`,
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'health', description: 'Heath-check related end-points' },
      ],
    },
    transform: ({ schema, url }: { schema: FastifySchema; url: string }): { schema: JSONObject; url: string } => {
      const {
        params, body, querystring, headers, ...others
      } = schema;

      return {
        schema: {
          ...(body ? { body: zodToJsonSchema(body as ZodSchema) as JSONObject } : {}),
          ...(querystring ? { body: zodToJsonSchema(querystring as ZodSchema) as JSONObject } : {}),
          ...(params ? { params: zodToJsonSchema(params as ZodSchema) as JSONObject } : {}),
          ...(headers ? { headers: zodToJsonSchema(headers as ZodSchema) as JSONObject } : {}),
          ...(others ? ({ ...others } as JSONObject) : {}),
        },
        url,
      };
    },
  });
};

export default fp(swaggerPlugin, {
  name: 'fastify-swagger',
});
