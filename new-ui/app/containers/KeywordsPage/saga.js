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
    let skip = 0;
    let limit = 100; //TODO: enable in the API the usage of -1 to request all the keywords
    if (page){
        skip = (page - 1) * 5;
        limit = skip + 5;
    }
    try {
        const response = yield call(api.agent.getAgentAgentidKeyword, {
            agentId: agent.id,
            filter,
            skip,
            limit,
        });
        //TODO: Fix in the api the return of total sayings
        yield put(loadKeywordsSuccess({keywords: response.obj, total: 100}));
    } catch (err) {
        yield put(loadKeywordsError(err));
    }
}

export function* deleteKeyword(payload) {
    const agent = yield select(makeSelectAgent());
    const { api, keywordId } = payload;
    try {
        yield call(api.agent.deleteAgentAgentidKeywordKeywordid, { agentId: agent.id, keywordId });
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