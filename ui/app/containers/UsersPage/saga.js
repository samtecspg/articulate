import { call, put, takeLatest } from 'redux-saga/effects';
import { ROUTE_USER } from '../../../common/constants';
import { toAPIPath } from '../../utils/locationResolver';
import { loadUsersSuccess, loadUsersError, deleteUserError } from '../App/actions';
import {
  LOAD_USERS, DELETE_USER, UPDATE_SETTING,
} from '../App/constants';
import { putSetting } from '../SettingsPage/saga';

export function* getUsers(payload) {
  const { api, page, pageSize } = payload;
  let skip = 0;
  let limit = -1;
  if (page) {
    skip = (page - 1) * pageSize;
    limit = pageSize;
  }
  try {
    const params = {
      skip,
      limit,
    };
    const response = yield call(
      api.get,
      toAPIPath([ROUTE_USER]),
      { params },
    );
    yield put(loadUsersSuccess(response));
  } catch (err) {
    yield put(loadUsersError(err));
  }
}

export function* deleteUser(payload) {
  const { api, id, page, pageSize } = payload;
  try {
    yield call(api.delete, toAPIPath([ROUTE_USER, id]));
    yield call(getUsers, { api, page, pageSize });
  }
  catch (err){
    yield put(deleteUserError(err));
  }
}

export default function* rootSaga() {
  yield takeLatest(LOAD_USERS, getUsers);
  yield takeLatest(DELETE_USER, deleteUser);
  yield takeLatest(UPDATE_SETTING, putSetting);
}
