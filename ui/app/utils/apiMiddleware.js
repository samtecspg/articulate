// Based on https://github.com/noh4ck/redux-swagger-client/blob/master/src/index.js
import Axios from 'axios';

const api = Axios.create();
api.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error),
);
export default function apiMiddleware() {
  return () => next => action => {

    if (!action.apiCall) {
      return next(action);
    }
    const { apiCall, ...rest } = action;
    return next({ ...rest, api });
  };
}
