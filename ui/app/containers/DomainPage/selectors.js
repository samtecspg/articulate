import { createSelector } from 'reselect';

const selectDomain = (state) => state.get('domain');

const makeSelectDomainData = () => createSelector(
  selectDomain,
  (domainState) => domainState.get('domainData').toJS(),
);

export {
  selectDomain,
  makeSelectDomainData,
};
