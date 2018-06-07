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
  updateGlobalSettingsError,
  updateGlobalSettingsSuccess,
  loadGlobalSettingsError,
  loadGlobalSettingsSuccess,
} from '../App/actions';
import {
  UPDATE_GLOBAL_SETTINGS,
  LOAD_GLOBAL_SETTINGS,
} from '../App/constants';
import {
  makeSelectGlobalSettingsData
} from '../App/selectors';
import Immutable from 'seamless-immutable';


export function* putGlobalSettings(payload) {
  const { api } = payload;
  const globalSettingsData = yield select(makeSelectGlobalSettingsData());
  try {
    const response = yield call(api.settings.putSettings, { body: globalSettingsData });
    const globalSettings = response.obj;
    yield put(updateGlobalSettingsSuccess(globalSettings));
    yield put(push('/settings/global'));
  } catch (err) {
    const errObject = { err };
    if (errObject.err && errObject.err.message === 'Failed to fetch'){
      yield put(updateGlobalSettingsError({ message: 'Can\'t find a connection with the API. Please check your API is alive and configured properly.' }));
    }
    else {
      if (errObject.err.response.obj && errObject.err.response.obj.message){
        yield put(updateGlobalSettingsError({ message: errObject.err.response.obj.message }));
      }
      else {
        yield put(updateGlobalSettingsError({ message: 'Unknow API error' }));
      }
    }
  }
}

export function* updateGlobalSettings() {
  const watcher = yield takeLatest(UPDATE_GLOBAL_SETTINGS, putGlobalSettings);
  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getGlobalSettings(payload) {
  const { api, id } = payload;
  try {
    const response = yield call(api.settings.getSettings);
    const settings = response.obj;
    yield put(loadGlobalSettingsSuccess(settings));
  } catch (err) {
    const errObject = { err };
    if (errObject.err && errObject.err.message === 'Failed to fetch'){
      yield put(loadGlobalSettingsError({ message: 'Can\'t find a connection with the API. Please check your API is alive and configured properly.' }));
    }
    else {
      if (errObject.err.response.obj && errObject.err.response.obj.message){
        yield put(loadGlobalSettingsError({ message: errObject.err.response.obj.message }));
      }
      else {
        yield put(loadGlobalSettingsError({ message: 'Unknow API error' }));
      }
    }
  }
}

export function* loadGlobalSettings() {
  const watcher = yield takeLatest(LOAD_GLOBAL_SETTINGS, getGlobalSettings);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  updateGlobalSettings,
  loadGlobalSettings,
];
