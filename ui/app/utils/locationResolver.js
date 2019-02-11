let API_URL = null;
let WS_URL = null;

export function getAPI() {
  if (API_URL) {
    return API_URL;
  }
  const loc = window.location;
  const host = process.env.API_HOST || `${loc.hostname}:7500`;
  API_URL = `${loc.protocol}//${host}`;
  return API_URL;
}

export function getWS() {
  if (WS_URL) {
    return WS_URL;
  }
  const loc = window.location;
  const host = process.env.API_HOST || `${loc.hostname}:7500`;
  if (loc.protocol === 'https:') {
    WS_URL = 'wss:';
  }
  else {
    WS_URL = 'ws:';
  }
  WS_URL += `//${host}`;

  return WS_URL;

}
