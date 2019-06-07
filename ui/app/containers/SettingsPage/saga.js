import { call, put, select, takeLatest } from 'redux-saga/effects';
import { ROUTE_BULK, ROUTE_SETTINGS } from '../../../common/constants';
import { toAPIPath } from '../../utils/locationResolver';
import {
  changeLocale,
  loadSettingsError,
  loadSettingsSuccess,
  updateSettingError,
  updateSettingsError,
  updateSettingsSuccess,
  updateSettingSuccess,
} from '../App/actions';
import {
  LOAD_SETTINGS,
  UPDATE_SETTING,
  UPDATE_SETTINGS,
} from '../App/constants';
import { makeSelectSettings } from '../App/selectors';

export function* getSettings(payload) {
  const { api } = payload;
  try {
    const response = yield call(api.get, toAPIPath([ROUTE_SETTINGS]));
    yield put(loadSettingsSuccess(response));
  } catch (err) {
    yield put(loadSettingsError(err));
  }
}

export function* putSettings(payload) {
  const settings = yield select(makeSelectSettings());
  const { api } = payload;
  try {
    const response = yield call(
      api.put,
      toAPIPath([ROUTE_SETTINGS, ROUTE_BULK]),
      settings,
    );
    yield put(updateSettingsSuccess(response));
    yield put(changeLocale(settings.uiLanguage));
  } catch (err) {
    yield put(updateSettingsError(err));
  }
}

export function* putSetting(payload) {
  const { api, setting, value } = payload;
  try {
    const response = yield call(
      api.put,
      toAPIPath([ROUTE_SETTINGS, setting]),
      value,
    );
    yield put(updateSettingSuccess(response));
    if (setting === 'uiLanguage') {
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
}
