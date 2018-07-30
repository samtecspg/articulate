/*
 *
 * KeywordsEditPage reducer
 *
 */

import Immutable from 'seamless-immutable';
import { DEFAULT_ACTION } from './constants';

export const initialState = Immutable({
  keyword: {
    id: 2,
    type: 'learned',
    regex: '',
    agent: 'Pizza Agent',
    uiColor: '#e91e63',
    keywordName: 'Toppings',
    examples: [
      {
        value: 'Mushrooms',
        synonyms: [
          'Mushrooms'
        ]
      },
      {
        value: 'Onions',
        synonyms: [
          'Onions'
        ]
      },
      {
        value: 'peppers',
        synonyms: [
          'peppers'
        ]
      },
      {
        value: 'pepperoni',
        synonyms: [
          'pepperoni'
        ]
      },
      {
        value: 'olives',
        synonyms: [
          'olives'
        ]
      },
      {
        value: 'chicken',
        synonyms: [
          'chicken'
        ]
      },
      {
        value: 'meat',
        synonyms: [
          'meat'
        ]
      },
      {
        value: 'ham',
        synonyms: [
          'ham',
          'canadian bacon'
        ]
      }
    ]
  },
});

function keywordsPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    default:
      return state;
  }
}

export default keywordsPageReducer;
