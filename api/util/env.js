export const AUTH_ENABLED = (() => {
    if (process.env.AUTH_ENABLED === undefined) {
        return true;
    }
    return process.env.AUTH_ENABLED === 'true';

})();
export const AUTH_PROVIDERS = process.env.AUTH_PROVIDERS ? process.env.AUTH_PROVIDERS.split(';') : [];
export const AUTH_FORCE_DEFAULT_USER = (() => {
    if (process.env.AUTH_FORCE_DEFAULT_USER === undefined) {
        return false;
    }
    return process.env.AUTH_FORCE_DEFAULT_USER === 'true';

})();
