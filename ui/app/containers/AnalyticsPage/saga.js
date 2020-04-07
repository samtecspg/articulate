import { call, put, select, takeLatest } from 'redux-saga/effects';
import {
  ROUTE_DOCUMENT,
} from '../../../common/constants';
import { toAPIPath } from '../../utils/locationResolver';

import {
  loadAgentStatsError,
  loadAgentStatsSuccess
} from '../App/actions';

import {
  LOAD_AGENT_STATS
} from '../App/constants';

export function* getAgentStats(payload) {
  const { api, filters } = payload;
  try {
    for (var i = 0; i < filters.length; i++) {
      const response = yield call(
        api.post,
        toAPIPath([ROUTE_DOCUMENT, 'search']),
        { ...filters[i].filter },
      );
      yield put(
        loadAgentStatsSuccess({
          stats: response,
          statsName: filters[i].filterName
        }),
      );
    }
  } catch (err) {
    yield put(loadAgentStatsError(err));
  }
}

export default function* rootSaga() {
  yield takeLatest(LOAD_AGENT_STATS, getAgentStats);
}