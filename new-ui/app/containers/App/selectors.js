import { createSelector } from 'reselect';

const selectRoute = state => state.route;

const makeSelectLocation = () => createSelector(
  selectRoute,
  routeState => routeState.location
);

export { makeSelectLocation };
