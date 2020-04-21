export const AUTH_ENABLED = (() => {
    return process.env.AUTH_ENABLED === undefined ? false : process.env.AUTH_ENABLED === 'true';
})();
export const AUTH_PROVIDERS = process.env.AUTH_PROVIDERS ? process.env.AUTH_PROVIDERS.split(';') : [];
export const AUTH_FORCE_DEFAULT_USER = (() => {
    if (process.env.AUTH_FORCE_DEFAULT_USER === undefined) {
        return false;
    }
    return process.env.AUTH_FORCE_DEFAULT_USER === 'true';

})();
export const AUTH_FORCE_DEFAULT_GROUP = process.env.AUTH_FORCE_DEFAULT_GROUP === 'true';
export const DEBUG_ROUTES = process.env.DEBUG_ROUTES === 'true';
export const RASA_URLs = process.env.RASA_URLs ? process.env.RASA_URLs.split(';') : ['http://rasa:5000'];
export const PERF = process.env.PERF === 'true';
