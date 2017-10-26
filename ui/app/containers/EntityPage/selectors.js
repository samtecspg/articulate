import { createSelector } from 'reselect';

const selectEntity = (state) => state.get('entity');

const makeSelectEntityData = () => createSelector(
  selectEntity,
  (entityState) => entityState.get('entityData').toJS()
);

export {
  selectEntity,
  makeSelectEntityData,
};
