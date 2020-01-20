import { driver } from '@rocket.chat/sdk'

module.exports = async function ({ connection, event, response }) {

  const HOST = connection.details.rocketchatURL;
  const USER = connection.details.rocketchatUser;
  const PASS = connection.details.rocketchatPassword;


  await driver.connect({ host: HOST, useSsl: connection.details.useSSL });

  const botUserId = await driver.login({ username: USER, password: PASS });

  if (event.user_id !== botUserId) {

    var attachments = [];
    if (response.richResponses && response.richResponses.length > 0) {
      for (const richResponse of response.richResponses) {
        if (richResponse.type === 'image') {
          attachments.push(createImageAttachment(richResponse));
        }
        if (richResponse.type === 'video') {
          attachments.push(createVideoAttachment(richResponse));
        }
        if (richResponse.type === 'buttons') {
          var buttonResponseFields = createButtonsFields(richResponse);
          attachments.push({ fields: buttonResponseFields })
        }
        if (richResponse.type === 'audio') {
          attachments.push(createAudioAttachment(richResponse));
        }
        if (richResponse.type === 'cardsCarousel') {
          for (const card of richResponse.data) {
            attachments.push(createCardAttachment(card));
          }
        }
        if (richResponse.type === 'collapsible') {
          for (const collapsible of richResponse.data) {
            attachments.push(createCollapsibleAttachment(collapsible));
          }
        }
        if (richResponse.type === 'quickResponses') {
          attachments.push(createQuickResponsesActions(richResponse.data.quickResponses));
        }
      }
    }

    if (response.quickResponses && response.quickResponses.length > 0) {
      attachments.push(createQuickResponsesActions(response.quickResponses));
    }

    await driver.sendToRoomId(attachments.length > 0 ? {
      msg: !response.disableTextResponse ? response.textResponse : '',
      attachments
    } : response.textResponse, event.channel_id);
  }
}

const createQuickResponsesActions = (quickResponses) => {
  return {
    title: '',
    actions: quickResponses.map((quickResponse) => {

      return {
        type: 'button',
        text: quickResponse,
        msg: quickResponse,
        msg_in_chat_window: true
      }
    })
  }
}

const createImageAttachment = (richResponse) => {
  return {
    image_url: richResponse.data.imageURL
  }
}

const createVideoAttachment = (richResponse) => {
  return {
    video_url: richResponse.data.video,
  }
}

const createButtonsFields = (richResponse) => {
  var fields = [];
  for (const button of richResponse.data) {
    fields.push({
      short: true,
      value: createButtonText(button)
    })
  }
  return fields;
}

const createButtonText = (button) => {
  return '[' + button.label + '](' + button.linkURL + ') ';
}

const createAudioAttachment = (richResponse) => {
  return {
    audio_url: richResponse.data.audio
  }
}

const createCardAttachment = (card) => {
  return {
    title: card.title,
    title_link: card.imageURL,
    text: card.description,
    thumb_url: card.imageURL
  }
}

const createCollapsibleAttachment = (collapsible) => {
  return {
    title: collapsible.title,
    text: collapsible.content
  }
}