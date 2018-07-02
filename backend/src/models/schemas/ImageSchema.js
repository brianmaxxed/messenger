/* eslint no-void: 0 */
import { Schema } from 'mongoose';
import models from '../consts/models';
import c from '../../config/consts';

const ImageSchema = new Schema({
  // hashid
  ts: { type: Number, required: true },
  url: { type: String, required: true },
  moderatorId: { type: Number, default: void 0 },
  approved: { type: Boolean, default: void 0 },
}, { autoIndex: true, timestamps: true, collection: models.image });

ImageSchema.index({ ts: 1 });
ImageSchema.index({ url: 1 }, { unique: true });

export default ImageSchema;
