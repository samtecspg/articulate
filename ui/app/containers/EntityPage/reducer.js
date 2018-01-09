import { fromJS } from 'immutable';

import {
  ADD_EXAMPLE,
  ADD_SYNONYM,
  CHANGE_ENTITY_DATA,
  RESET_ENTITY_DATA,
  REMOVE_EXAMPLE,
  REMOVE_SYNONYM,
  SWITCH_COLOR_PICKER_DISPLAY,
  CLOSE_COLOR_PICKER,
} from './constants';

// The initial state of the App
const initialState = fromJS({
  displayColorPicker: false,
  entityData: {
    agent: null,
    entityName: '',
    uiColor: '#e91e63',
    examples: [],
  },
});

function entityReducer(state = initialState, action) {

  let examples;

  switch (action.type) {
    case CHANGE_ENTITY_DATA:
      if (action.payload.field === 'uiColor'){
        return state
          .updateIn(['entityData'], x => x.set(action.payload.field, action.payload.value.hex))
          .set('displayColorPicker', false);
      }
      return state
        .updateIn(['entityData'], x => x.set(action.payload.field, action.payload.value));
    case RESET_ENTITY_DATA:
      return initialState;
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
    case SWITCH_COLOR_PICKER_DISPLAY:
      return state.set('displayColorPicker', !state.get('displayColorPicker'));
    case CLOSE_COLOR_PICKER:
      return state.set('displayColorPicker', false);
    default:
      return state;
  }
}

export default entityReducer;
