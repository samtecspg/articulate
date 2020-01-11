const { WebClient } = require('@slack/client');

module.exports = async function ({ connection, event, response }) {

    const web = new WebClient(connection.details.botAccessToken);

    let attachments;
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

    var blocks = [];
    //blocks.push(createImageBlock());
    blocks.push(createTextBlock(response.textResponse));
    blocks.push(createDividerBlock());
    blocks.push(createCardBlock());
    web.chat.postMessage({ channel: event.event.channel, text: response.textResponse, attachments, blocks });
}

const createTextBlock = (response) => {
    return {
        type: "section",
        text: {
            type: "plain_text",
            text: response,
            emoji: true
        }
    }
}

const createImageBlock = () => {
    var blocks = [];
    var imageInfo = {
        type: "image",
        image_url: "https://cdn.repretel.com/files/2019/01/16/herediano_0.jpg",
        alt_text: "Mambo nunez"
    }
    blocks.push(imageInfo)
    return blocks;
}

const createDividerBlock = () => {
    return {
        type: "divider"
    }
}

const createCardBlock = () => {
    return {
        type: "section",
        text: {
            type: "mrkdwn",
            text: "*<fakeLink.toHotelPage.com|Windsor Court Hotel>*\n★★★★★\n$340 per night\nRated: 9.4 - Excellent"
        },
        accessory: {
            type: "image",
            image_url: "https://cdn.repretel.com/files/2019/01/16/herediano_0.jpg",
            alt_text: "Windsor Court Hotel thumbnail"
        }
    }
}