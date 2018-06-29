import express from 'express';

import c from '../config/consts';
import sc from '../config/statusCodes';
import h, { asynced } from '../utils/helper';

export default class User {
  static routes(u) {
    const r = express.Router();
    // ping with database activity.
    r.get('/ping', async (...p) => { await asynced(u, 'ping', p); });

    // user routes
    /*
    r.post('/login', async (...p) => { await asynced(u, 'login', p); });
    r.get('/logout', async (...p) => { await asynced(u, 'logout', p); });
    r.get('/account', async (...p) => { await asynced(u, 'myAccount', p); });
    r.get('/account/:id', async (...p) => { await asynced(u, 'account', p); });
    r.post('/signup', async (...p) => { await asynced(u, 'signup', p); });
    r.get('/me', async (...p) => { await asynced(u, 'getThisUser', p); });
    r.get('/get/:id', async (...p) => { await asynced(u, 'getUser', p); });
    r.get('/list', async (...p) => { const out = await asynced(u, 'getUsers', p); });
    r.patch('/offline', async (...p) => { await asynced(u, 'setOffline', p); });
    r.patch('/delete', async (...p) => { await asynced(u, 'setSoftDelete', p); });
    r.patch('/username', async (...p) => { await asynced(u, 'updateUsername', p); });
    r.post('/resend/username', async (...p) => { await asynced(u, 'resendUsername', p); });
    */

    return r;
  }
}
