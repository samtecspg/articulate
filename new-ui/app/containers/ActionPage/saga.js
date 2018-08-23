import Immutable from 'seamless-immutable';

import {
  takeLatest,
  call,
  put,
  select,
} from 'redux-saga/effects';

import {
  loadActionError,
  loadActionSuccess,
  loadActionsError,
  loadActionsSuccess,
  addActionSuccess,
  addActionError,
  deleteActionSuccess,
  deleteActionError,
  updateActionSuccess,
  updateActionError,
} from '../App/actions';

import {
  LOAD_ACTIONS,
  LOAD_ACTION,
  LOAD_KEYWORDS,
  ADD_ACTION,
  UPDATE_ACTION,
  DELETE_ACTION,
} from '../App/constants';

import {
  makeSelectAgent,
  makeSelectAction,
  makeSelectCurrentAction,
  makeSelectActionWebhook,
  makeSelectActionPostFormat,
} from '../App/selectors';

import { getKeywords } from '../KeywordsPage/saga';

export function* getActions(payload) {
  const agent = yield select(makeSelectAgent());
  const { api } = payload;
  try {
      const response = yield call(api.agent.getAgentIdAction, {
          id: agent.id,
      });
      yield put(loadActionsSuccess(response.obj));
  } catch (err) {
      yield put(loadActionsError(err));
  }
}

export function* getAction(payload) {
  const { api, actionId } = payload;
  try {
    let response = yield call(api.action.getActionId, { id: actionId });
    const action = response.obj;
    let webhook, postFormat;
    if (action.useWebhook){
      response = yield call(api.action.getActionIdWebhook, { id: actionId });
      webhook = response.obj;
    }
    if (action.usePostFormat){
      response = yield call(api.action.getActionIdPostformat, { id: actionId });
      postFormat = response.obj;
    }
    yield put(loadActionSuccess({ action, webhook, postFormat }));
  } catch (err) {
    yield put(loadActionError(err));
  }
}

function* postActionWebhook(payload) {
  const actionWebhook = yield select(makeSelectActionWebhook());
  const agent = yield select(makeSelectAgent());
  actionWebhook.set('agent', agent.agentName);
  actionWebhook.set('domain', 'default');
  const { api, id } = payload;
  try {
      yield call(api.action.postActionIdWebhook, { id, body: actionWebhook });
  } catch (err) {
      yield put(addActionError(err));
  }
}

function* postActionPostFormat(payload) {
  const actionPostFormat = yield select(makeSelectActionPostFormat());
  const agent = yield select(makeSelectAgent());
  actionPostFormat.set('agent', agent.agentName);
  actionPostFormat.set('domain', 'default');
  const { api, id } = payload;
  try {
      yield call(api.action.postActionIdPostformat, { id, body: actionPostFormat });
  } catch (err) {
      yield put(addActionError(err));
  }
}

function* putActionWebhook(payload) {
  const actionWebhook = yield select(makeSelectActionWebhook());
  const mutableActionWebhook = Immutable.asMutable(actionWebhook);
  const { api, id } = payload;
  delete mutableActionWebhook.agent;
  delete mutableActionWebhook.domain;
  delete mutableActionWebhook.action;
  if (mutableActionWebhook.id){ //TODO: Check why webhook have an id
    delete mutableActionWebhook.id;
  }
  try {
      yield call(api.action.putActionIdWebhook, { id, body: mutableActionWebhook });
  } catch (err) {
      yield put(addActionError(err));
  }
}

function* putActionPostFormat(payload) {
  const actionPostFormat = yield select(makeSelectActionPostFormat());
  const mutablePostFormat = Immutable.asMutable(actionPostFormat);
  const { api, id } = payload;
  delete mutablePostFormat.agent;
  delete mutablePostFormat.domain;
  delete mutablePostFormat.action;
  if (mutablePostFormat.id){ //TODO: Check why post format have an id
    delete mutablePostFormat.id;
  }
  try {
      yield call(api.action.putActionIdPostformat, { id, body: mutablePostFormat });
  } catch (err) {
      yield put(addActionError(err));
  }
}

function* deleteActionWebhook(payload) {
  const { api, id } = payload;
  try {
      yield call(api.action.deleteActionIdWebhook, { id });
  } catch (err) {
      yield put(addActionError(err));
  }
}

function* deleteActionPostFormat(payload) {
  const { api, id } = payload;
  try {
      yield call(api.action.deleteActionIdPostformat, { id });
  } catch (err) {
      yield put(addActionError(err));
  }
}

export function* postAction(payload) {
  const action = yield select(makeSelectAction());
  const agent = yield select(makeSelectAgent());
  action.set('agent', agent.agentName);
  action.set('domain', 'default');
  const { api } = payload;
  try {
      const response = yield call(api.action.postAction, { body: action });
      if (action.useWebhook){
        yield call(postActionWebhook, { id: response.obj.id, api });
      }
      if (action.usePostFormat){
        yield call(postActionPostFormat, { id: response.obj.id, api });
      }
      yield put(addActionSuccess(response.obj));
  } catch (err) {
      yield put(addActionError(err));
  }
}

export function* putAction(payload) {
  const action = yield select(makeSelectAction());
  const currentAction = yield select(makeSelectCurrentAction());
  const mutableAction = Immutable.asMutable(action, { deep: true });
  const { api } = payload;
  delete mutableAction.id;
  delete mutableAction.agent;
  delete mutableAction.domain;
  try {
      const response = yield call(api.action.putActionId, { id: currentAction.id, body: mutableAction });
      if (!currentAction.useWebhook){
        if (action.useWebhook) {
          yield call(postActionWebhook, { id: currentAction.id, api });
        }
      }
      else {
        if (currentAction.useWebhook){
          if (!action.useWebhook){
            yield call(deleteActionWebhook, { id: currentAction.id, api });
          }
          else {
            yield call(putActionWebhook, { id: currentAction.id, api });
          }
        }
      }
      if (!currentAction.usePostFormat){
        if (action.usePostFormat) {
          yield call(postActionPostFormat, { id: currentAction.id, api });
        }
      }
      else {
        if (currentAction.usePostFormat){
          if (!action.usePostFormat){
            yield call(deleteActionPostFormat, { id: currentAction.id, api });
          }
          else {
            yield call(putActionPostFormat, { id: currentAction.id, api });
          }
        }
      }
      yield put(updateActionSuccess(response.obj));
  } catch (err) {
      yield put(updateActionError(err));
  }
}

export function* deleteAction(payload) {
  const action = yield select(makeSelectAction());
  const { api } = payload;
  try {
    yield call(api.action.deleteActionId, { id: action.id });
    yield put(deleteActionSuccess());
  } catch (err) {
      yield put(deleteActionError(err));
  }
}

export default function* rootSaga() {
  yield takeLatest(LOAD_ACTION, getAction);
  yield takeLatest(LOAD_ACTIONS, getActions);
  yield takeLatest(LOAD_KEYWORDS, getKeywords);
  yield takeLatest(ADD_ACTION, postAction);
  yield takeLatest(UPDATE_ACTION, putAction);
  yield takeLatest(DELETE_ACTION, deleteAction);
};