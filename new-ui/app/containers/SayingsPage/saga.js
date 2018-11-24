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
    loadDomainsSuccess,
    loadDomainsError,
    loadFilteredDomainsSuccess,
    loadFilteredDomainsError,
} from '../App/actions';

import {
    LOAD_SAYINGS,
    LOAD_DOMAINS,
    LOAD_FILTERED_DOMAINS,
    LOAD_KEYWORDS,
    ADD_SAYING,
    DELETE_SAYING,
    TAG_KEYWORD,
    UNTAG_KEYWORD,
    ADD_ACTION_SAYING,
    DELETE_ACTION_SAYING,
    LOAD_ACTIONS,
} from '../App/constants';

import {
    makeSelectAgent, makeSelectSelectedDomain, makeSelectNewSayingActions,
} from '../App/selectors';

import { getKeywords } from '../KeywordsPage/saga';
import { getActions } from '../ActionPage/saga';

export function* getSayings(payload) {
    const agent = yield select(makeSelectAgent());
    const { api, filter, page, pageSize } = payload;
    const tempFilter = filter === '' ? undefined : filter;
    let skip = 0;
    let limit = -1;
    if (page){
        skip = (page - 1) * pageSize;
        limit = pageSize;
    }
    try {
        const response = yield call(api.agent.getAgentAgentidSaying, {
            agentId: agent.id,
            tempFilter,
            skip,
            limit,
            field: 'id',
            direction: 'DESC',
            loadDomainId: true,
        });
        yield put(loadSayingsSuccess({ sayings: response.obj.data, total: response.obj.totalCount }));
    } catch (err) {
        yield put(loadSayingsError(err));
    }
}

export function* postSaying(payload) {
    const agent = yield select(makeSelectAgent());
    const domain = yield select(makeSelectSelectedDomain());
    const actions = yield select(makeSelectNewSayingActions());
    const { api, value } = payload;
    try {
        const newSayingData = {
            userSays: value,
            keywords: [],
            actions,
        }
        yield call(api.agent.postAgentAgentidDomainDomainidSaying, {
            agentId: agent.id,
            domainId: domain, 
            body: newSayingData 
        });
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
    const agent = yield select(makeSelectAgent());
    const { api, sayingId, domainId} = payload;
    try {
        yield call(api.agent.deleteAgentAgentidDomainDomainidSayingSayingid, { 
            agentId: agent.id,
            domainId,
            sayingId 
        });
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
    const agent = yield select(makeSelectAgent());
    const { api, sayingId, saying, filter, page, pageSize } = payload;
    const domainId = saying.domain;
    delete saying.id;
    delete saying.agent;
    delete saying.domain;
    try {
        yield call(api.agent.putAgentAgentidDomainDomainidSayingSayingid, {
            agentId: agent.id,
            domainId, 
            sayingId, 
            body: saying });
        yield call(getSayings, {
            api,
            filter,
            page,
            pageSize 
        });
    } catch (err) {
        yield put(updateSayingError(err));
    }
}

export function* tagKeyword(payload) {
    const { api, saying, value, start, end, keywordId, keywordName, filter, page, pageSize } = payload;
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
        yield call(putSaying, { api, sayingId: saying.id, saying: mutableSaying, filter, page, pageSize });
    } catch (err) {
        yield put(updateSayingError(err));
    }
}

export function* untagKeyword(payload) {
    const { api, saying, start, end, filter, page, pageSize } = payload;
    const mutableSaying = Immutable.asMutable(saying, { deep: true} );
    mutableSaying.keywords = mutableSaying.keywords.filter((keyword) => {
        return keyword.start !== start || keyword.end !== end;
    });
    try {
        yield call(putSaying, { api, sayingId: saying.id, saying: mutableSaying, filter, page, pageSize });
    } catch (err) {
        yield put(updateSayingError(err));
    }
}

export function* addAction(payload) {
    const { api, saying, actionName, filter, page, pageSize } = payload;
    const mutableSaying = Immutable.asMutable(saying, { deep: true} );
    mutableSaying.actions.push(actionName);
    try {
        yield call(putSaying, { api, sayingId: saying.id, saying: mutableSaying, filter, page, pageSize });
    } catch (err) {
        yield put(updateSayingError(err));
    }
}

export function* deleteAction(payload) {
    const { api, saying, actionName, filter, page, pageSize } = payload;
    const mutableSaying = Immutable.asMutable(saying, { deep: true} );
    mutableSaying.actions = mutableSaying.actions.filter((action) => {

        return action !== actionName;
    });
    try {
        yield call(putSaying, { api, sayingId: saying.id, saying: mutableSaying, filter, page, pageSize });
    } catch (err) {
        yield put(updateSayingError(err));
    }
}

export function* getDomains(payload) {
    const agent = yield select(makeSelectAgent());
    const { api, filter } = payload;
    const skip = 0;
    const limit = -1;
    try {
        const response = yield call(api.agent.getAgentAgentidDomain, {
            agentId: agent.id,
            filter,
            skip,
            limit,
        });
        if (filter !== undefined){
            yield put(loadFilteredDomainsSuccess({ domains: response.obj.data }));
        }
        else {
            yield put(loadDomainsSuccess({domains: response.obj.data }));
            yield put(loadFilteredDomainsSuccess({domains: response.obj.data }));
        }
    } catch (err) {
        if (filter !== undefined){
            yield put(loadFilteredDomainsError(response.obj));
        }
        else {
            yield put(loadDomainsError(err));
        }
    }
}

export default function* rootSaga() {
    yield takeLatest(LOAD_SAYINGS, getSayings);
    yield takeLatest(ADD_SAYING, postSaying);
    yield takeLatest(DELETE_SAYING, deleteSaying);
    yield takeLatest(TAG_KEYWORD, tagKeyword);
    yield takeLatest(UNTAG_KEYWORD, untagKeyword);
    yield takeLatest(ADD_ACTION_SAYING, addAction);
    yield takeLatest(DELETE_ACTION_SAYING, deleteAction);
    yield takeLatest(LOAD_KEYWORDS, getKeywords);
    yield takeLatest(LOAD_ACTIONS, getActions);
    yield takeLatest(LOAD_DOMAINS, getDomains);
    yield takeLatest(LOAD_FILTERED_DOMAINS, getDomains);
};