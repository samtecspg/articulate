import { call, put, select, takeLatest } from 'redux-saga/effects';
import { ROUTE_ACCESS_CONTROL, ROUTE_BULK, ROUTE_GROUP, ROUTE_SETTINGS } from '../../../common/constants';
import { toAPIPath } from '../../utils/locationResolver';
import {
  changeLocale,
  loadAccessPolicyGroupsError,
  loadAccessPolicyGroupsSuccess,
  loadSettingsError,
  loadSettingsSuccess,
  updateAccessPolicyGroupError,
  updateAccessPolicyGroupSuccess,
  updateSettingError,
  updateSettingsError,
  updateSettingsSuccess,
  updateSettingSuccess,
  addAccessPolicyGroup,
  addAccessPolicyGroupError,
  addAccessPolicyGroupSuccess
} from '../App/actions';
import { LOAD_ACCESS_CONTROL, LOAD_SETTINGS, UPDATE_ACCESS_CONTROL, UPDATE_SETTING, UPDATE_SETTINGS } from '../App/constants';
import { makeSelectSettings } from '../App/selectors';

export function* getSettings(payload) {
  const { api } = payload;
  try {
    const response = yield call(api.get, toAPIPath([ROUTE_SETTINGS]));
    yield put(loadSettingsSuccess(response));
    yield put(changeLocale(response.uiLanguage));
  } catch (err) {
    yield put(loadSettingsError(err));
  }
}

export function* putSettings(payload) {
  const settings = yield select(makeSelectSettings());
  const { api } = payload;
  try {
    const response = yield call(api.put, toAPIPath([ROUTE_SETTINGS, ROUTE_BULK]), settings);
    yield put(updateSettingsSuccess(response));
    yield put(changeLocale(settings.uiLanguage));
  } catch (err) {
    yield put(updateSettingsError(err));
  }
}

export function* putSetting(payload) {
  const { api, setting, value } = payload;
  try {
    const response = yield call(api.put, toAPIPath([ROUTE_SETTINGS, setting]), value);
    yield put(updateSettingSuccess(response));
    if (setting === 'uiLanguage') {
      yield put(changeLocale(value));
    }
  } catch (err) {
    yield put(updateSettingError(err));
  }
}

export function* getAccessPolicyGroups(payload) {
  const { api } = payload;
  try {
    const response = yield call(api.get, toAPIPath([ROUTE_ACCESS_CONTROL]));
    yield put(loadAccessPolicyGroupsSuccess(response.data));
  } catch (err) {
    yield put(loadAccessPolicyGroupsError(err));
  }
}

export function* postAccessPolicyGroups(payload) {
  const { api, groupName, rules } = payload;
  try {
    const response = yield call(api.post, toAPIPath([ROUTE_ACCESS_CONTROL, ROUTE_GROUP, groupName]), rules);
    yield put(updateAccessPolicyGroupSuccess(response));
  } catch (err) {
    yield put(updateAccessPolicyGroupError(err));
  }
}

export function* postAccessPolicyGroup(payload) {
  const { api, groupName, rules } = payload;
  try {
    const response = yield call(api.post, toAPIPath([ROUTE_ACCESS_CONTROL, ROUTE_GROUP]), { groupName, rules });
    yield put(addAccessPolicyGroupSuccess(response.data));
    yield call(getAccessPolicyGroups, { api });
  } catch (err) {
    yield put(addAccessPolicyGroupError(err));
  }
}

export default function* rootSaga() {
  yield takeLatest(LOAD_SETTINGS, getSettings);
  yield takeLatest(LOAD_ACCESS_CONTROL, getAccessPolicyGroups);
  yield takeLatest(UPDATE_ACCESS_CONTROL, postAccessPolicyGroups);
  yield takeLatest(UPDATE_SETTINGS, putSettings);
  yield takeLatest(UPDATE_SETTING, putSetting);
}
