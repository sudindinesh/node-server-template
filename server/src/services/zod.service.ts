import { ZodIssue, ZodSchema } from 'zod';
import { ZodTypeDef } from 'zod/lib/types';
import { EnvError, ValidationError } from '../errors';

export enum ZodValidateType {
  DEFAULT,
  REQUEST_BODY,
  REQUEST_PARAMS,
  ENV,
}

export const compileZodErrorMessage = (issues: ZodIssue[], initialMessage: string): string => {
  let finalMessage = initialMessage;
  issues.forEach((issue: ZodIssue, index: number) => {
    const { message, code, path } = issue;
    finalMessage += ` ${index + 1}: ${message} at path '${path.join('/')}' - Failed with code '${code}'.`;
  });
  return finalMessage;
};

export const zodValidate = <Output, Input = Output>(
  schema: ZodSchema<Output, ZodTypeDef, Input>,
  payload: unknown,
  type: ZodValidateType,
): Output => {
  const result = schema.safeParse(payload);
  if (result.success) {
    return result.data;
  }

  switch (type) {
    case ZodValidateType.REQUEST_BODY:
      throw new ValidationError(
        compileZodErrorMessage(
          result.error.issues,
          `Validation Error: There are ${result.error.issues.length} errors in the provided request body.`,
        ),
      );
    case ZodValidateType.REQUEST_PARAMS:
      throw new ValidationError(
        compileZodErrorMessage(
          result.error.issues,
          `Validation Error: There are ${result.error.issues.length} errors in the provided request params.`,
        ),
      );
    case ZodValidateType.ENV:
      throw new EnvError(
        compileZodErrorMessage(
          result.error.issues,
          `Env Error: There are ${result.error.issues.length} errors in the set environmental variables.`,
        ),
      );
    default:
      throw new Error(
        compileZodErrorMessage(
          result.error.issues,
          `Zod validation Error: There are ${result.error.issues.length} issues`,
        ),
      );
  }
};
