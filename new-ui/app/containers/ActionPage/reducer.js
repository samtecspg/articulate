/*
 *
 * ActionPage reducer
 *
 */

import Immutable from 'seamless-immutable';
import { DEFAULT_ACTION } from './constants';

export const initialState = Immutable({
  action: {
    id: 129,
    agent: 'Pizza Agent',
    intent: 'Order pizza',
    domain: 'Orders',
    actionName: 'Order pizza',
    useWebhook: false,
    usePostFormat: false,
    slots: [
      {
        uiColor: '#f44336',
        entity: 'Toppings',
        isList: true,
        slotName: 'Toppings',
        isRequired: true,
        textPrompts: [
          'What toppings would you like?'
        ]
      }
    ],
    intentResponses: [
      'Sure we will prepare your pizza with {{andList slots.Toppings.original}}'
    ]
  },
  webhook: {
    agent: '',
    domain: '',
    intent: '',
    webhookUrl: '',
    webhookVerb: 'GET',
    webhookPayloadType: 'None',
    webhookPayload: ''
  },
  postFormat: {
    agent: '',
    domain: '',
    intent: '',
    postFormatPayload: ''
  },
  oldPayloadJSON: "{\n\t'text': '{{text}}',\n\t'intent': {{{JSONstringify intent}}},\n\t'slots': {{{JSONstringify slots}}}\n}",
  oldPayloadXML: "<?xml version='1.0' encoding='UTF-8'?>\n<data>\n\t<text>{{text}}</text>\n\t<intent>{{{toXML intent}}}</intent>\n\t<slots>{{{toXML slots}}}</slots>\n</data>",
});

function ActionPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    default:
      return state;
  }
}

export default ActionPageReducer;
