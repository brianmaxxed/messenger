/* eslint import/first:0, eslint-disable, eslint global-require:0, no-shadow:0 */
import _ from 'lodash';
import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import csrf from 'csurf'; // https://github.com/expressjs/csurf
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import compression from 'compression';
import responseTime from 'response-time';
import methodOverride from 'method-override';

import c from './config/consts';
import mongo from './config/mongoose';
import env from './config/env';
import controllers from './controllers';

require('dotenv-safe').config();

// global variables for this file:
let httpServer = null;
const app = express();

// startup services: http server, mongoose, redis, etc.
const startup = async (overridePort) => {
  try {
    const port = overridePort || app.get(c.PORT);

    // connect to mongo through mongoose.
    mongo.setDebug(env.debug);
    await mongo.connect();

    // create http server wrapper around express app.
    httpServer = http.createServer(app);
    httpServer.listen(port);

    console.log('listening at http://%s:%d', env.host, port);
  } catch (e) {
    console.log('Error: ', e.stack);
  }

  return httpServer;
};

// gracefully shutdown services: http server, redis, mongoose, etc.
const shutdown = async (canExit = true) => {
  console.log(`app '${env.appName}' terminating.`);
  console.log('closing server...');

  try {
    await httpServer.close();
    console.log('express server close.');

    await mongoose.connection.close();
    console.log('Mongoose default connection disconnected.');

    // imperative to remove all event listeners.
    mongoose.connection.removeAllListeners();
  } catch (e) {
    console.log('Uncaught Shutdown Error:', e.stack);
  }

  console.log('Finally exiting.');
  if (canExit) {
    process.exit(1);
  }

  return null;
};


app.use(helmet());

app.disable('x-powered-by');


app.use(responseTime());
app.use(compression());
app.use(cors({
  origin: '*',
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Accept-Encoding'],
}));
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  bodyParser.json({
    verify(req, res, buf, encoding) {
      req.rawBody = buf.toString();
    },
  })(req, res, (err) => {
    if (err) {
      const msg = err.message.indexOf('JSON') !== -1 ? err.message : 'internal error';
      res.status(500).send({
        error: {
          status: 500,
          msg,
        },
      });

      console.log(c.ERROR, {
        status: err.status || 500,
        message: err.msg,
        error: err,
      });
    } else {
      next();
    }
  });
});

app.use(cookieParser());

app.set('trust proxy', true);
app.set(c.PORT, env.port);

// TODO: need to review best practice for morgan and fix loger.stream console issue.
if (env.debug && env.debugExpress) {
  console.log("Overriding 'Express' logger");
}

app.use(controllers);

module.exports = {
  app,
  httpServer,
  startup,
  shutdown,
};
