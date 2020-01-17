import BootBot from 'bootbot';

module.exports = async function ({
    connection,
    event,
    response
}) {
    const bot = new BootBot({
        accessToken: connection.details.pageAccessToken,
        verifyToken: connection.details.verifyToken,
        appSecret: connection.details.appSecret
    });

    var message = [];
    var richQuickResponsesPresent = false;
    var tempRichQuickResponses;
    if (response.richResponses && response.richResponses.length > 0) {
        for (const richResponse of response.richResponses) {
            if (richResponse.type === 'image') {
                message.push(createImageAttachment(richResponse));
            }
            if (richResponse.type === 'video') {
                message.push(createVideoAttachment(richResponse));
            }
            if (richResponse.type === 'buttons') {
                var numberOfButtons = richResponse.data.length;
                var i;
                //Facebook only allows groups of 3 buttons or less, so every group is sent separately
                for (i = 0; i < numberOfButtons; i = i + 3) {
                    message.push(createButtonsAttachment(richResponse, i, connection));
                }
            }
            if (richResponse.type === 'audio') {
                message.push(createAudioAttachment(richResponse));
            }
            if (richResponse.type === 'cardsCarousel') {
                message.push(createCardsAttachment(richResponse));
            }
            if (richResponse.type === 'collapsible') {
                for (const collapsible of richResponse.data) {
                    message.push(createCollapsibleAttachment(collapsible));
                }
            }
            if (richResponse.type === 'quickResponses') {
                richQuickResponsesPresent = true;
                tempRichQuickResponses = createQuickResponsesAttachment(richResponse.data.quickResponses, response);
            }
        }
    }

    //Facebook removes the quick responses/replies if they are no the last, so they always should be at the end
    if (response.quickResponses && response.quickResponses.length > 0) {
        message.push(createQuickResponsesAttachment(response.quickResponses, response));
    } else if (richQuickResponsesPresent) {
        message.push(tempRichQuickResponses);
    } else if (message.length > 0) {
        message = [response.textResponse].concat(message)
    } else {
        message = response.textResponse;
    }

    //If message is an array, say is called once per element
    bot.say(event.sender.id, message);
}

const createImageAttachment = (richResponse) => {
    return {
        attachment: "image",
        url: richResponse.data.imageURL,
    }
}

const createVideoAttachment = (richResponse) => {
    return {
        attachment: "video",
        url: richResponse.data.video,
    }
}

const createAudioAttachment = (richResponse) => {
    return {
        attachment: "audio",
        url: richResponse.data.audio,
    }
}

const createButtonsAttachment = (richResponse, index, connection) => {
    var buttons = [];
    var currentTreeButtons = richResponse.data.slice(index, index + 3);
    for (const button of currentTreeButtons) {
        buttons.push({
            type: "web_url",
            title: button.label,
            url: button.linkURL
        })
    }
    return {
        text: connection.details.messageBeforeButtonResponse,
        buttons
    }
}

const createCardsAttachment = (richResponse) => {
    var cards = [];
    for (const card of richResponse.data) {
        cards.push({
            title: card.title,
            image_url: card.imageURL,
            subtitle: card.description,
            default_action: {
                type: "web_url",
                url: card.linkURL,
                webview_height_ratio: "tall",
            }
        })
    }
    return { cards };
}

const createCollapsibleAttachment = (collapsible) => {
    return '*' + collapsible.title + '* \n\n ' + collapsible.content;
}

const createQuickResponsesAttachment = (quickResponses, response) => {
    return {
        text: response.textResponse,
        quickReplies: quickResponses
    };
}