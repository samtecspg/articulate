const _auth = (() => {
  return process.env.AUTH_ENABLED === undefined
    ? false
    : process.env.AUTH_ENABLED === "true";
})();

const env = {
  AUTH_ENABLED: _auth
};

export default env;

export const {
  AUTH_ENABLED
} = env;
