/*
 *
 * KeywordsPage reducer
 *
 */

import Immutable from 'seamless-immutable';
import { DEFAULT_ACTION } from './constants';

export const initialState = Immutable({
  keywords: [
    {
      id: 1,
      type: 'regex',
      agent: 'Pizza Agent',
      regex: null,
      uiColor: '#7986cb',
      keywordName: 'PhoneNumber',
      examples: [
        {
          value: '[0-9][0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]',
          synonyms: [
            '[0-9][0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]',
            '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'
          ]
        }
      ]
    },
    {
      id: 2,
      type: 'learned',
      regex: null,
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
    }
  ],
  total: 2
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
