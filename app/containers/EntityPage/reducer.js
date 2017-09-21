import { fromJS } from 'immutable';
import { createSelector } from 'reselect';

import {
  CHANGE_ENTITY_DATA,
  ADD_EXAMPLE,
  ADD_SYNONYM,
} from './constants';

// The initial state of the App
const initialState = fromJS({
  entityData: {
    agent: null,
    entityName: '',
    examples: [
      {
        value: 'Cheese',
        synonyms: [
          'Cheese', 'Extra Cheese', 'Mozarella'
        ]
      },
    ],
  },
});

function entityReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_ENTITY_DATA:
      return state
      .updateIn(['entityData'], x => x.set(action.payload.field, action.payload.value));
    case ADD_EXAMPLE:
      return state
        .updateIn(['entityData', 'examples'], x => x.push({ value: action.payload.value }));
    case ADD_SYNONYM:
      return state
        .updateIn(['entityData', 'examples'], x => x.push({ value: action.payload.value }));
    default:
      return state;
  }
}

export default entityReducer;
