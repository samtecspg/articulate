import {
    MODEL_USER_ACCOUNT,
    PARAM_EMAIL,
    PARAM_PASSWORD,
    PARAM_SALT,
    PROVIDER_BASIC
} from '../../util/constants';
import {
    AUTH_ENABLED,
    AUTH_FORCE_DEFAULT_USER
} from '../../util/env';

const logger = require('../../util/logger')({ name: `server:init:defaultUser` });

module.exports = async (server) => {

    const { redis } = server.app;
    const { userService, securityService, globalService } = await server.services();

    const userCount = await (async () => {
        const UserModel = await redis.factory(MODEL_USER_ACCOUNT);
        return await UserModel.count();
    })();
    const username = process.env.AUTH_USER;
    const password = process.env.AUTH_PASSWORD;
    const createUser = async () => {
        try {
            logger.info(`Creating user`);
            if (username && password) {
                let user = await globalService.searchByField({ field: PARAM_EMAIL, value: username, model: MODEL_USER_ACCOUNT });
                if (user) {
                    const UserModel = await redis.factory(MODEL_USER_ACCOUNT, user.id);
                    const { passwordHash, salt } = securityService.saltHashPassword({ password });
                    UserModel.property(PARAM_PASSWORD, passwordHash);
                    UserModel.property(PARAM_SALT, salt);
                    await UserModel.save();
                }
                else {
                    await userService.create({
                        data: {
                            email: username,
                            password: password,
                            provider: PROVIDER_BASIC
                        }
                    });
                }
                logger.info(`Creating user successful`);
            }
            else {
                throw new Error('[Default User Init] Invalid default username and/or password ar');
            }
        }
        catch (e) {
            logger.error(e);
        }
    };
    if (AUTH_ENABLED) {
        if (AUTH_FORCE_DEFAULT_USER || userCount === 0) {
            return await createUser();
        }
    }
};
