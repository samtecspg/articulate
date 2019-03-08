let apiURL;

const normalizeURL = ({ protocol, host, port, fallback }) => {
  try {
    const url = new URL('', `${protocol}:\\${host}:${port}`);
    return url.href;
  }
  catch (e) {
    return fallback;
  }
};

const normalizeApi = () => {
  if (!apiURL) {
    if (process.env.API_URL) {
      apiURL = process.env.API_URL;
    }
    else {
      apiURL = process.env.API_URL || normalizeURL({
        protocol: process.env,
        host: process.env.API_HOST,
        port: process.env.API_PORT,
        fallback: 'http://api:7500',
      });
    }
  }
  return apiURL;
};

const env = {
  API_URL: normalizeApi(),
};

export default env;
export const { API_URL } = env;
