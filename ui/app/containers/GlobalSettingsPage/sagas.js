import {
  LOCATION_CHANGE,
  push
} from 'react-router-redux';
import {
  call,
  cancel,
  put,
  select,
  take,
  takeLatest,
} from 'redux-saga/effects';
import {
  updateSettingsError,
  updateSettingsSuccess,
  loadSettingsError,
  loadSettingsSuccess,
} from '../App/actions';
import {
  UPDATE_SETTINGS,
  LOAD_SETTINGS,
} from '../App/constants';
import {
  makeSelectSettingsData
} from '../App/selectors';
import Immutable from 'seamless-immutable';


export function* putGlobalSettings(payload) {
  const { api } = payload;
  const globalSettingsData = yield select(makeSelectSettingsData());
  try {
    const response = yield call(api.settings.putSettings, { body: globalSettingsData });
    const globalSettings = response.obj;
    yield put(updateSettingsSuccess(globalSettings));
    yield put(push('/settings/global'));
  } catch (err) {
    const errObject = { err };
    if (errObject.err && errObject.err.message === 'Failed to fetch'){
      yield put(updateSettingsError({ message: 'Can\'t find a connection with the API. Please check your API is alive and configured properly.' }));
    }
    else {
      if (errObject.err.response.obj && errObject.err.response.obj.message){
        yield put(updateSettingsError({ message: errObject.err.response.obj.message }));
      }
      else {
        yield put(updateSettingsError({ message: 'Unknow API error' }));
      }
    }
  }
}

export function* updateGlobalSettings() {
  const watcher = yield takeLatest(UPDATE_SETTINGS, putGlobalSettings);
  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getGlobalSettings(payload) {
  const { api, id } = payload;
  try {
    const response = yield call(api.settings.getSettings);
    const settings = response.obj;
    yield put(loadSettingsSuccess(settings));
  } catch (err) {
    const errObject = { err };
    if (errObject.err && errObject.err.message === 'Failed to fetch'){
      yield put(loadSettingsError({ message: 'Can\'t find a connection with the API. Please check your API is alive and configured properly.' }));
    }
    else {
      if (errObject.err.response.obj && errObject.err.response.obj.message){
        yield put(loadSettingsError({ message: errObject.err.response.obj.message }));
      }
      else {
        yield put(loadSettingsError({ message: 'Unknow API error' }));
      }
    }
  }
}

export function* loadGlobalSettings() {
  const watcher = yield takeLatest(LOAD_SETTINGS, getGlobalSettings);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  updateGlobalSettings,
  loadGlobalSettings,
];
