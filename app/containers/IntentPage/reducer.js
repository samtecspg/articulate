import { fromJS } from 'immutable';
import { createSelector } from 'reselect';

import {
  CHANGE_INTENT_DATA,
  TAG_ENTITY,
  UNTAG_ENTITY,
  TOGGLE_FLAG,
  ADD_TEXT_PROMPT,
  DELETE_TEXT_PROMPT,
} from './constants';

// The initial state of the App
const initialState = fromJS({
  intentData: {
    agent: null,
    domain: null,
    intentName: '',
    examples: [
    ],
  },
  scenarioData: {
    agent: null,
    domain: null,
    intent: null,
    scenarioName: '',
    slots: [
    ],
    intentResponses: [
    ],
    useWebhook: false,
  },
});

function intentReducer(state = initialState, action) {

  let slots, tempState;

  switch (action.type) {
    case CHANGE_INTENT_DATA:
      if (action.payload.field === 'examples'){
        return state
          .updateIn(['intentData', 'examples'], x => x.push(fromJS({ userSays: action.payload.value, entities: [] })))
      }
      else {
        if (action.payload.field === 'responses'){
          return state
            .updateIn(['scenarioData', 'intentResponses'], x => x.push(action.payload.value))
        }
        else{
          if (action.payload.field === 'intentName'){
            tempState = state.setIn(['scenarioData', 'scenarioName'], action.payload.value);
            return tempState
              .updateIn(['intentData'], x => x.set(action.payload.field, action.payload.value));
          }
          else {
            tempState = state.updateIn(['scenarioData'], x => x.set(action.payload.field, action.payload.value));
            return tempState
              .updateIn(['intentData'], x => x.set(action.payload.field, action.payload.value));
          }
        }
      }
    case TAG_ENTITY:
      let newState = null;
      slots = state.getIn(['scenarioData', 'slots']);
      const existingSlot = slots.filter( slot => slot.entity === action.payload.entity);
      if (existingSlot.size === 0){
        slots = state.getIn(['scenarioData', 'slots']);
        newState = state.updateIn(['scenarioData', 'slots'], slots => slots.push({
          slotName: action.payload.entityName,
          entity: action.payload.entity,
          isRequired: false,
          isList: false,
          textPrompts: [],
          useWebhook: false,
        }));
      }
      else{
        newState = state;
      }
      let examples = newState.getIn(['intentData', 'examples']);
      examples = examples.map(example => example.get('userSays') === action.payload.userSays ? example.update('entities', synonyms => synonyms.push({ value: action.payload.value, entity: action.payload.entity, start: action.payload.start, end: action.payload.end})) : example);
      return newState
        .setIn(['intentData', 'examples'], examples);
    case UNTAG_ENTITY:
      return state
        .updateIn(['intentData', 'examples'], x => x.push(fromJS({ value: action.example, synonyms: [action.example] })));
    case TOGGLE_FLAG:
      slots = state.getIn(['scenarioData', 'slots']);
      slots = slots.map( (slot) => {
        if (slot.slotName === action.payload.slotName){
          slot[action.payload.field] = action.payload.value;
        }
        return slot;
      });
      return state
        .setIn(['scenarioData', 'slots'], slots)
    case ADD_TEXT_PROMPT:
      slots = state.getIn(['scenarioData', 'slots']);
      slots = slots.map( (slot) => {
        if (slot.slotName === action.payload.slotName){
          slot.textPrompts.push(action.payload.value);
        }
        return slot;
      });
      return state
        .setIn(['scenarioData', 'slots'], slots)
    case DELETE_TEXT_PROMPT:
      slots = state.getIn(['scenarioData', 'slots']);
      slots = slots.map( (slot) => {
        if (slot.slotName === action.payload.slotName){
          slot.textPrompts.splice(slot.textPrompts.indexOf(action.payload.textPrompt))
        }
        return slot;
      });
      console.log(slots);
      return state
        .setIn(['scenarioData', 'slots'], slots);
    default:
      return state;
  }
}

export default intentReducer;
