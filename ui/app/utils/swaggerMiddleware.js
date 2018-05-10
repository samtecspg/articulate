// Based on https://github.com/noh4ck/redux-swagger-client/blob/master/src/index.js
import Swagger from 'swagger-client';
import { MISSING_API, CHECK_API, RESET_MISSING_API } from '../containers/App/constants';
import { resetMissingAPI, loadAgents } from '../containers/App/actions';
import { push } from 'react-router-redux';

export default function swaggerMiddleware(opts) {
  let api;
  return ({ dispatch, getState }) => next => action => {
    if (!action.apiCall) {
      return next(action);
    }
    /*if (api) {
      const { apiCall, ...rest } = action;
      return next({ ...rest, api });
    }*/
    return new Swagger({ ...opts })
      .then(result => {
          const { apiCall, ...rest } = action;
          api = result.apis;
          if (getState().global.missingAPI){
            dispatch(resetMissingAPI());
            dispatch(loadAgents());
            dispatch(push(action.refURL));
          }
          else {
            return next({ ...rest, api });
          }
        },
        err => {
          if (action.type === CHECK_API){
            return next({ type: MISSING_API });
          }
          opts.error && opts.error(err)
        }
      ).catch(err => {
        console.error(err);
        opts.error && opts.error(err);
      });
  };
}
