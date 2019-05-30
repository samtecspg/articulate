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
  AUTH_TWITTER_KEY: process.env.AUTH_TWITTER_KEY,
  AUTH_TWITTER_SECRET: process.env.AUTH_TWITTER_SECRET,
  AUTH_GITHUB_KEY: process.env.AUTH_GITHUB_KEY,
  AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
  SESSION_SECRET: process.env.SESSION_SECRET,
  AUTH_PROVIDERS: process.env.AUTH_PROVIDERS ? process.env.AUTH_PROVIDERS.split(';') : [],
  AUTH_SIMPLE: process.env.AUTH_SIMPLE === 'true',
};

export default env;
export const {
  API_URL,
  AUTH_TWITTER_KEY,
  AUTH_TWITTER_SECRET,
  AUTH_GITHUB_KEY,
  AUTH_GITHUB_SECRET,
  SESSION_SECRET,
  AUTH_PROVIDERS,
  AUTH_SIMPLE,
} = env;
