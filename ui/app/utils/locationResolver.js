import { PROXY_ROUTE_PREFIX } from '../../common/constants';

let WS_URL = null;

export function getWS() {
  if (WS_URL) {
    return WS_URL;
  }
  const loc = window.location;
  if (loc.protocol === 'https:') {
    WS_URL = 'wss:';
  }
  else {
    WS_URL = 'ws:';
  }
  WS_URL += `//${loc.host}/api/`;

  return WS_URL;

}

export function toAPIPath(paths) {
  return `${PROXY_ROUTE_PREFIX}/${paths.join('/')}`;
}

