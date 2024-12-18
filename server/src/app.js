const Fastify = require('fastify');
const qs = require('qs');
const path = require('path');
const AutoLoad = require('@fastify/autoload');
const { v4: uuidv4 } = require('uuid');
const { ValidationError } = require('./errors');

module.exports = ({ options = {}, beforeAutoload = () => {} } = {}) => {
  const server = Fastify({
    ...options,
    querystringParser: (str) => qs.parse(str, { comma: true }),
    schemaErrorFormatter: (errors, dataVar) => {
      if (dataVar === 'querystring') {
        const [error] = errors;
        return new ValidationError(`${error.instancePath}: ${error.message}`);
      }

      return undefined;
    },
    genReqId: () => uuidv4(),
    requestIdHeader: 'x-amzn-trace-id',
    requestIdLogLabel: 'x-amzn-trace-id'
  });

  global.fastify = server;
  beforeAutoload(server);

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options,
    ignorePattern: /.*(schema|shared|service).(js)/
  });

  return server;
};
