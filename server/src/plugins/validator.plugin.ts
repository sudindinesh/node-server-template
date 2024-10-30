import { ZodSchema } from 'zod';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { FastifyRouteSchemaDef } from 'fastify/types/schema';
import { zodValidate, ZodValidateType } from '../services/zod.service';

/**
 * This plugin helps validate the body against the zod schema
 */
const validatorPlugin = async (fastify: FastifyInstance): Promise<void> => {
  fastify.setValidatorCompiler((schemaDefinition: FastifyRouteSchemaDef<ZodSchema<unknown>>) => {
    const { schema } = schemaDefinition;
    if (schema) {
      return (data) => {
        const result = zodValidate(schema, data, ZodValidateType.REQUEST_BODY);
        return { value: result };
      };
    }
    return (data) => ({ value: data });
  });
};

export default fp(validatorPlugin);
