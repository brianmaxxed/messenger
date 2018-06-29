/* eslint class-methods-use-this: 0, max-len: 0, valid-typeof:0, no-empty-function:0 */
import _ from 'lodash';
import mongoose from 'mongoose';
import moment from 'moment';
import uuidv4 from 'uuid/v4';

import UserSchema from './schemas/UserSchema';
import UserBase from './base/UserBase';
import c from '../config/consts';
import sc from '../config/statusCodes';
import models from './consts/models';
import h, { statusObject, errorObject } from '../utils/helper';
import env from '../config/env';

export default class User extends UserBase {
  static get Model() {
    return mongoose.model(models.user, UserSchema);
    // need to do some automated testing on this method for all models.
  }

  get Model() {
    return User.Model;
    // need to do some automated testing on this method for all models.
  }

  async ping(req = {}) {
    try {
      // TODO: get rid of returning actual data later, use for now.
      // TODO: limit to 10, and other limits.

      const u = await User.Model.find({}, { username: 1, _id: 0 }).limit(30).lean();

      return { status: sc.SUCCESS.status, data: { message: u } };
    } catch (e) {
      return h.unhandledErrorObject(e);
    }
  }
}
