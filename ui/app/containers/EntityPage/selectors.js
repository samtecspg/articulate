import { createSelector } from 'reselect';

const selectEntity = (state) => state.entity;

const makeSelectEntityData = () => createSelector(
  selectEntity,
  (entityState) => entityState.entityData,
);

const makeDisplayColorPicker = () => createSelector(
  selectEntity,
  (displayColorPickerState) => displayColorPickerState.displayColorPicker,
);

const makeSelectTouched = () => createSelector(
  selectEntity,
  (entityState) => entityState.touched,
);

export {
  selectEntity,
  makeSelectEntityData,
  makeDisplayColorPicker,
  makeSelectTouched,
};
