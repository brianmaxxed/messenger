/* eslint class-methods-use-this: 0, max-len: 0, valid-typeof:0, no-empty-function:0 */
import mongoose from 'mongoose';

import ImageSchema from './schemas/ImageSchema';
import User from './User';

import c from '../config/consts';
import sc from '../config/statusCodes';
import models from './consts/models';
import h, { statusObject } from '../utils/helper';

export default class Image {
  static get Model() {
    return mongoose.model(models.Image, ImageSchema);
  }

  get Model() {
    return Image.Model;
  }

  /*
    returns an array of images whether moderatored or not.
    GET /api/image/list/{filter}

  */

  async list(req = {}) {
    const { filter = 'all' } = req.params;
    const filters = ['all', 'pending', 'approved', 'rejected'];

    if (!filters.includes(filter)) {
      return sc.INVALID_LIST_FILTER;
    }

    let find = {};

    switch (filter) {
      case 'pending':
        find = { approved: { $exists: false }, moderatorId: { $exists: false } };
        break;
      case 'approved':
        find = { approved: true };
        break;
      case 'rejected':
        find = { approved: false };
        break;
      default:
        find = {};
    }

    try {
      const data = await Image.Model.find(find).sort({ ts: 1 }).lean();

      return { status: sc.SUCCESS.status, data: { message: data } };
    } catch (e) {
      return h.unhandledErrorObject(e);
    }
  }

  /*
    returns an array of 1 image or empty array for the next unmoderated image.
    GET /api/image/next

  */

  async nextUnmoderated(req = {}) {
    console.log('!!!');
    const { user } = req.query;

    if (!user) {
      return sc.USER_DOESNT_EXIST;
    }

    // make sure the user exists
    const u = await User.Model.find({ user }).lean();
    if (u.length < 1) {
      return sc.USER_DOESNT_EXIST;
    }

    try {
      const data = await Image.Model.find({
        $and: [
          { approved: { $exists: false } },
          {
            $or: [
              { moderatorId: { $exists: false } },
              { moderatorId: u[0].userId },
            ],
          },
        ],
      }).sort({ moderatorId: -1, ts: 1 }).limit(2).lean();

      console.log(data);
      let updated;

      if (!u[0].moderatorId) {
        updated = await Image.Model.updateOne(
          { _id: data[0]._id },
          {
            $set: {
              moderatorId: u[0].userId,
            },
          },
        );
        console.log(updated);
      }

      return { status: sc.SUCCESS.status, data: { message: data } };
    } catch (e) {
      return h.unhandledErrorObject(e);
    }
  }

  /*
    updates an image with the id of the image, approved boolean (true/false) and moderatorId (userId);
    PUT /api/image/update

  */

  async moderate(req = {}) {
    const { imageId, user, approved } = req.body;

    console.log(imageId, user, approved);

    if (!imageId || !user || typeof approved !== 'boolean') {
      return sc.INVALID_MODERATION_FIELDS;
    }

    // make sure the user exists
    const u = await User.Model.find({ user }).lean();
    if (u.length < 1) {
      return sc.USER_DOESNT_EXIST;
    }

    const { ObjectId } = mongoose.Types;

    // update 1 image
    try {
      const updated = await Image.Model.updateOne(
        { _id: new ObjectId(imageId) },
        {
          $set: {
            moderatorId: u[0].userId,
            approved,
          },
        },
      );

      // check what was return to see if image was updated, nModified should === 1;
      return { status: sc.SUCCESS.status, data: { message: updated.nModified === 1 } };
    } catch (e) {
      return h.unhandledErrorObject(e);
    }
  }

  /*
    returns an array of the last 5 images that have been moderated by this user or return empty array
    GET /api/image/list

  */

  async moderated(req = {}) {
    try {
      const { user } = req.query;

      if (!user) {
        return sc.USER_DOESNT_EXIST;
      }

      // make sure the user exists
      const u = await User.Model.find({ user }).lean();
      if (u.length < 1) {
        return sc.USER_DOESNT_EXIST;
      }

      const data = await Image.Model.find({ moderatorId: u[0].userId, approved: { $exists: true } })
        .sort({ updatedAt: -1 }).limit(5).skip(0)
        .lean();

      return { status: sc.SUCCESS.status, data: { message: data } };
    } catch (e) {
      return h.unhandledErrorObject(e);
    }
  }

  /*
    utility method to clear the db for testing purposes;
    will remove approved and moderatorId fields to test this example over and over again.
    GET /api/image/clear

  */

  async clear(req = {}) {
    try {
      const updated = await Image.Model.updateMany(
        {},
        {
          $unset: {
            moderatorId: null,
            approved: null,
          },
        },
      );

      return { status: sc.SUCCESS.status, data: { message: updated } };
    } catch (e) {
      return h.unhandledErrorObject(e);
    }
  }
}
