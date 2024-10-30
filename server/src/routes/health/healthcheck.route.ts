import { FastifyInstance } from 'fastify';
import { zodToJsonSchema } from 'zod-to-json-schema';
import {
  IntegrationStatus,
  EndpointStatus,
  CompleteHealthCheckResponse,
  completeHealthCheckResponseSchema,
  GetHealthCheckResponse,
  getHealthCheckResponseSchema,
} from './healthcheck.schema';
import { HealthcheckService } from './healthcheck.service';
import { EnvironmentVariables, getEnvironmentVariables } from '../../services/environment-variables.service';

const env: EnvironmentVariables = getEnvironmentVariables();

const HealthCheckRoute = async (fastify: FastifyInstance): Promise<void> => {
  /**
   * Used for Elastic Beanstalk Health checks. For more information please see the following documentation:
   * https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.healthstatus.html#using-features.healthstatus.understanding
   *
   */
  fastify.get(
    '/',
    {
      schema: {
        description: 'Used for Elastic Beanstalk Health checks.',
        tags: ['health'],
        response: {
          200: {
            description: 'Empty string/body',
            ...zodToJsonSchema(getHealthCheckResponseSchema),
          },
        },
      },
    },
    async (): Promise<GetHealthCheckResponse> => '',
  );

  fastify.get(
    '/complete',
    {
      schema: {
        description:
          'Used for a complete detailed health check which lists all integrations and endpoints with their current status',
        tags: ['health'],
        response: {
          200: {
            description: 'List of all integrations and endpoints with their respective status',
            ...zodToJsonSchema(completeHealthCheckResponseSchema),
          },
        },
      },
    },
    async (): Promise<CompleteHealthCheckResponse> => {
      const routes = Array.from(fastify.routes, ([path, routes]) => ({ path, routes })).filter(
        ({ path }) => !path.startsWith('/documentation'),
      );

      const routeStatusList = routes.reduce((list, { routes }) => {
        routes.forEach((route) => list.push({ name: `${route.method}: ${route.url}`, status: 'available' }));
        return list;
      }, [] as EndpointStatus[]);

      const integrationsStatusList: IntegrationStatus[] = await Promise.all([
        // GraphDB status check:
        (async () => {
          const status = await HealthcheckService.isGraphDBAccessible();

          return {
            name: 'graphdb',
            status: status.success ? 'ok' : 'error',
            message: status.message,
          } as IntegrationStatus;
        })(),

        // Add more integrations here:
      ]);

      return {
        integrations: integrationsStatusList,
        endpoints: routeStatusList,
        tag: env.VERSION,
      };
    },
  );
};

export default HealthCheckRoute;
