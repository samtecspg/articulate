import { fromJS } from 'immutable';

// The initial state of the App
const initialState = fromJS({
  domainData: {
    agent: null,
    domainName: '',
    enabled: true,
    intentThreshold: 65,
  },
});

function intentListReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export default intentListReducer;
