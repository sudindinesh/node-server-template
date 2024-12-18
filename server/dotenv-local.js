const dotenv = require('dotenv');
const fs = require('fs');

/*
 * THIS IS ONLY FOR USE FOR LOCAL DEV OUTSIDE OF DOCKER!
 *
 * This will load the '.env.local' config file and override
 * any existing process.env values that alrady exist in the
 * local environment.
 */
const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
Object.entries(envConfig).forEach(([key, value]) => (process.env[key] = value));
