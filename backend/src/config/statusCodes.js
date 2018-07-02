import m from './messages';
import c from './consts';

class sc {}

sc.INTERNAL_ERROR = {
  id: 500,
  status: 500,
  msg: 'internal error.',
};

sc.SUCCESS = {
  id: 1,
  status: 200,
  msg: m.OK,
};

sc.SUCCESSFUL_UPDATE = { id: 22, status: 201, msg: 'successful update.' };

sc.INVALID_MODERATION_FIELDS = {
  id: 400,
  status: 422,
  msg: 'imageId, user, and approved (true/false) are required.',
};

sc.INVALID_LIST_FILTER = {
  id: 400,
  status: 422,
  msg: 'filter must be \'all\', \'pending\', \'approved\', or \'rejected.\'',
};

sc.USER_DOESNT_EXIST = {
  id: 400,
  status: 422,
  msg: 'That user does not exist.',
};

Object.freeze(sc);

export default sc;
