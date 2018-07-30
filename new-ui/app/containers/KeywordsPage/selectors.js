import { createSelector } from 'reselect';

/**
 * Direct selector to the keywordsPage state domain
 */
const selectKeywordsPageDomain = state => state.keywords;

/**
 * Other specific selectors
 */
const makeSelectKeywords = () => createSelector(
  selectKeywordsPageDomain,
  (keywordsPageState) => keywordsPageState.keywords
);

export {
  makeSelectKeywords
};
