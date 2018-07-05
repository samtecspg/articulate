import Immutable from 'seamless-immutable';
import {
  ADD_SLOT,
  ADD_TEXT_PROMPT,
  CHANGE_INTENT_DATA,
  CHANGE_WEBHOOK_DATA,
  CHANGE_POSTFORMAT_DATA,
  CHANGE_SLOT_NAME,
  CHANGE_SLOT_AGENT,
  DELETE_TEXT_PROMPT,
  LOAD_INTENT,
  LOAD_INTENT_ERROR,
  LOAD_INTENT_SUCCESS,
  RELOAD_INTENT_WITH_SYS_ENTITIES,
  LOAD_SCENARIO,
  LOAD_SCENARIO_ERROR,
  LOAD_SCENARIO_SUCCESS,
  LOAD_WEBHOOK,
  LOAD_WEBHOOK_ERROR,
  LOAD_WEBHOOK_SUCCESS,
  LOAD_POSTFORMAT,
  LOAD_POSTFORMAT_ERROR,
  LOAD_POSTFORMAT_SUCCESS,
  REMOVE_AGENT_RESPONSE,
  REMOVE_SLOT,
  REMOVE_USER_SAYING,
  RESET_INTENT_DATA,
  SET_WINDOW_SELECTION,
  TAG_ENTITY,
  TOGGLE_FLAG,
  UNTAG_ENTITY,
  SORT_SLOTS,
} from './constants';
import messages from './messages';

// The initial state of the App
const initialState = Immutable({
  windowSelection: '',
  intentData: {
    agent: null,
    domain: null,
    intentName: '',
    examples: [],
    useWebhook: false,
    usePostFormat: false,
  },
  scenarioData: {
    agent: null,
    domain: null,
    intent: null,
    scenarioName: '',
    slots: [],
    intentResponses: [],
  },
  webhookData: {
    agent: null,
    domain: null,
    intent: null,
    webhookUrl: '',
    webhookVerb: 'GET',
    webhookPayloadType: 'None',
    webhookPayload: '',
  },
  postFormatData: {
    agent: null,
    domain: null,
    intent: null,
    postFormatPayload: ''
  },
  touched: false,
  oldIntent: null,
  oldScenario: null,
  oldWebhook: null,
  oldPayloadJSON: '{\n\t"text": "{{text}}",\n\t"intent": {{{JSONstringify intent}}},\n\t"slots": {{{JSONstringify slots}}}\n}',
  oldPayloadXML: '<?xml version="1.0" encoding="UTF-8"?>\n<data>\n\t<text>{{text}}</text>\n\t<intent>{{{toXML intent}}}</intent>\n\t<slots>{{{toXML slots}}}</slots>\n</data>'
});

function intentReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_INTENT_DATA:
      if (action.payload.field === 'examples') {
        return state
          .updateIn(['intentData', 'examples'], examples => Immutable([{ userSays: action.payload.value, entities: [] }]).concat(examples))
          .set('touched', true);
      } else if (action.payload.field === 'responses') {
        return state
          .updateIn(['scenarioData', 'intentResponses'], intentResponses => Immutable([action.payload.value]).concat(intentResponses))
          .set('touched', true);
      } else if (action.payload.field === 'useWebhook') {
        return state
          .setIn(['intentData', action.payload.field], action.payload.value)
          .set('touched', true);
      }
      else if (action.payload.field === 'usePostFormat') {
        if (state.oldIntent !== null) {
          if (!state.oldIntent.usePostFormat) {
            return state
              .setIn(['intentData', action.payload.field], action.payload.value)
              .setIn(['postFormatData', 'postFormatPayload'], messages.defaultPostFormat.defaultMessage)
              .set('touched', true);
          }
          else {
            return state
              .setIn(['intentData', action.payload.field], action.payload.value)
              .set('touched', true);
          }
        }
        else {
          return state
            .setIn(['intentData', action.payload.field], action.payload.value)
            .setIn(['postFormatData', 'postFormatPayload'], messages.defaultPostFormat.defaultMessage)
            .set('touched', true);
        }

      }
      else if (action.payload.field === 'webhookUrl') {
        return state
          .setIn(['scenarioData', 'webhookUrl'], action.payload.value)
          .set('touched', true);
      } else if (action.payload.field === 'intentName') {
        return state
          .setIn(['scenarioData', 'scenarioName'], action.payload.value)
          .setIn(['scenarioData', 'intent'], action.payload.value)
          .setIn(['webhookData', 'intent'], action.payload.value)
          .setIn(['intentData', action.payload.field], action.payload.value)
          .setIn(['postFormatData', 'intent'], action.payload.value)
          .set('touched', true);
      } else {
        return state
          .updateIn(['webhookData'], (scenarioData) => scenarioData.set(action.payload.field, (action.payload.field === 'agent' ? action.payload.value.split('~')[1] : action.payload.value)))
          .updateIn(['scenarioData'], (scenarioData) => scenarioData.set(action.payload.field, (action.payload.field === 'agent' ? action.payload.value.split('~')[1] : action.payload.value)))
          .updateIn(['intentData'], (intentData) => intentData.set(action.payload.field, (action.payload.field === 'agent' ? action.payload.value.split('~')[1] : action.payload.value)))
          .set('touched', true);
      }
    case CHANGE_WEBHOOK_DATA:
      if (action.payload.field === 'webhookPayloadType' && action.payload.value === 'None') {
        if (state.webhookData.webhookPayloadType === 'JSON') {
          state = state.set('oldPayloadJSON', state.webhookData.webhookPayload);
        }
        if (state.webhookData.webhookPayloadType === 'XML') {
          state = state.set('oldPayloadXML', state.webhookData.webhookPayload);
        }
        return state
          .setIn(['webhookData', 'webhookPayload'], '')
          .setIn(['webhookData', action.payload.field], action.payload.value)
          .set('touched', true);
      }
      else {
        if (action.payload.field === 'webhookPayloadType') {
          if (action.payload.value === 'JSON' && state.webhookData.webhookPayloadType !== 'JSON') {
            if (state.webhookData.webhookPayloadType === 'XML') {
              state = state.set('oldPayloadXML', state.webhookData.webhookPayload);
            }
            state = state.setIn(['webhookData', 'webhookPayload'], state.oldPayloadJSON);
          }
          if (action.payload.value === 'XML' && state.webhookData.webhookPayloadType !== 'XML') {
            if (state.webhookData.webhookPayloadType === 'JSON') {
              state = state.set('oldPayloadJSON', state.webhookData.webhookPayload);
            }
            state = state.setIn(['webhookData', 'webhookPayload'], state.oldPayloadXML);
          }
        }
        return state
          .setIn(['webhookData', action.payload.field], action.payload.value)
          .set('touched', true);
      }
    case CHANGE_POSTFORMAT_DATA:

      return state
        .setIn(['postFormatData', 'postFormatPayload'], action.payload.value)
        .set('touched', true);
    case RESET_INTENT_DATA:
      return initialState;
    case TAG_ENTITY:
      const selectedText = state.windowSelection;
      if (selectedText !== '') {
        const start = action.payload.userSays.indexOf(selectedText);
        const end = start + selectedText.length;
        const value = action.payload.userSays.substring(start, end);
        return state
          .updateIn(['intentData', 'examples'], examples => examples.map(example => {
            const { userSays } = example;
            if (userSays !== action.payload.userSays) return example; // Not the example we are looking for, make no changes
            return example.updateIn(['entities'], (entities) => {
              const entityToAdd = {
                value,
                entity: action.payload.entity.entityName,
                start,
                end,
                entityId: action.payload.entity.id
              };
              if (action.payload.entity.entityName.indexOf('sys.') !== -1) {
                entityToAdd.extractor = 'system';
                entityToAdd.entityId = 0;
              }
              return entities.concat(entityToAdd);
            });
          }))
          .set('touched', true)
          .set('windowSelection', '');
      }
      return state;
    case UNTAG_ENTITY:
      return state
        .updateIn(['intentData', 'examples'], (examples) => examples.concat({ value: action.example, synonyms: [action.example] }))
        .set('touched', true);
    case TOGGLE_FLAG:
      return state
        .updateIn(['scenarioData', 'slots'], examples =>
          examples.map(slot => {
            const { slotName } = slot;
            if (slotName !== action.payload.slotName) return slot; // Not the slot we are looking for, make no changes
            return slot.set(action.payload.field, action.payload.value);
          })
        )
        .set('touched', true);
    case CHANGE_SLOT_NAME:
      return state
        .updateIn(['scenarioData', 'slots'], slots =>
          slots.map(slot => {
            const slotName = slot.slotName === action.payload.slotName ? action.payload.value : slot.slotName;
            return slot
              .set('slotName', slotName)
              .update('textPrompts', textPrompts => textPrompts.map(textPrompt => {
                if (textPrompt.indexOf(`{{slots.${action.payload.slotName}.original}}`) > -1 || textPrompt.indexOf(`{{slots.${action.payload.slotName}.value}}`) > -1 || textPrompt.indexOf(`{{slots.[${action.payload.slotName}].value}}`) > -1 || textPrompt.indexOf(`{{slots.[${action.payload.slotName}].value}}`) > -1) {
                  return textPrompt.replace(new RegExp(`{{slots.${action.payload.slotName}`, 'g'), `{{slots.${action.payload.value}`);
                }
                return textPrompt;
              }));
          })
        )
        .updateIn(['scenarioData', 'intentResponses'], intentResponses =>
          intentResponses.map(intentResponse => {
            if (intentResponse.indexOf(`{{slots.${action.payload.slotName}.original}}`) > -1 || intentResponse.indexOf(`{{slots.${action.payload.slotName}.value}}`) > -1 || intentResponse.indexOf(`{{slots.[${action.payload.slotName}].value}}`) > -1 || intentResponse.indexOf(`{{slots.[${action.payload.slotName}].value}}`) > -1) {
              return intentResponse.replace(new RegExp(`{{slots.${action.payload.slotName}`, 'g'), `{{slots.${action.payload.value}`);
            }
            return intentResponse;
          })
        )
        .set('touched', true);
    case CHANGE_SLOT_AGENT:
      return state
        .updateIn(['scenarioData', 'slots'], slots =>
          slots.map(slot => {
            if (slot.slotName === action.payload.slotName){
              return slot
                .set('entity', action.payload.entityName);
            }
            else {
              return slot;
            }
          })
        )
        .set('touched', true);
    case ADD_TEXT_PROMPT:
      return state
        .updateIn(['scenarioData', 'slots'], slots =>
          slots.map(slot => {
            const { slotName, textPrompts } = slot;
            if (slotName !== action.payload.slotName) return slot; // Not the slot we are looking for, make no changes
            return slot.set('textPrompts', textPrompts.concat(action.payload.value));
          })
        )
        .set('touched', true);
    case DELETE_TEXT_PROMPT:
      return state
        .updateIn(['scenarioData', 'slots'], slots => slots.map(slot => {
          const { slotName, textPrompts } = slot;
          if (slotName !== action.payload.slotName) return slot; // Not the slot we are looking for, make no changes
          return slot.set('textPrompts', textPrompts.filter(textPrompt => textPrompt !== action.payload.textPrompt));
        }))
        .set('touched', true);
    case REMOVE_USER_SAYING:
      return state
        .updateIn(['intentData', 'examples'], examples => examples.filter((example, index) => index !== action.index))
        .set('touched', true);
    case REMOVE_AGENT_RESPONSE:
      return state
        .updateIn(['scenarioData', 'intentResponses'], intentResponses => intentResponses.filter((intentResponse, index) => index !== action.index))
        .set('touched', true);
    case REMOVE_SLOT:
      return state
        .updateIn(['scenarioData', 'slots'], slots => slots.filter((slot, index) => index !== action.index))
        .set('touched', true);
    case ADD_SLOT:
      return state
        .updateIn(['scenarioData', 'slots'], slots => {
          const existingSlots = slots.filter((slot) => {
            return slot.entity && slot.entity === action.slot.entity;
          });
          if (existingSlots.length === 0) {
            return slots.concat(action.slot);
          }
          return slots;
        })
        .set('touched', true);
    case SET_WINDOW_SELECTION:
      return state
        .set('windowSelection', action.selection);
    case LOAD_INTENT:
      return state
        .set('loading', true)
        .set('error', false);
    case LOAD_INTENT_SUCCESS:
      return state
        .set('loading', false)
        .set('error', false)
        .set('oldIntent', action.intent)
        .set('intentData', action.intent);
    case RELOAD_INTENT_WITH_SYS_ENTITIES:
        return state
        .set('loading', false)
        .set('error', false)
        .set('intentData', action.intent);
    case LOAD_INTENT_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);
    case LOAD_SCENARIO:
      return state
        .set('loading', true)
        .set('error', false);
    case LOAD_SCENARIO_SUCCESS:
      return state
        .set('loading', false)
        .set('error', false)
        .set('oldScenario', action.scenario)
        .set('scenarioData', action.scenario);
    case LOAD_SCENARIO_ERROR:
      return state
        .set('error', action.error)
        .set('oldScenario', null)
        .set('loading', false);
    case LOAD_WEBHOOK:
      return state
        .set('loading', true)
        .set('error', false);
    case LOAD_POSTFORMAT:
      return state
        .set('loading', true)
        .set('error', false);
    case LOAD_POSTFORMAT_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);
    case LOAD_POSTFORMAT_SUCCESS:
      return state
        .set('loading', false)
        .set('error', false)
        .set('postFormatData', action.postFormat);
    case LOAD_WEBHOOK_SUCCESS:
      return state
        .set('loading', false)
        .set('error', false)
        .set('oldWebhook', action.webhook)
        .set('webhookData', action.webhook);
    case LOAD_WEBHOOK_ERROR:
      return state
        .set('error', action.error)
        .set('oldWebhook', null)
        .set('loading', false);
    case SORT_SLOTS:
      const tempSlots = Immutable.asMutable(state.scenarioData.slots, { deep: true});
      tempSlots.splice(action.newIndex, 0, tempSlots.splice(action.oldIndex, 1)[0]);
      return state
        .setIn(['scenarioData', 'slots'], Immutable(tempSlots));
    default:
      return state;
  }
}

export default intentReducer;
