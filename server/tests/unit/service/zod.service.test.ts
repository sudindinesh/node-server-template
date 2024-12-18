import { z } from 'zod';
import { zodValidate, ZodValidateType } from '../../../../src/services/zod.service';

describe('Zod Service', () => {
  describe('when we try validate Request body using zod', () => {
    const testBodySchema = z.object({
      id: z.number(),
      defaulted: z.number().default(10)
    });
    type TestSchema = z.infer<typeof testBodySchema>;

    it('should respond with the payload if successful', () => {
      const result: TestSchema = zodValidate(testBodySchema, { id: 1 }, ZodValidateType.REQUEST_BODY);
      expect(result.id).toEqual(1);
      expect(result.defaulted).toEqual(10);
    });

    it('should throw an error if validation fails', () => {
      expect(() => zodValidate(testBodySchema, { id: 'test' }, ZodValidateType.REQUEST_BODY)).toThrow(
        "Validation Error: There are 1 errors in the provided request body. 1: Expected number, received string at path 'id' - Failed with code 'invalid_type'."
      );
    });
  });

  describe('when we try validate Request Params using zod', () => {
    const testParamsSchema = z.object({
      id: z.number()
    });
    type TestSchema = z.infer<typeof testParamsSchema>;

    it('should respond with the payload if successful', () => {
      const result: TestSchema = zodValidate(testParamsSchema, { id: 1 }, ZodValidateType.REQUEST_PARAMS);
      expect(result.id).toEqual(1);
    });

    it('should throw an error if validation fails', () => {
      expect(() => zodValidate(testParamsSchema, { id: 'test' }, ZodValidateType.REQUEST_PARAMS)).toThrow(
        "Validation Error: There are 1 errors in the provided request params. 1: Expected number, received string at path 'id' - Failed with code 'invalid_type"
      );
    });
  });

  describe('when we try validate environment variables using zod', () => {
    const testEnvSchema = z.object({
      HOST: z.string(),
      PORT: z.number()
    });
    type TestEnvSchema = z.infer<typeof testEnvSchema>;

    it('should respond with the payload if successful', () => {
      const result: TestEnvSchema = zodValidate(testEnvSchema, { HOST: 'localhost', PORT: 3000 }, ZodValidateType.ENV);
      expect(result.PORT).toEqual(3000);
      expect(result.HOST).toEqual('localhost');
    });

    it('should throw an error if validation fails', () => {
      expect(() => zodValidate(testEnvSchema, { HOST: 'localhost' }, ZodValidateType.ENV)).toThrow(
        "Env Error: There are 1 errors in the set environmental variables. 1: Required at path 'PORT' - Failed with code 'invalid_type'."
      );
    });
  });

  describe('when we try validate variables using zod and no type is specified', () => {
    const testEnvSchema = z.object({
      HOST: z.string(),
      PORT: z.number()
    });
    type TestEnvSchema = z.infer<typeof testEnvSchema>;

    it('should respond with the payload if successful', () => {
      const result: TestEnvSchema = zodValidate(
        testEnvSchema,
        { HOST: 'localhost', PORT: 3000 },
        ZodValidateType.DEFAULT
      );
      expect(result.PORT).toEqual(3000);
      expect(result.HOST).toEqual('localhost');
    });

    it('should throw an error if validation fails', () => {
      expect(() => zodValidate(testEnvSchema, { HOST: 'localhost' }, ZodValidateType.DEFAULT)).toThrow(
        "Zod validation Error: There are 1 issues 1: Required at path 'PORT' - Failed with code 'invalid_type'."
      );
    });
  });
});
