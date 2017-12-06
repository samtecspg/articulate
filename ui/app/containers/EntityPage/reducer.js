import { fromJS } from 'immutable';

import {
  ADD_EXAMPLE,
  ADD_SYNONYM,
  CHANGE_ENTITY_DATA,
  REMOVE_EXAMPLE,
  REMOVE_SYNONYM,
} from './constants';

// The initial state of the App
const initialState = fromJS({
  entityData: {
    agent: null,
    entityName: '',
    examples: [],
  },
});

function entityReducer(state = initialState, action) {

  let examples;

  switch (action.type) {
    case CHANGE_ENTITY_DATA:
      return state
        .updateIn(['entityData'], x => x.set(action.payload.field, action.payload.value));
    case REMOVE_EXAMPLE:
      examples = state.getIn(['entityData', 'examples']);
      examples = examples.filterNot(example => example.get('value') === action.example);
      return state
        .setIn(['entityData', 'examples'], examples);
    case ADD_EXAMPLE:
      return state
        .updateIn(['entityData', 'examples'], x => x.push(fromJS({ value: action.example, synonyms: [action.example] })));
    case REMOVE_SYNONYM:
      examples = state.getIn(['entityData', 'examples']);
      examples = examples.map(example => example.get('value') === action.payload.example ? fromJS({ value: example.get('value'), synonyms: example.get('synonyms').filterNot(synonym => synonym === action.payload.synonym) }) : example);
      return state
        .setIn(['entityData', 'examples'], examples);
    case ADD_SYNONYM:
      examples = state.getIn(['entityData', 'examples']);
      examples = examples.map(example => example.get('value') === action.payload.example ? example.update('synonyms', synonyms => synonyms.push(action.payload.synonym)) : example);
      return state
        .setIn(['entityData', 'examples'], examples);
    default:
      return state;
  }
}

export default entityReducer;
