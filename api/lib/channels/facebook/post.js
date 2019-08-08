import Crypto from 'crypto';
const jsesc = require('jsesc');

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

function regenerateRawPayload(body) {
  return jsesc(body, {
    lowercaseHex: true,
    json: true
  }).replace(/\//g, '\\/')
    .replace(/@/g, '\\u0040')
    .replace(/%/g, '\\u0025')
    .replace(/</g, '\\u003C');
}

module.exports = async function ({ connection, request }) {

  const { agentService, channelService } = request.services();

  const data = request.payload;
  const signature = request.headers['x-hub-signature'];

  if (!signature) {

    return {
      statusCode: 404
    }
  } else {

    const elements = signature.split('=');
    const signatureHash = elements[1];
    const expectedHash = Crypto.createHmac('sha1', connection.details.appSecret)
      .update(regenerateRawPayload(data))
      .digest('hex');

    if (signatureHash != expectedHash) {

      return {
        statusCode: 404
      }
    } else {

      // Checks this is an event from a page subscription
      if (data.object === 'page') {
        
        // Iterates over each entry - there may be multiple if batched
        await asyncForEach( data.entry, async function(entry) {

          try {
            // Gets the message. entry.messaging is an array, but 
            // will only ever contain one message, so we get index 0
            const event = entry.messaging[0];
            const sessionId = await channelService.hash({ connection, event })

            //Messages like stickers don't have a text and are unhandled at the moment.

            if (event.message.text) {
              const response = await agentService.converse({ 
                id: connection.agent,
                sessionId,
                text: event.message.text,
                timezone: null,
                debug: false,
                additionalKeys: {
                  ubiquity: {
                    connection,
                    event
                  }
                }
              })

              if (response.textResponse !== null && response.textResponse !== '') {
                if (!connection.details.outgoingMessages){
                  await channelService.reply({ connection, event, response });
                }
              }
            } else {
              console.log('Unhandled content type:', JSON.stringify(event));
            }
          }
          catch (e) {
           console.log(e)            
          }
        });

        return {
          statusCode: 200
        }
      } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        // reply().code(404);
        return {
          statusCode: 404
        }
      }
    }
  }
}