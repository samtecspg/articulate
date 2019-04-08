import { push } from 'react-router-redux';
import {
  call,
  put,
  takeLatest,
} from 'redux-saga/effects';
import { ROUTE_USER } from '../../../common/constants';
import { toAPIPath } from '../../utils/locationResolver';
import {
  loginUserError,
  loginUserSuccess,
  signUpUserError,
  signUpUserSuccess,
} from '../App/actions';
import {
  LOGIN_USER,
  SIGN_UP_USER,
} from '../App/constants';

export function* loginUser(payload) {
  const { api, username, password } = payload;
  const data = {
    method: 'post',
    url: '/api/auth/basic',
    auth: { username, password },
  };
  try {
    const response = yield call(api, data);
    if (response.isValid) {
      yield put(loginUserSuccess(response));
      yield put(push('/'));
    }
    else {
      yield put(loginUserError('Invalid Username or Password'));
    }
  }
  catch (err) {
    yield put(loginUserError(err));

  }
}

export function* signUpUser(payload) {
  const { api, name, lastName, username, password } = payload;
  const data = {
    name,
    lastName,
    email: username,
    password,
    provider: 'basic',
  };
  try {
    const response = yield call(api.post, toAPIPath([ROUTE_USER]), data);
    yield put(signUpUserSuccess(response));
  }
  catch (err) {
    yield put(signUpUserError(err));

  }
}

export default function* rootSaga() {
  yield takeLatest(LOGIN_USER, loginUser);
  yield takeLatest(SIGN_UP_USER, signUpUser);
}
