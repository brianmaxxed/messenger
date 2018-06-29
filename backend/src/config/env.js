import path from 'path';

// import .env variables
require('dotenv-safe').load({
  path: path.join(__dirname, '../../.env'),
  sample: path.join(__dirname, '../../.env.example'),
});

const env = {
  user: process.env.USER,
  appName: process.env.APP_NAME,
  debug: process.env.DEBUG === 'true',
  debugLevel: process.env.DEBUG_LEVEL,
  debugDb: process.env.DEBUG_DB === 'true',
  debugExpress: process.env.DEBUG_EXPRESS === 'true',
  debugUnitTests: process.env.DEBUG_UNIT_TESTS === 'true',
  stackTraceUnhandledErrors: process.env.STACKTRACE_UNHANDLED_ERRORS === 'true',
  unitTestDbSuffix: `${process.env.UNIT_TEST_DB_SUFFIX}_${process.env.USER}`,
  host: process.env.HOST,
  domain: process.env.DOMAIN,
  environment: process.env.NODE_ENV,
  port: process.env.PORT,
  mongo: {
    dbName: null,
    uri: null,
  },
};

const environment = process.env.NODE_ENV.toLowerCase() === 'test'
  ? process.env.TEST_ENV : process.env.NODE_ENV;

env.mongo.dbName = process.env.MONGO_DEV_DB;
env.mongo.uri = process.env.MONGO_DEV_URI;

export default env;
