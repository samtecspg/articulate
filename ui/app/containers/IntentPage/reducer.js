import { fromJS } from 'immutable';

import {
  ADD_TEXT_PROMPT,
  CHANGE_INTENT_DATA,
  RESET_INTENT_DATA,
  CHANGE_SLOT_NAME,
  DELETE_TEXT_PROMPT,
  TAG_ENTITY,
  TOGGLE_FLAG,
  UNTAG_ENTITY,
  REMOVE_USER_SAYING,
  REMOVE_AGENT_RESPONSE,
  REMOVE_SLOT,
} from './constants';

// The initial state of the App
const initialState = fromJS({
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
});

function intentReducer(state = initialState, action) {
  let slots;
  let tempState;
  let examples;

  switch (action.type) {
    case CHANGE_INTENT_DATA:
      if (action.payload.field === 'examples') {
        return state
          .updateIn(['intentData', 'examples'], (x) => x.push(fromJS({ userSays: action.payload.value, entities: [] })));
      } else if (action.payload.field === 'responses') {
        return state
          .updateIn(['scenarioData', 'intentResponses'], (x) => x.push(action.payload.value));
      } else if (action.payload.field === 'useWebhook') {
        return state
          .setIn(['scenarioData', 'useWebhook'], action.payload.value);
      } else if (action.payload.field === 'webhookUrl') {
        return state
          .setIn(['scenarioData', 'webhookUrl'], action.payload.value);
      } else if (action.payload.field === 'intentName') {
        tempState = state.setIn(['scenarioData', 'scenarioName'], action.payload.value);
        return tempState
          .updateIn(['intentData'], (x) => x.set(action.payload.field, action.payload.value));
      } else {
        tempState = state.updateIn(['scenarioData'], (x) => x.set(action.payload.field, ((action.payload.field === 'agent' || action.payload.field === 'domain') ? action.payload.value.split('~')[1] : action.payload.value)));
        return tempState
          .updateIn(['intentData'], (x) => x.set(action.payload.field, ((action.payload.field === 'agent' || action.payload.field === 'domain') ? action.payload.value.split('~')[1] : action.payload.value)));
      }
    case RESET_INTENT_DATA:
      return initialState;
    case TAG_ENTITY:
      let newState = null;
      slots = state.getIn(['scenarioData', 'slots']);
      const existingSlot = slots.filter((slot) => slot.entity === action.payload.entity);
      if (existingSlot.size === 0) {
        slots = state.getIn(['scenarioData', 'slots']);
        newState = state.updateIn(['scenarioData', 'slots'], (slots) => slots.push({
          slotName: action.payload.entityName,
          entity: action.payload.entity,
          isRequired: false,
          isList: false,
          textPrompts: [],
          useWebhook: false,
        }));
      } else {
        newState = state;
      }
      examples = newState.getIn(['intentData', 'examples']);
      examples = examples.map((example) => example.get('userSays') === action.payload.userSays ? example.update('entities', (synonyms) => synonyms.push({ value: action.payload.value, entity: action.payload.entity, start: action.payload.start, end: action.payload.end })) : example);
      return newState
        .setIn(['intentData', 'examples'], examples);
    case UNTAG_ENTITY:
      return state
        .updateIn(['intentData', 'examples'], (x) => x.push(fromJS({ value: action.example, synonyms: [action.example] })));
    case TOGGLE_FLAG:
      slots = state.getIn(['scenarioData', 'slots']);
      slots = slots.map((slot) => {
        if (slot.slotName === action.payload.slotName) {
          slot[action.payload.field] = action.payload.value;
        }
        return slot;
      });
      return state
        .setIn(['scenarioData', 'slots'], slots);
    case CHANGE_SLOT_NAME:
      slots = state.getIn(['scenarioData', 'slots']);
      slots = slots.map((slot) => {
        if (slot.slotName === action.payload.slotName) {
          slot.slotName = action.payload.value;
        }
        return slot;
      });
      return state
        .setIn(['scenarioData', 'slots'], slots);
    case ADD_TEXT_PROMPT:
      slots = state.getIn(['scenarioData', 'slots']);
      slots = slots.map((slot) => {
        if (slot.slotName === action.payload.slotName) {
          slot.textPrompts.push(action.payload.value);
        }
        return slot;
      });
      return state
        .setIn(['scenarioData', 'slots'], slots);
    case DELETE_TEXT_PROMPT:
      slots = state.getIn(['scenarioData', 'slots']);
      slots = slots.map((slot) => {
        if (slot.slotName === action.payload.slotName) {
          slot.textPrompts.splice(slot.textPrompts.indexOf(action.payload.textPrompt), 1);
        }
        return slot;
      });
      return state
        .setIn(['scenarioData', 'slots'], slots);
    case REMOVE_USER_SAYING:
      return state
        .setIn(['intentData', 'examples'], state.getIn(['intentData', 'examples']).splice(action.index,1));
    case REMOVE_AGENT_RESPONSE:
      return state
        .setIn(['scenarioData', 'intentResponses'], state.getIn(['scenarioData', 'intentResponses']).splice(action.index,1));
    case REMOVE_SLOT:
      return state
        .setIn(['scenarioData', 'slots'], state.getIn(['scenarioData', 'slots']).splice(action.index,1));
    default:
      return state;
  }
}

export default intentReducer;
