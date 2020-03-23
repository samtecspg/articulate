import _ from 'lodash';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import Immutable from 'seamless-immutable';
import {
  ROUTE_AGENT,
  ROUTE_SAYING,
} from '../../../common/constants';
import ExtractTokensFromString from '../../utils/extractTokensFromString';
import { toAPIPath } from '../../utils/locationResolver';
import { getActions } from '../ActionPage/saga';
import {
  loadSayingsError,
  loadSayingsSuccess,
} from '../App/actions';
import {
  LOAD_SAYINGS,
} from '../App/constants';
import {
  makeSelectAgent,
} from '../App/selectors';

export function* getSayings(payload) {
  const agent = yield select(makeSelectAgent());
  const { api, filter, page, pageSize, ignoreKeywords = false } = payload;
  const { remainingText, found } = ExtractTokensFromString({
    text: filter,
    tokens: ['category', 'actions', 'keywords', 'actionIssues', 'keywordIssues'],
  });
  const tempFilter =
    filter === ''
      ? undefined
      : JSON.stringify({
        category: found.category,
        actions: found.actions,
        keywords: found.keywords,
        actionIssues: found.actionIssues,
        keywordIssues: found.keywordIssues,
        query: remainingText,
      });
  let skip = 0;
  let limit = -1;
  if (page) {
    skip = (page - 1) * pageSize;
    limit = pageSize;
  }
  try {
    const params = {
      filter: tempFilter,
      skip,
      limit,
      field: 'id',
      direction: 'DESC',
      loadCategoryId: true,
    };
    if (!ignoreKeywords) {
      yield call(getKeywords, { api });
    }
    const response = yield call(
      api.get,
      toAPIPath([ROUTE_AGENT, agent.id, ROUTE_SAYING]),
      { params },
    );
    yield put(
      loadSayingsSuccess({
        sayings: response.data,
        total: response.totalCount,
      }),
    );
  } catch (err) {
    yield put(loadSayingsError(err));
  }
}

export default function* rootSaga() {
  yield takeLatest(LOAD_SAYINGS, getSayings);
}
