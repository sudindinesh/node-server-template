import * as dotenv from 'dotenv';
import * as fs from 'fs';

if (process.env.LOCAL_RUN === 'true') {
  // make sure we load the test env with overrides for any existing ENV props
  const envConfig = dotenv.parse(fs.readFileSync('.env.test'));
  Object.entries(envConfig).forEach(([key, value]) => (process.env[key] = value));
}
