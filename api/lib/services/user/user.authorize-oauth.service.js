import {
    MODEL_USER_ACCOUNT,
    MODEL_USER_IDENTITY,
    P_AUTHENTICATION,
    PARAM_EMAIL,
    PARAM_PROVIDER,
    PARAM_SECRET,
    PARAM_TOKEN
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ profile, token, secret, provider }) {

    const { userService, globalService } = await this.server.services();
    try {
        const authPlugin = this.server.app[P_AUTHENTICATION];
        const data = authPlugin.parseProfile({ profile, provider });

        const credentials = {
            id: undefined,
            name: undefined,
            email : data.email
        };

        const existingUserResult = await globalService.searchByField({ field: PARAM_EMAIL, value: data.email, model: MODEL_USER_ACCOUNT });
        const existingUser = Array.isArray(existingUserResult) ? existingUserResult[0] : existingUserResult;
        if (existingUser) {
            credentials.id = existingUser.id;
            credentials.name = existingUser.name;

            const modelPath = [
                { model: MODEL_USER_ACCOUNT, id: existingUser.id },
                { model: MODEL_USER_IDENTITY }
            ];
            const findInModelPathResult = await globalService.findInModelPath({ modelPath, returnModel: true });
            const existingIdentityModels = findInModelPathResult.data;

            const existingIdentity = existingIdentityModels.find((item) => {
                return item.property(PARAM_PROVIDER) === provider;
            });
            if (existingIdentity) {
                if (existingIdentity.property(PARAM_TOKEN) !== token) {
                    existingIdentity.property(PARAM_TOKEN, token);
                    existingIdentity.property(PARAM_SECRET, secret);
                    existingIdentity.property(PARAM_PROVIDER, provider);
                    await existingIdentity.save();
                }
            }
            else {
                await userService.addIdentity({
                    identityData: { profile, token, secret, provider },
                    UserAccountModel: existingUser
                });
            }
        }
        else {
            const newUser = await userService.create({
                data,
                identity: {
                    provider,
                    token,
                    secret,
                    profile
                }
            });
            credentials.id = newUser.id;
            credentials.name = `${data.name} ${data.lastName}`.trim();
        }

        return credentials;
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
