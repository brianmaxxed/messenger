/*
  eslint no-useless-escape:0, no-useless-concat:0,
  no-shadow:0, no-restricted-syntax:0, no-await-in-loop:0
*/

import moment from 'moment';
import _ from 'lodash';
import u from 'util';
import uuid from 'uuid/v4';

import c from '../config/consts';
import sc from '../config/statusCodes';
import ec from '../config/errorCodes';
import env from '../config/env';

const mapToArray = (map) => {
  const output = [];

  map.forEach((value, key, map) => {
    output.push(value);
  });

  return output;
};


const wrapAsync = async fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

const statusObject = (sc, output = {}) => {
  const { id, status, msg } = sc;
  return {
    id,
    status, // TODO: need to consolidate sc to status not code.
    msg,
    data: output,
  };
};

const hasOnlyOne = (obj = {}, fields = []) => {
  const out = fields.filter(f => f in obj).map(k => ({ field: k, value: obj[k] }));
  return (out.length === 1) ? out : [];
};

const wrapErrorCode = error => ([{ error }]);

const errorObject = (error) => {
  const output = {};

  if (!error) {
    return output;
  }

  const { id = 0, status = 500, msg = 'internal error' } = error;

  output.id = id;
  output.status = status;
  output.msg = msg;

  if (_.get(error, 'errors')) {
    output.errors = error.errors;
  } else {
    output.errors = [];
    const e = {
      error: {
        id,
        status,
        msg,
      },
    };

    if (error.extra) e.extra = error.extra;
    output.errors.push(e);
  }

  return output;
};

/*
  log an unhandled error and output errorObject depending on debug options

*/

const unhandledErrorObject = (e) => {
  if (env.environment === 'production' && !env.stackTraceUnhandledErrors) {
    console.log(`${e.message} ${e.extra}`);
  } else {
    console.log(e.stack);
  }
  if (env.environment !== 'production' || env.debug) return errorObject(e);
  return errorObject(sc.INTERNAL_ERROR);
};

const processResults = (payload, res, next) => {
  const output = Object.assign({}, payload);

  if (output) {
    if (output.error) {
      if (output.errors) {
        output.errors.push({ msg: output.error.msg, stack: output.error.stack });
      } else {
        output.errors = [{ error: output.error }];
      }
      delete output.error;
      if (!_.has(output, 'status')) {
        output.status = output.errors[0].status || 500;
      }
    }

    res.type('json');
    res.status(output.status || 500).send(output);
  }

  if (!res.headersSent) {
    next();
  }

  return output;
};

const asynced = async (inst, fn, params) => {
  const [req, res, next] = params;
  const out = await inst[fn](req);
  processResults(out, res, next);

  return out;
};

const asyncForEachLinear = async (ar, fn) => {
  for (const t of ar) { await fn(t); }
};

const asyncForEach = async (ar, fn) => {
  await Promise.all(ar.map(fn));
};

const formatTimeLeft = (time) => {
  const minutes = (time) / 60 > 1 ? (time) / 60 : 1;
  return `${minutes} minute${(minutes !== 1) ? 's' : ''}`;
};

// TODO: not used at the moment.
const escapeRegExp = str => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

module.exports = {
  mapToArray,
  wrapErrorCode,
  hasOnlyOne,
  processResults,
  statusObject,
  errorObject,
  unhandledErrorObject,
  formatTimeLeft,
  asynced,
  asyncForEachLinear,
  asyncForEach,
};
