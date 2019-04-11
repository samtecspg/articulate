module.exports = async function({ connection, event, response }) {
    const client = require('twilio')(connection.details.accountId, connection.details.authToken);

    client.messages
        .create({from: event.To, body: response.textResponse, to: event.From})

    //TODO Implement StatusCallbacks
}