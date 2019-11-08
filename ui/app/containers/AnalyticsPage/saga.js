import { call, put, select, takeLatest } from 'redux-saga/effects';
import {
  ROUTE_AGENT,
  ROUTE_DOCUMENT,
} from '../../../common/constants';
import { toAPIPath } from '../../utils/locationResolver';

import {
  loadAgentDocumentsError,
  loadAgentDocumentsSuccess,
  loadAgentStatsError,
  loadAgentStatsSuccess
} from '../App/actions';

import {
  LOAD_ACTIONS,
  LOAD_AGENT_DOCUMENTS,
  LOAD_KEYWORDS,
  LOAD_AGENT_STATS
} from '../App/constants';

import { makeSelectAgent } from '../App/selectors';

import { getKeywords } from '../DialoguePage/saga';
import { getActions } from '../ActionPage/saga';

export function* getAgentDocument(payload) {
  const agent = yield select(makeSelectAgent());
  const { api, dateRange } = payload;
  let skip = 0;
  let limit = 10000; //MAX ALLOWED BY ElasticSearch
  try {
    const params = {
      skip,
      limit,
    };
    if (dateRange !== 'all') {
      params.dateRange = dateRange
    }
    const response = yield call(
      api.get,
      toAPIPath([ROUTE_AGENT, agent.id, ROUTE_DOCUMENT]),
      { params },
    );
    debugger;
    yield put(
      loadAgentDocumentsSuccess({
        documents: response.data,
        total: response.totalCount,
        analytics: true,
      }),
    );
  } catch (err) {
    yield put(loadAgentDocumentsError(err));
  }
}

export function* getAgentStats(payload) {
  const agent = yield select(makeSelectAgent());
  const { api, filters, dateRange } = payload;
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
  yield takeLatest(LOAD_KEYWORDS, getKeywords);
  yield takeLatest(LOAD_ACTIONS, getActions);
  yield takeLatest(LOAD_AGENT_DOCUMENTS, getAgentDocument);
  yield takeLatest(LOAD_AGENT_STATS, getAgentStats);
}