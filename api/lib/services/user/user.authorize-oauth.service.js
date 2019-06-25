import {
    MODEL_USER_ACCOUNT,
    MODEL_USER_IDENTITY,
    PARAM_EMAIL,
    PARAM_PROVIDER,
    PARAM_SECRET,
    PARAM_TOKEN
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ profile, token, secret, provider }) {

    const { userService, globalService } = await this.server.services();
    try {
        const credentials = {
            id: undefined,
            name: undefined,
            email: profile.raw.email
        };

        const existingUser = await globalService.searchByField({ field: PARAM_EMAIL, value: profile.raw.email, model: MODEL_USER_ACCOUNT });
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
                data: {
                    name: profile.displayName,
                    email: profile.raw.email,
                    identity: {
                        provider,
                        token,
                        secret,
                        profile
                    },
                    provider
                }
            });
            credentials.id = newUser.id;
            credentials.name = profile.displayName;
        }

        return credentials;
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
