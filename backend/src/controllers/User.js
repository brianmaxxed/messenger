import express from 'express';

import c from '../config/consts';
import sc from '../config/statusCodes';
import h, { asynced } from '../utils/helper';

export default class User {
  static routes(m) {
    const r = express.Router();

    return r;
  }
}
