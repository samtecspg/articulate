import _ from 'lodash';
import Boom from 'boom';
const { IncomingWebhook } = require('@slack/webhook');
import { MODEL_AGENT } from '../../../util/constants';

import Channels from '../../channels';

module.exports = async function ({ connection, event, response, sessionId }) {

    try {

        const { redis } = this.server.app;
        const channel = Channels[connection.channel];

        const AgentModel = await redis.factory(MODEL_AGENT, connection.agent);

        const url = AgentModel.property('settings').slackLoggingURL;

        if (url){
            const webhook = new IncomingWebhook(url);

            await webhook.send({
                attachments: [
                    {
                        color: '#36a64f',
                        pretext: `${AgentModel.property('agentName')} received a new ${channel.info.name} request from ${_.get(event, channel.info.userField.split('.'))}`,
                        author_name: _.get(event, channel.info.userField.split('.')),
                        author_link: `${connection.requestURL}/context/${sessionId}`,
                        author_icon: channel.info.iconURL,
                        title: 'Message',
                        title_link: `${connection.requestURL}/doc/${response.docId}`,
                        text: event.event.text,
                        fields: [
                            {
                                title: 'Response',
                                value: response.textResponse,
                                short: false
                            }
                        ],
                        footer: `Log for ${AgentModel.property('agentName')}`,
                        ts: new Date().getTime() / 1000
                    }
                ]
            });
        }

        return channel.reply({ connection, event, response, sessionId, redis });
    }
    catch ({ message, statusCode }) {

        return new Boom(message, { statusCode });
    }
    
};
