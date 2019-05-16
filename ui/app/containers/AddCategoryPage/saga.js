import { push } from 'react-router-redux';
import {
  call,
  put,
  takeLatest,
  select
} from 'redux-saga/effects';

import {
  ROUTE_CATEGORY, ROUTE_AGENT, ROUTE_IMPORT
} from '../../../common/constants';
import { toAPIPath } from '../../utils/locationResolver';

import {
  loadPrebuiltCategoriesError,
  loadPrebuiltCategoriesSuccess
} from '../App/actions';

import {
  LOAD_PREBUILT_CATEGORIES, IMPORT_CATEGORY,
} from '../App/constants';
import { makeSelectPrebuiltCategories, makeSelectAgent } from '../App/selectors';

export function* getPrebuiltCategories(payload) {
  const { api } = payload;
  try {
    const prebuiltCategories = yield call(api.get, toAPIPath([ROUTE_CATEGORY]));
    yield put(loadPrebuiltCategoriesSuccess(prebuiltCategories));
  }
  catch (err) {
    yield put(loadPrebuiltCategoriesError(err));
  }
}

export function* postPrebuiltCategory(payload) {
  const { api, category } = payload;
  const agent = yield select(makeSelectAgent());
  const prebuiltCategories = yield select(makeSelectPrebuiltCategories());
  const data = prebuiltCategories[category].data;
  try {
    yield call(api.post, toAPIPath([ROUTE_AGENT, agent.id, ROUTE_CATEGORY, ROUTE_IMPORT]), data);
    yield put(push(`/agent/${agent.id}/dialogue?tab=sayings`));
  }
  catch (err) {
    yield put(loadPrebuiltCategoriesError(err));
  }
}


export default function* rootSaga() {
  yield takeLatest(LOAD_PREBUILT_CATEGORIES, getPrebuiltCategories);
  yield takeLatest(IMPORT_CATEGORY, postPrebuiltCategory);
};
