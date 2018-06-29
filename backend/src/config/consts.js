import { environment, domain } from '../config/env';

class c {
  static addProp(prop, value) {
    if (!(prop in c)) {
      Object.defineProperty(c, prop, { value, writable: false });
    } else {
      const msg = `Constant class c already has property '${prop}' assigned`;
      throw new Error(msg);
    }
  }
}

c.addProp('LEAN', true); // model lean or full mongoose object.

c.addProp('TRUE', 'true');
c.addProp('FALSE', 'false');

c.addProp('INDEX', 'index');
c.addProp('UNIQUE', 'unique');
c.addProp('SPARSE', 'sparse');

c.addProp('NESTED', 'NESTED');

c.addProp('PAGE_LIMIT', 1000);
c.addProp('PER_PAGE_LIMIT', 20);
c.addProp('MULTI_PER_PAGE_LIMIT', 10);

c.addProp('SIGINT', 'SIGINT');
c.addProp('SIGTERM', 'SIGTERM');

// useful strings (mongoose events', strings', etc)
c.addProp('EMPTY_STR', '');

c.addProp('OFFLINE', 'offline');
c.addProp('DISABLED', 'disabled');
c.addProp('SOFT_DELETE', 'softDelete');

c.addProp('OPEN', 'open');
c.addProp('EXIT', 'exit');
c.addProp('CONNECTING', 'connecting');
c.addProp('CONNECTED', 'connected');
c.addProp('DISCONNECTION', 'disconnecting');
c.addProp('DISCONNECTED', 'disconnected');
c.addProp('CLOSE', 'close');
c.addProp('RECONNECT', 'reconnected');
c.addProp('ERROR', 'error');
c.addProp('FULLSETUP', 'fullsetup');
c.addProp('ALL', 'all');

c.addProp('BOOLEAN', 'boolean');
c.addProp('OBJECT', 'object');
c.addProp('STRING', 'string');
c.addProp('FUNCTION', 'function');
c.addProp('NUMBER', 'number');
c.addProp('UNDEFINED', 'undefined');

c.addProp('INSERT', 'insert');
c.addProp('UPDATE', 'update');
c.addProp('DELETE', 'delete');

Object.freeze(c);

export default c;
