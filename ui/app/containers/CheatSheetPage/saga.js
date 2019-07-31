import { takeLatest, call, put } from 'redux-saga/effects';

import { getAgent } from '../App/saga';
import { LOAD_AGENT, LOAD_STARRED_SAYINGS } from '../App/constants';
import { loadStarredSayingsSuccess, loadStarredSayingsError } from '../App/actions';
import { toAPIPath } from '../../utils/locationResolver';
import { ROUTE_AGENT, ROUTE_SAYING } from '../../../common/constants';

export function* getStarredSayings(payload) {
  const { api, agentId, filter } = payload;
  const finalFilter = {
    starred: true
  }
  try {
    const params = {
      field: 'id',
      direction: 'DESC',
      loadCategoryId: true,
      filter: JSON.stringify(finalFilter)
    };
    const response = yield call(
      api.get,
      toAPIPath([ROUTE_AGENT, agentId, ROUTE_SAYING]),
      { params },
    );
    yield put(loadStarredSayingsSuccess(response.data.filter((saying) => { if (filter && filter.userSays){ return saying.starred && saying.userSays.toLowerCase().indexOf(filter.userSays) !== -1 } return saying.starred })));
  } catch (err) {
    yield put(loadStarredSayingsError(err));
  }
}

export default function* rootSaga() {
  yield takeLatest(LOAD_AGENT, getAgent);
  yield takeLatest(LOAD_STARRED_SAYINGS, getStarredSayings);
}
