import {
  takeLatest,
} from 'redux-saga/effects';

import {
  LOAD_SETTINGS,
} from '../App/constants';

import {
  getSettings,
} from '../SettingsPage/saga';

export default function* rootSaga() {
  yield takeLatest(LOAD_SETTINGS, getSettings);
};