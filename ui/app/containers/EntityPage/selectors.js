import { createSelector } from 'reselect';

const selectEntity = (state) => state.get('entity');

const makeSelectEntityData = () => createSelector(
  selectEntity,
  (entityState) => entityState.get('entityData').toJS(),
);

const makeDisplayColorPicker = () => createSelector(
  selectEntity,
  (displayColorPickerState) => displayColorPickerState.get('displayColorPicker'),
);

const makeSelectTouched = () => createSelector(
  selectEntity,
  (entityState) => entityState.get('touched'),
);

export {
  selectEntity,
  makeSelectEntityData,
  makeDisplayColorPicker,
  makeSelectTouched,
};
