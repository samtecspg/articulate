import { createSelector } from 'reselect';

/**
 * Direct selector to the keywordsPage state domain
 */
const selectKeywordsEditPageDomain = state => state.keywordsEdit;

/**
 * Other specific selectors
 */
const makeSelectKeyword = () => createSelector(
  selectKeywordsEditPageDomain,
  (keywordsPageState) => keywordsPageState.keyword
);

export {
  makeSelectKeyword
};
