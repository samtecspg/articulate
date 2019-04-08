import {
    MODEL_USER_ACCOUNT,
    PARAM_EMAIL
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ email, password, returnUser = false }) {

    const { globalService, securityService } = await this.server.services();

    try {

        const user = await globalService.searchByField({ field: PARAM_EMAIL, value: email, model: MODEL_USER_ACCOUNT });
        if (!user) {
            return { isValid: false };
        }
        const { passwordHash } = securityService.sha512({ password, salt: user.salt });
        const isValid = user.password === passwordHash;
        if (returnUser) {
            return { isValid, user };
        }
        return { isValid };
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
