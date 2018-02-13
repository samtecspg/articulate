import { fromJS } from 'immutable';
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
const initialState = fromJS({
  windowSelection: '',
  intentData: {
    agent: null,
    domain: null,
    intentName: '',
    examples: [],
  },
  scenarioData: {
    agent: null,
    domain: null,
    intent: null,
    scenarioName: '',
    slots: [],
    intentResponses: [],
    useWebhook: false,
    webhookUrl: '',
  },
  touched: false,
});

function intentReducer(state = initialState, action) {
  let slots;
  let tempState;
  let examples;

  switch (action.type) {
    case CHANGE_INTENT_DATA:
      if (action.payload.field === 'examples') {
        return state
          .updateIn(['intentData', 'examples'], (x) => x.splice(0, 0, fromJS({ userSays: action.payload.value, entities: [] })))
          .set('touched', true);
      } else if (action.payload.field === 'responses') {
        return state
          .updateIn(['scenarioData', 'intentResponses'], (x) => x.splice(0, 0, action.payload.value))
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
        tempState = state.setIn(['scenarioData', 'scenarioName'], action.payload.value);
        return tempState
          .updateIn(['intentData'], (x) => x.set(action.payload.field, action.payload.value))
          .set('touched', true);
      } else {
        tempState = state.updateIn(['scenarioData'], (x) => x.set(action.payload.field, (action.payload.field === 'agent' ? action.payload.value.split('~')[1] : action.payload.value)));
        return tempState
          .updateIn(['intentData'], (x) => x.set(action.payload.field, (action.payload.field === 'agent' ? action.payload.value.split('~')[1] : action.payload.value)))
          .set('touched', true);
      }
    case RESET_INTENT_DATA:
      return initialState;
    case TAG_ENTITY:
      const selectedText = state.get('windowSelection');
      if (selectedText !== '') {

        const start = action.payload.userSays.indexOf(selectedText);
        const end = start + selectedText.length;
        const value = action.payload.userSays.substring(start, end);

        let newState = state;
        examples = newState.getIn(['intentData', 'examples']);
        examples = examples.map((example) => {
          return example.get('userSays') === action.payload.userSays ? example.update('entities', (synonyms) => {
            synonyms = synonyms === '' ? fromJS([]) : synonyms;// Redis saves an empty array as an empty string so we need to re-create the array
            return synonyms.push({ value, entity: action.payload.entity.entityName, start, end, entityId: action.payload.entity.id });
          }) : example;
        });
        newState = newState.set('windowSelection', '');
        return newState
          .setIn(['intentData', 'examples'], examples)
          .set('touched', true);
      }
      return state;
    case UNTAG_ENTITY:
      return state
        .updateIn(['intentData', 'examples'], (x) => x.push(fromJS({ value: action.example, synonyms: [action.example] })))
        .set('touched', true);
    case TOGGLE_FLAG:
      slots = state.getIn(['scenarioData', 'slots']);
      slots = slots.map((slot) => {
        if (slot.get('slotName') === action.payload.slotName) {
          slot = slot.set(action.payload.field, action.payload.value);
        }
        return slot;
      });
      return state
        .setIn(['scenarioData', 'slots'], slots)
        .set('touched', true);
    case CHANGE_SLOT_NAME:
      slots = state.getIn(['scenarioData', 'slots']);
      slots = slots.map((slot) => {
        if (slot.get('slotName') === action.payload.slotName) {
          slot = slot.set('slotName', action.payload.value);
        }
        slot = slot.set('textPrompts', slot.get('textPrompts').map((textPrompt) => {
          if (textPrompt.indexOf(`{${action.payload.slotName}}`) > -1) {
            textPrompt = textPrompt.replace(new RegExp(`{${action.payload.slotName}}`, 'g'), `{${action.payload.value}}`);
          }
          return textPrompt;
        }));
        return slot;
      });
      let intentResponses = state.getIn(['scenarioData', 'intentResponses']);
      intentResponses = intentResponses.map((response) => {
        if (response.indexOf(`{${action.payload.slotName}}`) > -1) {
          response = response.replace(new RegExp(`{${action.payload.slotName}}`, 'g'), `{${action.payload.value}}`);
        }
        return response;
      });
      return state
        .setIn(['scenarioData', 'slots'], slots)
        .setIn(['scenarioData', 'intentResponses'], intentResponses)
        .set('touched', true);
    case ADD_TEXT_PROMPT:
      slots = state.getIn(['scenarioData', 'slots']);
      slots = slots.map((slot) => {
        if (slot.get('slotName') === action.payload.slotName) {
          const updatedSlot = slot.get('textPrompts').push(action.payload.value);
          slot = slot.set('textPrompts', updatedSlot);
        }
        return slot;
      });
      return state
        .setIn(['scenarioData', 'slots'], slots)
        .set('touched', true);
    case DELETE_TEXT_PROMPT:
      slots = state.getIn(['scenarioData', 'slots']);
      slots = slots.map((slot) => {
        if (slot.get('slotName') === action.payload.slotName) {
          slot = slot.set('textPrompts', slot.get('textPrompts').splice(slot.get('textPrompts').indexOf(action.payload.textPrompt), 1));
        }
        return slot;
      });
      return state
        .setIn(['scenarioData', 'slots'], slots)
        .set('touched', true);
    case REMOVE_USER_SAYING:
      return state
        .setIn(['intentData', 'examples'], state.getIn(['intentData', 'examples']).splice(action.index, 1))
        .set('touched', true);
    case REMOVE_AGENT_RESPONSE:
      return state
        .setIn(['scenarioData', 'intentResponses'], state.getIn(['scenarioData', 'intentResponses']).splice(action.index, 1))
        .set('touched', true);
    case REMOVE_SLOT:
      return state
        .setIn(['scenarioData', 'slots'], state.getIn(['scenarioData', 'slots']).splice(action.index, 1))
        .set('touched', true);
    case ADD_SLOT:
      slots = state.getIn(['scenarioData', 'slots']);
      const existingSlot = slots.filter((slot) => {
        return slot.get('entity') === action.slot.entity;
      });
      if (existingSlot.size === 0) {
        return state
          .updateIn(['scenarioData', 'slots'], (slots) => slots.push(fromJS(action.slot)))
          .set('touched', true);
      }
      return state
        .set('touched', true);
    case SET_WINDOW_SELECTION:
      return state
        .set('windowSelection', action.selection);
    case LOAD_INTENT:
      return state
        .set('loading', true)
        .set('error', false);
    case LOAD_INTENT_SUCCESS:
      let transformedIntent = action.intent;
      transformedIntent.examples = transformedIntent.examples.map((example) => {
        example.entities = Array.isArray(example.entities) ? example.entities : [];
        return example;
      });
      transformedIntent = fromJS(transformedIntent);
      return state
        .set('loading', false)
        .set('error', false)
        .set('intentData', transformedIntent);
    case LOAD_INTENT_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);
    case LOAD_SCENARIO:
      return state
        .set('loading', true)
        .set('error', false);
    case LOAD_SCENARIO_SUCCESS:
      let transformedScenario = action.scenario;
      if (Array.isArray(transformedScenario.slots)) {
        transformedScenario.slots = action.scenario.slots.map((slot) => {
          slot.isList = slot.isList === 'true';
          slot.isRequired = slot.isRequired === 'true';
          slot.useWebhook = slot.useWebhook === 'true';
          slot.textPrompts = Array.isArray(slot.textPrompts) ? slot.textPrompts : [];
          return slot;
        });
      }
      else {
        transformedScenario.slots = [];
      }
      transformedScenario.intentResponses = Array.isArray(transformedScenario.intentResponses) ? transformedScenario.intentResponses : [];
      transformedScenario.useWebhook = action.useWebhook === 'true';
      transformedScenario = fromJS(transformedScenario);
      return state
        .set('loading', false)
        .set('error', false)
        .set('scenarioData', transformedScenario);
    case LOAD_SCENARIO_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);
    default:
      return state;
  }
}

export default intentReducer;
