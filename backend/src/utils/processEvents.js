import env from '../config/env';
import c from '../config/consts';

// only use this for debugging and testing; never non-debug production.
// sometimes promise errors slip through during debugging.
if (env.debug) {
  process.on('unhandledRejection', (reason, p) => {
    console.log('unhandledRejection...');
    let prom = '';
    if (p) {
      prom = `Unhandled Rejection at: Promise${p}`;
    }
    console.log('reason:', prom, reason);
    // application specific logging, throwing an error, or other logic here
  });

  process.on('uncaughtException', (e) => {
    // handle the error safely
    console.log('Error: ', e.stack);
  });
}
