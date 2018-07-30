import { createSelector } from 'reselect';

/**
 * Direct selector to the SayingsPage state domain
 */
const selectSayingsPageDomain = (state) => state.sayings;

/**
 * Other specific selectors
 */
const makeSelectSayings = () => createSelector(
    selectSayingsPageDomain,
    (sayingsPageState) => sayingsPageState.sayings
);

export {
    selectSayingsPageDomain,
    makeSelectSayings,
};