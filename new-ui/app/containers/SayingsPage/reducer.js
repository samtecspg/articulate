/*
 *
 * SayingsPage reducer
 *
 */

import Immutable from 'seamless-immutable';

export const initialState = Immutable({
  sayings: [
    {
      id: 1,
      userSays: 'Prepare me a ham and cheese pizza',
      entities: [
        {
          end: 16,
          value: 'ham',
          start: 13,
          entity: 'Toppings',
          entityId: 74
        },
        {
          end: 27,
          value: 'cheese',
          start: 21,
          entity: 'Toppings',
          entityId: 74
        }
      ],
      actions: ['orderPizza']
    },
    {
      id: 2,
      userSays: 'Get me a pizza with cheese and ham',
      entities: [
        {
          end: 26,
          start: 20,
          value: 'cheese',
          entity: 'Toppings',
          entityId: 74
        },
        {
          end: 34,
          start: 31,
          value: 'ham',
          entity: 'Toppings',
          entityId: 74
        }
      ],
      actions: ['orderPizza']
    },
    {
      id: 3,
      userSays: 'I want a pizza with chicken',
      entities: [
        {
          end: 27,
          start: 20,
          value: 'chicken',
          entity: 'Toppings',
          entityId: 74
        }
      ],
      actions: ['orderPizza']
    },
    {
      id: 4,
      userSays: 'Hi, I would like a pizza with cheese and ham',
      entities: [
        {
          end: 36,
          value: 'cheese',
          start: 30,
          entity: 'Toppings',
          entityId: 74
        },
        {
          end: 44,
          value: 'ham',
          start: 41,
          entity: 'Toppings',
          entityId: 74
        }
      ],
      actions: ['greeting', 'orderPizza']
    },
    {
      id: 5,
      userSays: 'This is a very long user saying that doesn\'t says nothing but it is useful for test purposes. This is just spam text and will not be used',
      entities: [],
      actions: ['orderPizza']
    }
  ],
  total: 2
});

function SayingsPageReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export default SayingsPageReducer;
