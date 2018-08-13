import {
    takeLatest,
    call,
    put,
    select,
} from 'redux-saga/effects';

import {
    loadKeywordsError,
    loadKeywordsSuccess,
    deleteKeywordError,
} from '../App/actions';

import {
    LOAD_KEYWORDS,
    DELETE_KEYWORD,
} from '../App/constants';

import {
    makeSelectAgent,
} from '../App/selectors';

export function* getKeywords(payload) {
    const agent = yield select(makeSelectAgent());
    const { api, filter, page } = payload;
    let start = 0;
    let limit = -1;
    if (page){
        start = (page - 1) * 5;
        limit = start + 5;
    }
    try {
        const response = yield call(api.agent.getAgentIdKeyword, {
            id: agent.id,
            filter,
            start,
            limit,
        });
        yield put(loadKeywordsSuccess(response.obj));
    } catch (err) {
        yield put(loadKeywordsError(err));
    }
}

export function* deleteKeyword(payload) {
    const { api, keywordId } = payload;
    try {
        yield call(api.keyword.deleteKeywordId, { id: keywordId });
        yield call(getKeywords, {
            api,
            filter: '',
            page: 1,
        });
    } catch (err) {
        yield put(deleteKeywordError(err));
    }
}

export default function* rootSaga() {
    yield takeLatest(LOAD_KEYWORDS, getKeywords);
    yield takeLatest(DELETE_KEYWORD, deleteKeyword);
};