import errorHandler from 'express-error-handler';

const handler = errorHandler({
  serializer(err) {
    console.log('errorHandler called:');

    const body = {
      status: err.status,
      message: err.message,
    };
    if (errorHandler.isClientError(err.status)) {
      ['code', 'name', 'type', 'details'].forEach((prop) => {
        if (err[prop]) { body[prop] = err[prop]; }
      });
    }
    return body;
  },
});

export default handler;
