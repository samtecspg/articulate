import Immutable from 'seamless-immutable';

import {
    takeLatest,
    call,
    put,
    select,
} from 'redux-saga/effects';

import {
  loadKeywordSuccess,
  loadKeywordError,
  createKeywordSuccess,
  createKeywordError,
  updateKeywordSuccess,
  updateKeywordError,
} from '../App/actions';

import {
    LOAD_KEYWORD,
    CREATE_KEYWORD,
    UPDATE_KEYWORD
} from '../App/constants';

import {
    makeSelectAgent, makeSelectKeyword,
} from '../App/selectors';

export function* getKeyword(payload) {
  const { api, id } = payload;
  try {
    const response = yield call(api.keyword.getKeywordId, {
        id
    });
    response.obj.regex = response.obj.regex ? response.obj.regex : '';
    yield put(loadKeywordSuccess(response.obj));
  } catch (err) {
      yield put(loadKeywordError(err));
  }
}

export function* postKeyword(payload) {
    const agent = yield select(makeSelectAgent());
    const keyword = yield select(makeSelectKeyword());
    const newKeyword = Immutable.asMutable(keyword, { deep: true });
    newKeyword.agent = agent.agentName;
    const { api } = payload;
    try {
        const response = yield call(api.keyword.postKeyword, { body: newKeyword });
        yield put(createKeywordSuccess(response.obj));
    } catch (err) {
        yield put(createKeywordError(err));
    }
}

export function* putKeyword(payload) {
    const keyword = yield select(makeSelectKeyword());
    const mutableKeyword = Immutable.asMutable(keyword, { deep: true });
    const keywordId = keyword.id;
    const { api } = payload;
    delete mutableKeyword.id;
    delete mutableKeyword.agent;
    try {
        const response = yield call(api.keyword.putKeywordId, { id: keywordId, body: mutableKeyword });
        yield put(updateKeywordSuccess(response.obj));
    } catch (err) {
        yield put(updateKeywordError(err));
    }
}

export default function* rootSaga() {
    yield takeLatest(LOAD_KEYWORD, getKeyword);
    yield takeLatest(CREATE_KEYWORD, postKeyword);
    yield takeLatest(UPDATE_KEYWORD, putKeyword);
};