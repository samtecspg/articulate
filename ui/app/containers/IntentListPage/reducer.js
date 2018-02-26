import Immutable from 'seamless-immutable';

// The initial state of the App
const initialState = Immutable({});

function intentListReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export default intentListReducer;
