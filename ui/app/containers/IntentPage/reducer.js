import Immutable from 'seamless-immutable';
import {
  ADD_SLOT,
  ADD_TEXT_PROMPT,
  CHANGE_INTENT_DATA,
  CHANGE_SLOT_NAME,
  DELETE_TEXT_PROMPT,
  LOAD_INTENT,
  LOAD_INTENT_ERROR,
  LOAD_INTENT_SUCCESS,
  LOAD_SCENARIO,
  LOAD_SCENARIO_ERROR,
  LOAD_SCENARIO_SUCCESS,
  REMOVE_AGENT_RESPONSE,
  REMOVE_SLOT,
  REMOVE_USER_SAYING,
  RESET_INTENT_DATA,
  SET_WINDOW_SELECTION,
  TAG_ENTITY,
  TOGGLE_FLAG,
  UNTAG_ENTITY,
} from './constants';

// The initial state of the App
const initialState = Immutable({
  windowSelection: '',
  intentData: {
    agent: null,
    domain: null,
    intentName: '',
    examples: [],
    useWebhook: false,
  },
  scenarioData: {
    agent: null,
    domain: null,
    intent: null,
    scenarioName: '',
    slots: [],
    intentResponses: [],
  },
  touched: false,
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
          .setIn(['scenarioData', 'useWebhook'], action.payload.value)
          .set('touched', true);
      } else if (action.payload.field === 'webhookUrl') {
        return state
          .setIn(['scenarioData', 'webhookUrl'], action.payload.value)
          .set('touched', true);
      } else if (action.payload.field === 'intentName') {
        return state
          .setIn(['scenarioData', 'scenarioName'], action.payload.value)
          .setIn(['intentData', action.payload.field], action.payload.value)
          .set('touched', true);
      } else {
        return state
          .updateIn(['scenarioData'], (scenarioData) => scenarioData.set(action.payload.field, (action.payload.field === 'agent' ? action.payload.value.split('~')[1] : action.payload.value)))
          .updateIn(['intentData'], (intentData) => intentData.set(action.payload.field, (action.payload.field === 'agent' ? action.payload.value.split('~')[1] : action.payload.value)))
          .set('touched', true);
      }
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
            return example.updateIn(['entities'], (synonyms) => {
              const tmpSynonyms = synonyms === '' ? Immutable([]) : synonyms; // Redis saves an empty array as an empty string so we need to re-create the array
              return tmpSynonyms.concat({
                value,
                entity: action.payload.entity.entityName,
                start,
                end,
                entityId: action.payload.entity.id
              });
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
        .updateIn(['scenarioData', 'slots'], examples =>
          examples.map(slot => {
            const slotName = slot.slotName === action.payload.slotName ? action.payload.value : slot.slotName;
            return slot
              .set('slotName', slotName)
              .updateIn('textPrompts', textPrompts => textPrompts.map(textPrompt => {
                if (textPrompt.indexOf(`{{${action.payload.slotName}}}`) > -1) {
                  return textPrompt.replace(new RegExp(`{{${action.payload.slotName}}}`, 'g'), `{{${action.payload.value}}}`);
                }
                return textPrompt;
              }));
          })
        )
        .updateIn(['scenarioData', 'intentResponses'], intentResponses =>
          intentResponses.map(intentResponse => {
            if (intentResponse.indexOf(`{{${action.payload.slotName}}}`) > -1) {
              return intentResponse.replace(new RegExp(`{{${action.payload.slotName}}}`, 'g'), `{{${action.payload.value}}}`);
            }
            return intentResponse;
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
            return slot.entity === action.slot.entity;
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
        .set('scenarioData', action.scenario);
    case LOAD_SCENARIO_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);
    default:
      return state;
  }
}

export default intentReducer;
