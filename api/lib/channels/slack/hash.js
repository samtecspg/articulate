import Crypto from 'crypto';

module.exports = async function ({ event }) {
    
    const secret = {
        app: event.api_app_id,
        channel: event.event.channel,
        user: event.event.user
    };

    const hash = Crypto.createHmac("sha256", JSON.stringify(secret)).digest("hex");
    
    return hash;

}