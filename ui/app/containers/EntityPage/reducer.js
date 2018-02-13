import { fromJS } from 'immutable';
import {
  ADD_EXAMPLE,
  ADD_SYNONYM,
  CHANGE_ENTITY_DATA,
  CLOSE_COLOR_PICKER,
  LOAD_ENTITY,
  LOAD_ENTITY_ERROR,
  LOAD_ENTITY_SUCCESS,
  REMOVE_EXAMPLE,
  REMOVE_SYNONYM,
  RESET_ENTITY_DATA,
  SWITCH_COLOR_PICKER_DISPLAY
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
  touched: false,
});

function entityReducer(state = initialState, action) {

  let examples;

  switch (action.type) {
    case CHANGE_ENTITY_DATA:
      if (action.payload.field === 'uiColor') {
        return state
          .updateIn(['entityData'], x => x.set(action.payload.field, action.payload.value.hex))
          .set('touched', true)
          .set('displayColorPicker', false);
      }
      if (action.payload.field === 'agent') { //Don't set touched given that agent is loaded by the system
        return state
        .updateIn(['entityData'], x => x.set(action.payload.field, action.payload.value));
      }
      return state
        .updateIn(['entityData'], x => x.set(action.payload.field, action.payload.value))
        .set('touched', true);
    case RESET_ENTITY_DATA:
      return initialState;
    case REMOVE_EXAMPLE:
      examples = state.getIn(['entityData', 'examples']);
      examples = examples.filterNot(example => example.get('value') === action.example);
      return state
        .setIn(['entityData', 'examples'], examples)
        .set('touched', true);
    case ADD_EXAMPLE:
      return state
        .updateIn(['entityData', 'examples'], x => x.push(fromJS({ value: action.example, synonyms: [action.example] })))
        .set('touched', true);
    case REMOVE_SYNONYM:
      examples = state.getIn(['entityData', 'examples']);
      examples = examples.map(example => example.get('value') === action.payload.example ? fromJS({ value: example.get('value'), synonyms: example.get('synonyms').filterNot(synonym => synonym === action.payload.synonym) }) : example);
      return state
        .setIn(['entityData', 'examples'], examples)
        .set('touched', true);
    case ADD_SYNONYM:
      examples = state.getIn(['entityData', 'examples']);
      examples = examples.map(example => example.get('value') === action.payload.example ? example.update('synonyms', synonyms => synonyms.push(action.payload.synonym)) : example);
      return state
        .setIn(['entityData', 'examples'], examples)
        .set('touched', true);
    case SWITCH_COLOR_PICKER_DISPLAY:
      return state.set('displayColorPicker', !state.get('displayColorPicker'));
    case CLOSE_COLOR_PICKER:
      return state.set('displayColorPicker', false);
    case LOAD_ENTITY:
      return state
        .set('loading', true)
        .set('error', false);
    case LOAD_ENTITY_SUCCESS:
      return state
        .set('loading', false)
        .set('error', false)
        .set('entityData', fromJS(action.entity));
    case LOAD_ENTITY_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);
    default:
      return state;
  }
}

export default entityReducer;
