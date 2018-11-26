import {
    takeLatest,
    call,
    put,
    select,
} from 'redux-saga/effects';

import {
    loadSettingsError,
    loadSettingsSuccess,
    updateSettingsError,
    updateSettingsSuccess,
} from '../App/actions';

import {
    LOAD_SETTINGS, UPDATE_SETTINGS,
} from '../App/constants';
import { makeSelectSettings } from '../App/selectors';


export function* getSettings(payload) {
    const { api } = payload;
    try {
        const response = yield call(api.settings.getSettings, {});
        yield put(loadSettingsSuccess(response.obj));
    } catch (err) {
        yield put(loadSettingsError(err));
    }
}

export function* putSettings(payload) {
  const settings = yield select(makeSelectSettings());
  const { api } = payload;
  try {
      const response = yield call(api.settings.putSettingsBulk, { body: settings });
      yield put(updateSettingsSuccess(response.obj));
  } catch (err) {
      yield put(updateSettingsError(err));
  }
}


export default function* rootSaga() {
  yield takeLatest(LOAD_SETTINGS, getSettings);
  yield takeLatest(UPDATE_SETTINGS, putSettings);
};