/*
 *
 * SettingsPage reducer
 *
 */

import Immutable from 'seamless-immutable';
import { DEFAULT_ACTION } from './constants';

export const initialState = Immutable({});

function settingsPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    default:
      return state;
  }
}

export default settingsPageReducer;
