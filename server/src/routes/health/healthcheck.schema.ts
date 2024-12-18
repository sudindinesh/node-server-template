import { z } from 'zod';

/*
 * GET /
 */
export const getHealthCheckResponseSchema = z.string();

export type GetHealthCheckResponse = z.infer<typeof getHealthCheckResponseSchema>;

/*
 * GET /complete
 */
export const integrationStatusSchema = z
  .object({
    name: z.string(),
    status: z.enum(['ok', 'error']),
    message: z.string().optional(),
  })
  .strict();

export type IntegrationStatus = z.infer<typeof integrationStatusSchema>;

export const endpointStatusSchema = z
  .object({
    name: z.string(),
    status: z.enum(['available', 'unavailable']),
  })
  .strict();

export type EndpointStatus = z.infer<typeof endpointStatusSchema>;

export const completeHealthCheckResponseSchema = z
  .object({
    integrations: z.array(integrationStatusSchema),
    endpoints: z.array(endpointStatusSchema),
    tag: z.string(),
  })
  .strict();

export type CompleteHealthCheckResponse = z.infer<typeof completeHealthCheckResponseSchema>;
