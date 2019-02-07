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
  updateSettingSuccess,
  updateSettingError,
  changeLocale,
} from '../App/actions';

import {
  LOAD_SETTINGS, UPDATE_SETTINGS, UPDATE_SETTING
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
    yield put(changeLocale(settings.uiLanguage));
  } catch (err) {
    yield put(updateSettingsError(err));
  }
}

export function* putSetting(payload) {
  const { api, setting, value } = payload;
  try {
    const response = yield call(api.settings.putSettingsName, { name: setting, body: value });
    yield put(updateSettingSuccess(response.obj));
    if (setting === 'uiLanguage'){
      yield put(changeLocale(value));
    }
  } catch (err) {
    yield put(updateSettingError(err));
  }
}


export default function* rootSaga() {
  yield takeLatest(LOAD_SETTINGS, getSettings);
  yield takeLatest(UPDATE_SETTINGS, putSettings);
  yield takeLatest(UPDATE_SETTING, putSetting);
};