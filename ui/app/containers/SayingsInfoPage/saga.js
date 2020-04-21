import { takeLatest, call, put } from 'redux-saga/effects';

import { getAgent } from '../App/saga';
import { LOAD_AGENT, LOAD_STARRED_SAYING, LOAD_STARRED_SAYINGS, LOAD_CATEGORY } from '../App/constants';
import { loadStarredSayingSuccess, loadStarredSayingError, loadStarredSayingsError, loadStarredSayingsSuccess } from '../App/actions';
import { toAPIPath } from '../../utils/locationResolver';
import { ROUTE_AGENT, ROUTE_SAYING, ROUTE_CATEGORY } from '../../../common/constants';
import { getCategory } from '../CategoryPage/saga';

export function* getStarredSaying(payload) {
  const { api, agentId, categoryId, sayingId } = payload;
  try {
    const response = yield call(
      api.get,
      toAPIPath([ROUTE_AGENT, agentId, ROUTE_CATEGORY, categoryId, ROUTE_SAYING, sayingId])
    );
    yield put(loadStarredSayingSuccess(response))
  } catch (err) {
    yield put(loadStarredSayingError(err));
  }
}

export function* getStarredSayingsOfCategory(payload) {
  const { api, agentId, filter } = payload;

  try {
    const params = {
      field: 'id',
      direction: 'DESC',
      filter: JSON.stringify({
        starred: true
      })
    };
    const response = yield call(
      api.get,
      toAPIPath([ROUTE_AGENT, agentId, ROUTE_CATEGORY, filter.category, ROUTE_SAYING]),
      { params },
    );
    yield put(loadStarredSayingsSuccess(response.data))
  } catch (err) {
    yield put(loadStarredSayingsError(err));
  }
}

export default function* rootSaga() {
  yield takeLatest(LOAD_AGENT, getAgent);
  yield takeLatest(LOAD_STARRED_SAYING, getStarredSaying);
  yield takeLatest(LOAD_STARRED_SAYINGS, getStarredSayingsOfCategory);
  yield takeLatest(LOAD_CATEGORY, getCategory);
}
