/* eslint no-void: 0 */
import { Schema } from 'mongoose';
import models from '../consts/models';
import c from '../../config/consts';

const mongooseHidden = require('mongoose-hidden')();

const UserSchema = new Schema({
  // hashid
  userId: { type: String, required: true },
  username: {
    type: String,
    minlength: 2,
    maxlength: 16,
  },
  accountId: { type: String, required: true },
  password: { type: String, required: true, hideJSON: true },
  // passwordChangeToken is jwt token with a ttl time and username in it.
  mustChangePassword: { type: Boolean, hideJSON: true }, // <-- watch this hide thing. TODO
  forcedLogout: { type: Boolean, hideJSON: true }, // <-- watch this hide thing. TODO
  mustVerifyPassword: { type: Boolean, hideJSON: true },
  image: { type: String }, // profile image
  gravatarId: { type: String },
  // the version of agreement agreed to. force update when new version.
  agreementVersion: { type: Number, hideJSON: true },
  offline: { type: Boolean },
  disabled: { type: Boolean },
  softDelete: { type: Boolean },
  // account managers can archive a user; should be automatically archived before deleted.
  archive: { type: Boolean },
}, { autoIndex: false, timestamps: true, collection: models.user });

UserSchema.index({ accountId: 1, username: 1 }, { unique: true });
UserSchema.index({ accountId: 1, userId: 1, 'profiles.name': 1 }, { unique: true });
UserSchema.index({ accountId: 1, 'profiles.profileId': 1 }, { unique: true });
UserSchema.index({ accountId: 1, 'contacts.email': 1 }, { unique: true });
UserSchema.index(
  { accountId: 1, 'contacts.altEmail': 1 },
  { unique: true, partialFilterExpression: { 'contacts.altEmail': { $type: 'string' } } },
);
UserSchema.index(
  { accountId: 1, 'devices.deviceId': 1 },
  { unique: true, partialFilterExpression: { 'contacts.deviceId': { $type: 'string' } } },
);

UserSchema.index(
  { paymentId: 1 },
  { unique: true, partialFilterExpression: { 'paymentMethods.paymentId': { $type: 'string' } } },
);

UserSchema.pre('save', (next) => {
  // do stuff
  next();
});

/* eslint func-names: 0 */
UserSchema.statics.findValidUser = async function (query = {}, lean = false, projection = {}) {
  let user = null;

  try {
    user = await this.findOne(query, projection).lean(lean);
  } catch (e) {
    console.log('Error: ', e.stack);
  }

  return (!user ||
    user.softDelete ||
    user.archive) ? null : user;
};

export default UserSchema;
