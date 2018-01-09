// Based on https://github.com/noh4ck/redux-swagger-client/blob/master/src/index.js
import Swagger from 'swagger-client';

export default function swaggerMiddleware(opts) {
  let api;
  return ({ dispatch, getState }) => next => action => {
    if (!action.apiCall) {
      return next(action);
    }
    if (api) {
      const { apiCall, ...rest } = action;
      return next({ ...rest, api });
    }
    return new Swagger({ ...opts })
      .then(result => {
          //console.log(result);
          const { apiCall, ...rest } = action;
          api = result.apis;
          console.info(api);
          return next({ ...rest, api });
        },
        err => opts.error && opts.error(err)
      ).catch(err => {
        console.error(err);
        opts.error && opts.error(err);
      });
  };
}
