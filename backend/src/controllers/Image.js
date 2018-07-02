import express from 'express';

import c from '../config/consts';
import sc from '../config/statusCodes';
import h, { asynced } from '../utils/helper';

export default class Image {
  static routes(m) {
    const r = express.Router();

    // clear the image table to reset unmoderated
    r.get('/clear', async (...p) => { await asynced(m, 'clear', p); });

    // list images in db; sorted descending by timestamp
    r.get('/list', async (...p) => { await asynced(m, 'list', p); });
    // filer can be all, approved, pending, rejected
    r.get('/list/:filter', async (...p) => { await asynced(m, 'list', p); });

    // return the next 1 unmoderated image in queue; sort ascending timestamp;
    r.get('/next', async (...p) => { await asynced(m, 'nextUnmoderated', p); });

    // moderate an image; set approved = true/false; set userId;
    r.put('/moderate', async (...p) => { await asynced(m, 'moderate', p); });

    // api/user/last-moderated/?user=userid&limit=x&offset=y
    r.get('/moderated', async (...p) => { await asynced(m, 'moderated', p); });

    console.log('####');
    return r;
  }
}
