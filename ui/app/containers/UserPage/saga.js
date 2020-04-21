import { call, put, takeLatest } from 'redux-saga/effects';
import { ROUTE_ACCESS_CONTROL, ROUTE_USER } from '../../../common/constants';
import { toAPIPath } from '../../utils/locationResolver';
import { loadAccessPolicyGroupsError, loadAccessPolicyGroupsSuccess, loadUserError, loadUserSuccess, updateUserError, updateUserSuccess } from '../App/actions';
import { LOAD_ACCESS_CONTROL, LOAD_USER, UPDATE_USER } from '../App/constants';

export function* getUser(payload) {
  const { api, id } = payload;
  try {
    const response = yield call(api.get, toAPIPath([ROUTE_USER, id]));
    yield put(loadUserSuccess({ user: response }));
  } catch (err) {
    yield put(loadUserError(err));
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

export function* putUser(payload) {
  const { api, id, data } = payload;
  try {
    const response = yield call(api.put, toAPIPath([ROUTE_USER, id]), data);
    yield put(updateUserSuccess({ user: response }));
  } catch (err) {
    yield put(updateUserError(err));
  }
}

export default function* rootSaga() {
  yield takeLatest(LOAD_USER, getUser);
  yield takeLatest(LOAD_ACCESS_CONTROL, getAccessPolicyGroups);
  yield takeLatest(UPDATE_USER, putUser);
}
