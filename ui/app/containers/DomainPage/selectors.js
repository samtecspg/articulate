import { createSelector } from 'reselect';

const selectDomain = (state) => state.domain;

const makeSelectDomainData = () => createSelector(
  selectDomain,
  (domainState) => domainState.domainData,
);

export {
  selectDomain,
  makeSelectDomainData,
};
