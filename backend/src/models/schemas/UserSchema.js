/* eslint no-void: 0 */
import { Schema } from 'mongoose';
import models from '../consts/models';
import c from '../../config/consts';

const UserSchema = new Schema({
  // hashid
  userId: { type: String, required: true },
  user: { // this is actually username, but the specs called for user
    type: String,
    minlength: 2,
    maxlength: 16,
  },
}, { autoIndex: true, timestamps: true, collection: models.user });

UserSchema.index({ accountId: 1, user: 1 }, { unique: true });
UserSchema.index({ accountId: 1, userId: 1 }, { unique: true });

export default UserSchema;
