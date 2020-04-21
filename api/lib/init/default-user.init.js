import {
    DEFAULT_ADMIN_GROUP_NAME,
    MODEL_USER_ACCOUNT,
    PARAM_EMAIL,
    PARAM_GROUPS,
    PARAM_LAST_NAME,
    PARAM_NAME,
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
    const groups = [DEFAULT_ADMIN_GROUP_NAME];
    const createUser = async () => {

        try {
            logger.info(`Creating user`);
            if (username && password) {
                const user = await globalService.searchByField({ field: PARAM_EMAIL, value: username, model: MODEL_USER_ACCOUNT });
                if (user) {
                    const UserModel = await redis.factory(MODEL_USER_ACCOUNT, user.id);
                    const { passwordHash, salt } = securityService.saltHashPassword({ password });
                    UserModel.property(PARAM_EMAIL, username);
                    UserModel.property(PARAM_NAME, 'admin');
                    UserModel.property(PARAM_LAST_NAME, 'admin');
                    UserModel.property(PARAM_PASSWORD, passwordHash);
                    UserModel.property(PARAM_SALT, salt);
                    UserModel.property(PARAM_GROUPS, groups);
                    await UserModel.save();
                }
                else {
                    await userService.create({
                        data: {
                            email: username,
                            password,
                            provider: PROVIDER_BASIC,
                            groups
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
