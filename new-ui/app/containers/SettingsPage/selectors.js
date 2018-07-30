import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the settingsPage state domain
 */

const selectSettingsPageDomain = state => state.settingsPage;

/**
 * Other specific selectors
 */

/**
 * Default selector used by SettingsPage
 */

const makeSelectSettingsPage = () =>
  createSelector(selectSettingsPageDomain, substate => substate);

export default makeSelectSettingsPage;
export { selectSettingsPageDomain };
