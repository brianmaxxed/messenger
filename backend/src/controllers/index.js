import express from 'express';
import http from 'http';

import c from '../config/consts';
import sc from '../config/statusCodes';

// import User from './User';
import Image from './Image';
import Models from '../models/Models';

const router = express.Router();
const base = '/api/v1'; // hard code lang for now. make dynamic when needed.
const models = Models.all;

// router.use(`${base}/user`, User.routes(models.user));
router.use(`${base}/image`, Image.routes(models.image));

// catch 404 and forward to error handler
router.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
router.use((err, req, res, next) => {
  const status = err.status ? err.status : 500;
  let msg = `${status}: ${err.message}`;

  if (!Array.isArray(msg)) {
    msg = [msg];
  }

  const response = { errors: msg };
  if (err.data) {
    response.errors = err.data;
  }

  res.status(status).send(response);
});

export default router;
