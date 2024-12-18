import pino, { Logger } from 'pino';
import rTracer from 'cls-rtracer';

const LOGGER_NAME = 'FASTIFY_SERVER';

type ErrorJson = {
  message: string;
  name: string;
  stack?: string;
  status?: number;
};

/**
 * Converts any Error object into a Record
 *
 * @param error
 * @returns ErrorJson
 */
type ParseErrorsType = Error;
const parseError = (error: ParseErrorsType): ErrorJson => ({
  ...error,
  stack: error.stack,
  message: error.message,
  name: error.name,
});

type LogInputObject = Record<string | number, Error | unknown> | Error;
export type LogMetaObject = Record<string | number, unknown>;

/**
 * This function converts any errors into objects
 *
 * @param args
 * @returns args
 */

const parseErrorsWithinObject = (args: LogInputObject[]): LogInputObject[] => args.map((arg, index) => {
  if (arg instanceof Error) {
    return { error: parseError(arg) };
  }
  if (typeof arg === 'object') {
    Object.keys(arg).forEach((key) => {
      const argObj = arg[key];
      if (argObj instanceof Error) {
        arg[key] = parseError(argObj);
      }
    });
    return arg;
  }
  return { [`arg${index}`]: arg };
});

/**
 * This function takes an array of arguments and applies it to the method of the logger.
 * The arguments can be in the form of log({}, 'message'); OR log(error, 'message') OR log('message')
 * OR log('message', {}) OR log('message', error)
 * It also extracts values from errors and puts them into a JSON object.
 *
 * ts-ignore is being applied here as the method.apply types is not typed well to cater for objects being passed into the args array.
 *
 * @param pinoInstance
 * @param args
 * @param method
 * @param level
 * @returns {{meta: LogMetaObject, 'message'}}
 */
function convertAndMergeLogArgs(
  this: Logger,
  args: [msg: string, ...args: any[]],
  method: pino.LogFn,
): void {
  if (args.length === 1 && typeof args[0] === 'string') {
    method.apply(this, [args[0]]);
  } else if (args.length === 1 && typeof args[0] === 'object' && args[0] as object instanceof Error) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    method.apply(this, [{ meta: { error: parseError(args[0]) } }]);
  } else if (typeof args[0] === 'string' && args.length > 1) {
    const meta = parseErrorsWithinObject(args.slice(1));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    method.apply<unknown, unknown>(this, [{ meta: Object.assign({}, ...meta) }, args[0]]);
  } else if (typeof args[args.length - 1] === 'string' && args.length > 1) {
    const meta = parseErrorsWithinObject(args.slice(0, args.length - 1));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    method.apply(this, [{ meta: Object.assign({}, ...meta) }, args[args.length - 1]]);
  } else {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    method.apply(this, [{ ...args }]);
  }
}

export const getPinoLoggerOptions = (loggerLevel: string): pino.LoggerOptions => ({
  mixin: () => ({ 'x-amzn-trace-id': rTracer.id() }),
  level: loggerLevel,
  redact: ['req.headers.authorization'],
  formatters: { level: (label: string) => ({ level: label }) },
  serializers: { err: pino.stdSerializers.err },
  base: { name: LOGGER_NAME },
  messageKey: 'message',
  hooks: { logMethod: convertAndMergeLogArgs },
  timestamp: () => `,"timestamp":"${new Date().toISOString().replace(/T/, ' ').substring(0, 19)}"`,
});
