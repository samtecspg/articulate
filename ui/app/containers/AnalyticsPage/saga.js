import { call, put, select, takeLatest } from 'redux-saga/effects';
import {
  ROUTE_AGENT,
  ROUTE_DOCUMENT,
} from '../../../common/constants';
import { toAPIPath } from '../../utils/locationResolver';

import {
  loadAgentDocumentsError,
  loadAgentDocumentsSuccess,
} from '../App/actions';

import {
  LOAD_ACTIONS,
  LOAD_AGENT_DOCUMENTS,
  LOAD_KEYWORDS,
} from '../App/constants';

import { makeSelectAgent } from '../App/selectors';

import { getKeywords } from '../DialoguePage/saga';
import { getActions } from '../ActionPage/saga';

export function* getAgentDocument(payload) {
  const agent = yield select(makeSelectAgent());
  const { api } = payload;
  let skip = 0;
  let limit = 10000; //MAX ALLOWED BY ElasticSearch
  try {
    const params = {
      skip,
      limit
    };
    const response = yield call(
      api.get,
      toAPIPath([ROUTE_AGENT, agent.id, ROUTE_DOCUMENT]),
      { params },
    );
    yield put(
      loadAgentDocumentsSuccess({
        documents: response.data,
        total: response.totalCount,
      }),
    );
  } catch (err) {
    yield put(loadAgentDocumentsError(err));
  }
}

export default function* rootSaga() {
  yield takeLatest(LOAD_KEYWORDS, getKeywords);
  yield takeLatest(LOAD_ACTIONS, getActions);
  yield takeLatest(LOAD_AGENT_DOCUMENTS, getAgentDocument);
}
