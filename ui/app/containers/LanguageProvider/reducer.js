/*
 *
 * LanguageProvider reducer
 *
 */

import Immutable from 'seamless-immutable';
import { DEFAULT_LOCALE, } from '../App/constants'; // eslint-disable-line
import { CHANGE_LOCALE, } from './constants';

const initialState = Immutable({
  locale: DEFAULT_LOCALE,
});

function languageProviderReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_LOCALE:
      return Immutable.setIn(state, ['locale'], action.locale);
    default:
      return state;
  }
}

export default languageProviderReducer;
