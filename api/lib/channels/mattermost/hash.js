import Crypto from 'crypto';

module.exports = async function ({ event }) {
    
    const secret = {
        team: event.team_id,
        channel: event.channel_id,
        user: event.user_id
    };

    const hash = Crypto.createHmac("sha256", JSON.stringify(secret)).digest("hex");
    
    return hash;

}