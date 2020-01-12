const { WebClient } = require('@slack/client');

module.exports = async function ({ connection, event, response }) {

    const web = new WebClient(connection.details.botAccessToken);

    /* let attachments;
     if (response.quickResponses) {
         const actions = response.quickResponses.map((quickResponse, index) => {
 
             return {
                 name: `{ "api_app_id": "${event.api_app_id}", "quickResponse": ${index + 1} }`,
                 text: quickResponse,
                 type: 'button',
                 value: quickResponse
             }
         });
         attachments = [
             {
                 text: "",
                 fallback: "Quick response not selected",
                 callback_id: "quickResponse",
                 color: "#3AA3E3",
                 attachment_type: "default",
                 actions
             }
         ]
     }
     */

    var blocks = [];
    if (response.richResponses && response.richResponses.length > 0) {
        blocks.push(createTextBlock(response.textResponse));
        blocks.push(createDividerBlock());
        for (const richResponse of response.richResponses) {
            if (richResponse.type === 'image') {
                blocks.push(createImageBlock(richResponse));
            }
            if (richResponse.type === 'video') {
                blocks.push(createVideoBlock(richResponse));
            }
            if (richResponse.type === 'buttons') {
                blocks.push(createButtonBlock(richResponse));
            }
            if (richResponse.type === 'audio') {
                blocks.push(createAudioBlock(richResponse));
            }
            if (richResponse.type === 'cardsCarousel') {
                for (const card of richResponse.data) {
                    blocks.push(createDividerBlock());
                    blocks.push(createCardBlock(card));
                }
            }
            if (richResponse.type === 'collapsible') {
                for (const collapsible of richResponse.data) {
                    blocks.push(createDividerBlock());
                    blocks.push(createCollapsibleBlock(collapsible));
                }
            }
            blocks.push(createDividerBlock());
        }
    }
    //blocks.push(createImageBlock());
    web.chat.postMessage({ channel: event.event.channel, text: response.textResponse, blocks });
}

const createTextBlock = (text) => {
    return {
        type: "section",
        text: {
            type: "plain_text",
            text: text,
            emoji: true
        }
    }
}

const createImageBlock = (richResponse) => {
    return {
        type: "image",
        image_url: richResponse.data.imageURL,
        alt_text: " "
    }
}

const createVideoBlock = (richResponse) => {
    return {
        type: "section",
        text: {
            "type": "mrkdwn",
            "text": "<" + richResponse.data.video + ">"
        }
    }
}

const createAudioBlock = (richResponse) => {
    return {
        type: "section",
        text: {
            "type": "mrkdwn",
            "text": "<" + richResponse.data.audio + ">"
        }
    }
}

const createDividerBlock = () => {
    return {
        type: "divider"
    }
}

const createCardBlock = (card) => {
    return {
        type: "section",
        text: {
            type: "mrkdwn",
            text: createCardText(card)
        },
        accessory: {
            type: "image",
            image_url: card.imageURL,
            alt_text: card.title
        }
    }
}

const createCardText = (card) => {
    return "*<" + card.linkURL + "|" + card.title + ">*\n" + card.description
}

const createCollapsibleBlock = (collapsible) => {
    return {
        type: "section",
        text: {
            type: "mrkdwn",
            text: createCollapsibleText(collapsible)
        }
    }
}

const createCollapsibleText = (collapsible) => {
    return "*" + collapsible.title + "*\n" + collapsible.content
}

const createButtonBlock = (richResponse) => {
    var elements = [];
    for (const button of richResponse.data) {
        elements.push({
            "type": "button",
            "text": {
                "type": "plain_text",
                "text": button.label
            },
            "url": button.linkURL
        })
    }

    return {
        type: "actions",
        elements
    }
}