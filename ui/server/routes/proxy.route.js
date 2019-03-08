import { PROXY_ROUTE_PREFIX } from '../../common/constants';
import { API_URL } from '../../common/env';

const onResponse = (err, res, req, h, settings, ttl) => h.response(res)
  .ttl(ttl)
  .code(res.statusCode)
  .passThrough(!!settings.passThrough);

const handler = (request, h) => {
  let uri;
  uri = request.params.paths ? `${API_URL}/${request.params.paths}` : `${API_URL}`;
  uri = `${uri}${request.url.search}`;
  return h.proxy({ passThrough: true, onResponse, uri });
};

export default [
  {
    method: '*',
    path: `${PROXY_ROUTE_PREFIX}/{paths*}`,
    config: {
      handler,
      payload: {
        parse: false,
      },
    },
  },
];
