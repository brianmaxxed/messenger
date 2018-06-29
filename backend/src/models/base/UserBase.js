/* eslint class-methods-use-this: 0, max-len: 0, valid-typeof:0, no-empty-function:0 */
import _ from 'lodash';
import mongoose from 'mongoose';
import moment from 'moment';
import uuidv4 from 'uuid/v4';

import UserSchema from '../schemas/UserSchema';
import Base from './Base';
import c from '../../config/consts';
import sc from '../../config/statusCodes';
import models from '../consts/models';
import h, { statusObject, errorObject } from '../../utils/helper';
import env from '../../config/env';

export default class UserBase {
  static get Model() {
    const model = mongoose.model(models.user, UserSchema);

    return model;
    // need to do some automated testing on this method for all models.
  }

  get Model() {
    const model = mongoose.model(models.user, UserSchema);

    return model;
    // need to do some automated testing on this method for all models.
  }

  isAuthN(req) {
    return (_.isObject(req) && 'auth' in req &&
      req.auth.expired === false &&
      req.auth.verified === true);
  }

  isAuthZ(req, role) {
    if (this.isAuthN(req)) {
      if (role === 'user') { // need to change this user to another role when done.
        return true;
      }
      return sc.NOT_AUTHORIZED;
    }
    return sc.NOT_AUTHENTICATED;
  }

  securePayload(u) {
    const user = Object.assign({}, u);
    delete user.password;

    return user;
  }

  async setProperty() {
    //
  }

  async getProperty() {
  }

  async findValidUser(query = {}, useLean = false, proj = {}) {
    const user = await this.Model.findValidUser(query, useLean, proj);
    return user;
  }

  async getFreshAuthedUserDetails(req, useLean = false) {
    const results = this.getAuthedUserDetails(req, c.REFRESH_FROM_DB, useLean);
    return results;
  }

  async getAuthedUserDetails(req, useDB = false, useLean = false) {
    if (!this.isAuthN(req)) return { valid: false, error: sc.NOT_AUTHENTICATED };

    const verify = { valid: true, auth: req.auth };

    if (useDB) {
      const { accountId, sub: userId } = req.auth.payload;
      const u = await this.findValidUser({ accountId, userId }, useLean);
      if (!u) return Object.assign(verify, { valid: false, error: sc.INVALID_USER });

      verify.user = u;
    }

    return verify;
  }

  async checkContactInfo(req, contact = {}) {
    const verify = {
      valid: false,
    };

    if (!this.hasRequired(contact, ['email', 'firstName', 'lastName'])) {
      verify.errors = errorObject(sc.NEED_ALL_REQUIRED_FIELDS);
      return verify;
    }

    const validFields = ['email', 'altEmail', 'firstName', 'middleName', 'lastName', 'displayName', 'title',
      'phone', 'timezone', 'birthdate', 'gender'];

    const extra = Object.keys(contact).filter(field => !validFields.includes(field));

    if (extra.length > 0) {
      verify.errors = errorObject(sc.NO_EXTRA_FIELDS);
      return verify;
    }

    verify.valid = true;
    return verify;
  }

  async updateUserDeviceDocument(accountId, userId, dev, clearRefreshToken = false) {
    const device = Object.assign({}, dev);

    if (clearRefreshToken) {
      device.refreshToken = undefined;
    }

    const user = await UserBase.Model.findOne({ accountId, userId });
    const idx = user.devices.findIndex(d => d.deviceId === device.deviceId);
    if (idx < 0) return null;
    delete device.deviceId;

    Object.keys(device).forEach((item) => {
      user.devices[idx][item] = device[item];
    });

    const updated = await user.save();
  }

  verifyProfile(req, fields, results) {
    const verify = {
      valid: false,
      fields: [],
      errors: [],
    };

    const validator = [];


    verify.valid = true;
    return verify;
  }


  validateRequiredFields(fields) {
    const errors = [];

    if (!fields) {
      errors.push({
        error: {
          type: 'empty fields object',
          msg: 'empty fields object',
        },
      });

      return {
        errors,
      };
    }

    return true;
  }

  async checkForRequiredFieldsNotInUse(accountId, fields) {
    try {
      const list = fields;

      if (!fields || !fields.email || !fields.username) {
        return null;
      }

      const query = {
        accountId,
        $and: [
          { $or: [] },
        ],
      };

      if (list.email) {
      // list of fields that need to be case-sensitive in db...
        list.email = list.email.toLowerCase();
        query.$and[0].$or.push({
          'contacts.email': list.email,
        });
      }

      if (list.username) {
        query.$and[0].$or.push({
          username: list.username,
        });
      }

      const project = {
        'contacts.email': 1,
        username: 1,
        _id: 0,
      };

      const results = await this.Model.find(query, project).lean();

      if (results && results.length > 0) {
        const inUse = {
          status: 400,
          errors: [],
        };

        const rows = _.flatten(results.map(user => _.flatten(user.contacts).map(con => ({ username: user.username, email: con.email }))));

        Object.keys(list).forEach((item) => {
          rows.forEach((row) => {
            if (list[item] === row[item]) {
              inUse.errors.push({
                error: {
                  msg: `that ${item} '${row[item]}' is already taken.`,
                },
              });
            }
          });
        });

        if (inUse.errors.length > 0) {
          return inUse;
        }
      }

      return true;
    } catch (e) {
      return h.unhandledErrorObject(e);
    }
  }

  /*
    compare profile info received to profile schema. no extra stuff?
    can also flag it so I can turn this on or off for different accounts.
  */

  checkProfileInfo(profile) {
    const output = {
      valid: false,
      errors: null,
    };

    // compare the source profile to the schema profile... how...

    return output;
  }

  isUserLocked(device) {
    return _.get(device, 'lockedUntil', 0) > Date.now();
  }

  async getSecureUserData(user) {
    let u;

    if (!user) {
      u = await this.Model.findValidUser({ accountId: user.accountId, userId: user.userId }, c.LEAN);
      if (!u) {
        return null;
      }
    } else {
      u = user;
    }

    // delete info i don't want to return. how to standardize that?
    u.password = undefined;
    u.devices.forEach((device, di) => {
      u.devices[di].refreshToken = undefined;
    });

    return u;
  }

  // get a unique id based on the mongoose schema and field presented.
  /* eslint no-await-in-loop:0 */
  // TODO: make an async helper function.

  async getUniqueId(m, o, path) {
    try {
      // TODO: remove limit when I know this works.
      let unique = { id: null, cnt: 0 };
      do {
        unique.id = uuidv4().toString().replace(/-/g, '');

        if (await m.Model.findOne(
          { userId: o.userId, accountId: o.accountId, [path]: unique.id },
          Object.assign({ _id: 0 }, { [path]: 1 }),
        ) && unique.cnt < 10) {
          unique = { id: null, count: unique.cnt + 1 };
        }
      } while (!unique.id);

      return unique.id;
    } catch (e) {
      console.log(e);
    }
  }
}
