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


export function* putDucklingSettings(payload) {
  const { api } = payload;
  const ducklingSettingsData = yield select(makeSelectSettingsData());
  try {
    const response = yield call(api.settings.putSettings, { body: ducklingSettingsData });
    const ducklingSettings = response.obj;
    yield put(updateSettingsSuccess(ducklingSettings));
    yield put(push('/settings/duckling'));
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

export function* updateDucklingSettings() {
  const watcher = yield takeLatest(UPDATE_SETTINGS, putDucklingSettings);
  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getDucklingSettings(payload) {
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

export function* loadDucklingSettings() {
  const watcher = yield takeLatest(LOAD_SETTINGS, getDucklingSettings);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  updateDucklingSettings,
  loadDucklingSettings,
];
