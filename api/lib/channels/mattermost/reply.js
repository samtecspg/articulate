const axios = require('axios')

module.exports = async function ({ connection, event, response }) {
    var payload = await buildReplyPayload(response, event, connection);
    await axios.post(connection.details.incomingWebhookURL, payload);
}

async function buildReplyPayload(response, event, connection) {

    var channel_name = await getChannelName(event);
    var attachments = [];
    if (response.richResponses && response.richResponses.length > 0) {
        for (const richResponse of response.richResponses) {
            if (richResponse.type === 'image') {
                attachments.push(await createImageAttachment(richResponse));
            }
            if (richResponse.type === 'video') {
                attachments.push(await createVideoAttachment(richResponse));
            }
            if (richResponse.type === 'buttons') {
                var buttonResponseFields = await createButtonsFields(richResponse);
                attachments.push({ fields: buttonResponseFields });
            }
            if (richResponse.type === 'audio') {
                attachments.push(await createAudioAttachment(richResponse));
            }
            if (richResponse.type === 'cardsCarousel') {
                for (const card of richResponse.data) {
                    attachments.push(await createCardAttachment(card));
                }
            }
            if (richResponse.type === 'collapsible') {
                for (const collapsible of richResponse.data) {
                    attachments.push(await createCollapsibleAttachment(collapsible));
                }
            }
            if (richResponse.type === 'quickResponses') {
                var quickResponseActions = await createQuickResponseActions(richResponse.data.quickResponses, connection, event);
                attachments.push({ actions: quickResponseActions });
            }
        }
    }
    if (await isQuickResponseRequest(response)) {
        var quickResponseActions = await createQuickResponseActions(response.quickResponses, connection, event);
        attachments.push({ actions: quickResponseActions });
    }

    return {
        text: response.textResponse,
        channel: channel_name,
        username: connection.details.userName,
        attachments: attachments.length > 0 ? attachments : null
    };
}

async function getChannelName(event) {
    return await isQuickResponseSelected(event) ? event.context.channel_name : event.channel_name;
}

async function getUserName(event) {
    return await isQuickResponseSelected(event) ? event.context.user_name : event.user_name;
}

async function isQuickResponseSelected(event) {
    return event.context;
}

async function createQuickResponseActions(quickResponses, connection, event) {
    var actions = [];
    var token = await getToken(event);
    var channel_name = await getChannelName(event);
    var user_name = await getUserName(event);
    var actions = quickResponses.map((quickResponse) => {
        return {
            name: quickResponse,
            integration: {
                url: connection.callbackURL,
                context: {
                    text: quickResponse,
                    token,
                    channel_name,
                    user_name
                }
            }
        }
    });
    return actions
}

async function isQuickResponseRequest(response) {
    return response.quickResponses && response.quickResponses.length > 0;
}

async function getToken(event) {
    return await isQuickResponseSelected(event) ? event.context.token : event.token
}

async function createImageAttachment(richResponse) {
    return {
        image_url: richResponse.data.imageURL
    }
}

async function createVideoAttachment(richResponse) {
    return {
        title: richResponse.data.video,
        title_link: richResponse.data.video
    }
}

async function createButtonsFields(richResponse) {
    var fields = [];
    for (const button of richResponse.data) {
        fields.push({
            "short": "true",
            "value": await createButtonText(button)
        })
    }

    return fields;
}

async function createButtonText(button) {
    return '**[' + button.label + '](' + button.linkURL + ')**';
}

async function createAudioAttachment(richResponse) {
    return {
        title: richResponse.data.audio,
        title_link: richResponse.data.audio
    }
}

async function createCardAttachment(card) {
    return {
        title: card.title,
        title_link: card.imageURL,
        text: card.description,
        thumb_url: card.imageURL
    }
}

async function createCollapsibleAttachment(collapsible) {
    return {
        title: collapsible.title,
        text: collapsible.content
    }
}