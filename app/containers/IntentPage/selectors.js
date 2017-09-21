import { createSelector } from 'reselect';

const selectIntent = (state) => state.get('intent');

const makeSelectIntentData = () => createSelector(
  selectIntent,
  (intentState) => intentState.get('intentData').toJS()
);

export {
  selectIntent,
  makeSelectIntentData,
};
