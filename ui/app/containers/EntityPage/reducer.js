import Immutable from 'seamless-immutable';
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
const initialState = Immutable({
  displayColorPicker: false,
  entityData: {
    agent: null,
    type: 'learned',
    entityName: '',
    uiColor: '#e91e63',
    examples: [],
    regex: ''
  },
  touched: false,
});

function entityReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_ENTITY_DATA:
      if (action.payload.field === 'uiColor') {
        return state
          .setIn(['entityData', action.payload.field], action.payload.value.hex)
          .set('touched', true)
          .set('displayColorPicker', false);
      }
      if (action.payload.field === 'agent') { //Don't set touched given that agent is loaded by the system
        return state
          .setIn(['entityData', action.payload.field], action.payload.value);
      }
      return state
        .setIn(['entityData', action.payload.field], action.payload.value)
        .set('touched', true);
    case RESET_ENTITY_DATA:
      return initialState;
    case REMOVE_EXAMPLE:
      return state
        .updateIn(['entityData', 'examples'], examples => examples.filter(example => example.value !== action.example))
        .set('touched', true);
    case ADD_EXAMPLE:
      return state
        .updateIn(['entityData', 'examples'], examples => examples.concat({ value: action.example, synonyms: [action.example] }))
        .set('touched', true);
    case REMOVE_SYNONYM:
      return state
        .updateIn(['entityData', 'examples'], examples => {
          return examples.map(example => {
            const { value, synonyms } = example;
            if (value !== action.payload.example) return example; // Not the example we are looking for, make no changes
            const filteredSynonyms = synonyms.filter(synonym => synonym !== action.payload.synonym); //Get all except the one been removed
            return { value, synonyms: filteredSynonyms }; // Generate new example object
          });
        })
        .set('touched', true);
    case ADD_SYNONYM:
      return state
        .updateIn(['entityData', 'examples'], examples => {
          return examples.map(example => {
            const { value, synonyms } = example;
            if (value !== action.payload.example) return example; // Not the example we are looking for, make no changes
            return { value, synonyms: synonyms.concat(action.payload.synonym) }; // Generate new example object
          });
        })
        .set('touched', true);
    case SWITCH_COLOR_PICKER_DISPLAY:
      return state.set('displayColorPicker', !state.displayColorPicker);
    case CLOSE_COLOR_PICKER:
      return state.set('displayColorPicker', false);
    case LOAD_ENTITY:
      return state
        .set('loading', true)
        .set('error', false);
    case LOAD_ENTITY_SUCCESS:
      if (!action.entity.regex){
        action.entity.regex = '';
      }
      return state
        .set('loading', false)
        .set('error', false)
        .set('entityData', action.entity);
    case LOAD_ENTITY_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);
    default:
      return state;
  }
}

export default entityReducer;
