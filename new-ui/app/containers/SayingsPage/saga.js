import Immutable from 'seamless-immutable';

import {
    takeLatest,
    call,
    put,
    select,
} from 'redux-saga/effects';

import {
    loadSayingsError,
    loadSayingsSuccess,
    addSayingError,
    deleteSayingError,
    updateSayingError,
} from '../App/actions';

import {
    LOAD_SAYINGS,
    ADD_SAYING,
    DELETE_SAYING,
    TAG_KEYWORD,
    UNTAG_KEYWORD,
    ADD_ACTION,
    DELETE_ACTION,
} from '../App/constants';

import {
    makeSelectAgent,
} from '../App/selectors';

export function* getSayings(payload) {
    const agent = yield select(makeSelectAgent());
    const { api, filter, page } = payload;
    let start = 0;
    let limit = -1;
    if (page){
        start = (page - 1) * 5;
        limit = start + 5;
    }
    try {
        const response = yield call(api.agent.getAgentIdSaying, {
            id: agent.id,
            filter,
            start,
            limit,
        });
        yield put(loadSayingsSuccess(response.obj));
    } catch (err) {
        yield put(loadSayingsError(err));
    }
}

export function* postSaying(payload) {
    const agent = yield select(makeSelectAgent());
    const { api, value } = payload;
    try {
        const newSayingData = {
            agent: agent.agentName,
            domain: 'Default',
            userSays: value,
            keywords: [],
            actions: [],
        }
        yield call(api.saying.postSaying, { body: newSayingData });
        yield call(getSayings, {
            api,
            filter: '',
            page: 1,
        });
    } catch (err) {
        yield put(addSayingError(err));
    }
}

export function* deleteSaying(payload) {
    const { api, sayingId } = payload;
    try {
        yield call(api.saying.deleteSayingId, { id: sayingId });
        yield call(getSayings, {
            api,
            filter: '',
            page: 1,
        });
    } catch (err) {
        yield put(deleteSayingError(err));
    }
}

export function* putSaying(payload) {
    const { api, sayingId, saying, filter, page } = payload;
    delete saying.id;
    delete saying.agent;
    delete saying.domain;
    try {
        yield call(api.saying.putSayingId, { id: sayingId, body: saying });
        yield call(getSayings, {
            api,
            filter: filter,
            page: page,
        });
    } catch (err) {
        console.log(err);
        yield put(updateSayingError(err));
    }
}

export function* tagKeyword(payload) {
    const { api, saying, taggedText, keywordId, keywordName, filter, page } = payload;
    const start = saying.userSays.indexOf(taggedText);
    const end = start + taggedText.length;
    const value = saying.userSays.substring(start, end);
    const mutableSaying = Immutable.asMutable(saying, { deep: true} );
    const keywordToAdd = {
        value,
        keyword: keywordName,
        start,
        end,
        keywordId: keywordId
    };
    if (keywordName.indexOf('sys.') !== -1) {
        keywordToAdd.extractor = 'system';
        keywordToAdd.keywordId = 0;
    }
    mutableSaying.keywords.push(keywordToAdd);
    try {
        yield call(putSaying, { api, sayingId: saying.id, saying: mutableSaying, filter, page });
        yield call(getSayings, {
            api,
            filter: filter,
            page: page,
        });
    } catch (err) {
        console.log(err);
        yield put(updateSayingError(err));
    }
}

export function* untagKeyword(payload) {
    const { api, saying, start, end, filter, page } = payload;
    const mutableSaying = Immutable.asMutable(saying, { deep: true} );
    mutableSaying.keywords = mutableSaying.keywords.filter((keyword) => {
        return keyword.start !== start || keyword.end !== end;
    });
    try {
        yield call(putSaying, { api, sayingId: saying.id, saying: mutableSaying, filter, page });
        yield call(getSayings, {
            api,
            filter: filter,
            page: page,
        });
    } catch (err) {
        console.log(err);
        yield put(updateSayingError(err));
    }
}

export function* addAction(payload) {
    const { api, saying, actionName, filter, page } = payload;
    const mutableSaying = Immutable.asMutable(saying, { deep: true} );
    mutableSaying.actions.push(actionName);
    try {
        yield call(putSaying, { api, sayingId: saying.id, saying: mutableSaying, filter, page });
        yield call(getSayings, {
            api,
            filter: filter,
            page: page,
        });
    } catch (err) {
        console.log(err);
        yield put(updateSayingError(err));
    }
}

export function* deleteAction(payload) {
    const { api, saying, actionName, filter, page } = payload;
    const mutableSaying = Immutable.asMutable(saying, { deep: true} );
    mutableSaying.actions = mutableSaying.actions.filter((action) => {

        return action !== actionName;
    });
    try {
        yield call(putSaying, { api, sayingId: saying.id, saying: mutableSaying, filter, page });
        yield call(getSayings, {
            api,
            filter: filter,
            page: page,
        });
    } catch (err) {
        console.log(err);
        yield put(updateSayingError(err));
    }
}

export default function* rootSaga() {
    yield takeLatest(LOAD_SAYINGS, getSayings);
    yield takeLatest(ADD_SAYING, postSaying);
    yield takeLatest(DELETE_SAYING, deleteSaying);
    yield takeLatest(TAG_KEYWORD, tagKeyword);
    yield takeLatest(UNTAG_KEYWORD, untagKeyword);
    yield takeLatest(ADD_ACTION, addAction);
    yield takeLatest(DELETE_ACTION, deleteAction);
};