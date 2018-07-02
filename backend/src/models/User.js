/* eslint class-methods-use-this: 0, max-len: 0, valid-typeof:0, no-empty-function:0 */
import _ from 'lodash';
import mongoose from 'mongoose';
import moment from 'moment';
import uuidv4 from 'uuid/v4';

import UserSchema from './schemas/UserSchema';
import c from '../config/consts';
import sc from '../config/statusCodes';
import models from './consts/models';
import h, { statusObject, errorObject } from '../utils/helper';
import env from '../config/env';

export default class User {
  static get Model() {
    return mongoose.model(models.user, UserSchema);
  }

  get Model() {
    return User.Model;
  }
}
