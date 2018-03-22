import _ from 'lodash';
import Immutable from 'seamless-immutable';
import {
  LOCATION_CHANGE,
  push
} from 'react-router-redux';
import {
  call,
  cancel,
  put,
  select,
  take,
  takeLatest,
} from 'redux-saga/effects';
import {
  intentCreated,
  intentCreationError,
  scenarioCreated,
  scenarioCreationError,
  webhookCreationError,
  updateIntentError,
  updateIntentSuccess,
  updateScenarioError,
  updateScenarioSuccess,
  updateWebhookError,
} from '../App/actions';
import {
  CREATE_INTENT,
  LOAD_AGENT_DOMAINS,
  LOAD_AGENT_ENTITIES,
  LOAD_AGENTS,
  UPDATE_INTENT
} from '../App/constants';
import { getAgents } from '../App/sagas';
import { getAgentDomains } from '../DomainListPage/sagas';
import { getAgentEntities } from '../EntityListPage/sagas';
import {
  loadIntentError,
  loadIntentSuccess,
  loadScenarioError,
  loadScenarioSuccess,
  loadWebhookError,
  loadWebhookSuccess,
} from './actions';
import {
  LOAD_INTENT,
  LOAD_SCENARIO,
  LOAD_WEBHOOK,
} from './constants';
import {
  makeSelectIntentData,
  makeSelectOldIntentData,
  makeSelectScenarioData,
  makeSelectOldScenarioData,
  makeSelectWebhookData,
  makeSelectOldWebhookData,
} from './selectors';

function* postWebhook(payload) {
  const { api, id, intentData } = payload;
  let webhookData = yield select(makeSelectWebhookData());
  if (intentData){
    webhookData = webhookData.set('agent', intentData.agent);
    webhookData = webhookData.set('domain', intentData.domain);
    webhookData = webhookData.set('intent', intentData.intentName);
  }

  try {
    yield call(api.intent.postIntentIdWebhook, { id, body: webhookData });
  } catch ({ response }) {
    yield put(webhookCreationError({ message: response.obj.message }));
    throw response;
  }
}

function* postScenario(payload) {
  const { api, id, intentData } = payload;
  let scenarioData = yield select(makeSelectScenarioData());
  if (intentData){
    scenarioData = scenarioData.set('agent', intentData.agent);
    scenarioData = scenarioData.set('domain', intentData.domain);
    scenarioData = scenarioData.set('intent', intentData.intentName);
    scenarioData = scenarioData.set('scenarioName', intentData.intentName);
  }

  try {
    const response = yield call(api.intent.postIntentIdScenario, { id, body: scenarioData });
    const scenario = response.obj;
    yield put(scenarioCreated(scenario, scenario.id));
  } catch ({ response }) {
    yield put(scenarioCreationError({ message: response.obj.message }));
    throw response;
  }
}

export function* postIntent(payload) {
  const { api } = payload;
  let intentData = yield select(makeSelectIntentData());
  intentData = Immutable.asMutable(intentData, {deep: true});
  intentData.examples = intentData.examples.map((example) => {
    example.entities = example.entities.filter(entity => {
        return entity.entity.indexOf('sys.') === -1;
    });
    return example;
  });

  try {
    const response = yield call(api.intent.postIntent, { body: intentData });
    const intent = response.obj;
    yield put(intentCreated(intent, intent.id));
    yield call(postScenario, { api, id: intent.id});
    if (intent.useWebhook){
      yield call(postWebhook, { api, id: intent.id});
    }
    yield put(push('/intents'));
  } catch ({ response }) {
    yield put(intentCreationError({ message: response.obj.message }));
  }
}

export function* createIntent() {
  const watcher = yield takeLatest(CREATE_INTENT, postIntent);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* loadAgents() {
  const watcher = yield takeLatest(LOAD_AGENTS, getAgents);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* loadAgentDomains() {
  const watcher = yield takeLatest(LOAD_AGENT_DOMAINS, getAgentDomains);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* loadAgentEntities() {
  const watcher = yield takeLatest(LOAD_AGENT_ENTITIES, getAgentEntities);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

function* putWebhook(payload) {
  const { api, id } = payload;
  const webhookData = yield select(makeSelectWebhookData());
  const oldWebhookData = yield select(makeSelectOldWebhookData());
  try {
    if (!_.isEqual(webhookData, oldWebhookData)){
      const { agent, domain, intent, ...data } = webhookData;
      delete data.id;
      yield call(api.intent.putIntentIdWebhook, { id, body: data });
    }
  } catch ({ response }) {
    yield put(updateWebhookError({ message: response.obj.message }));
    throw response;
  }
}

function* deleteWebhook(payload) {
  const { api, id } = payload;
  try {
    yield call(api.intent.deleteIntentIdWebhook, { id });
  } catch ({ response }) {
    yield put(updateWebhookError({ message: response.obj.message }));
    throw response;
  }
}

function* putScenario(payload) {
  const { api, id } = payload;
  const scenarioData = yield select(makeSelectScenarioData());
  const oldScenarioData = yield select(makeSelectOldScenarioData());
  try {
    if (!_.isEqual(scenarioData, oldScenarioData)){
      const { agent, domain, intent, ...data } = scenarioData;
      delete data.id;
      yield call(api.intent.putIntentIdScenario, { id, body: data });
    }
    yield put(updateScenarioSuccess());
  } catch ({ response }) {
    yield put(updateScenarioError({ message: response.obj.message }));
    throw response;
  }
}

export function* putIntent(payload) {
  const { api } = payload;
  let intentData = yield select(makeSelectIntentData());
  intentData = Immutable.asMutable(intentData, {deep: true});
  intentData.examples = intentData.examples.map((example) => {
    example.entities = example.entities.filter(entity => {
        return entity.entity.indexOf('sys.') === -1;
    });
    return example;
  });
  const oldIntentData = yield select(makeSelectOldIntentData());
  const oldScenarioData = yield select(makeSelectOldScenarioData());
  try {
    if (!_.isEqual(intentData, oldIntentData)){
      const { id, agent, domain, ...data } = intentData;
      yield call(api.intent.putIntentId, { id, body: data });
    }
    yield put(updateIntentSuccess());
    if (oldScenarioData){
      yield call(putScenario, { api, id: intentData.id });
    }
    else {
      yield call(postScenario, { api, id: intentData.id, intentData });
    }
    if (oldIntentData.useWebhook){
      if (intentData.useWebhook){
        yield call(putWebhook, { api, id: intentData.id });
      }
      else {
        yield call(deleteWebhook, {api, id: intentData.id});
      }
    }
    else {
      if (intentData.useWebhook){
        yield call(postWebhook, { api, id: intentData.id, intentData });
      }
    }
    yield put(push('/intents'));
  } catch ({ response }) {
    yield put(updateIntentError({ message: response.obj.message }));
  }
}

export function* updateIntent() {
  const watcher = yield takeLatest(UPDATE_INTENT, putIntent);
  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getIntent(payload) {
  const { api, id } = payload;
  try {
    const responseIntent = yield call(api.intent.getIntentId, { id });
    const intent = responseIntent.obj;
    const responseAgent = yield call(api.agent.getAgentNameAgentname, { agentName: intent.agent });
    const agent = responseAgent.obj;
    yield call(getAgentDomains, { api, agentId: agent.id });
    yield call(getAgentEntities, { api, agentId: agent.id });
    yield put(loadIntentSuccess(intent));
  } catch ({ response }) {
    yield put(loadIntentError({ message: response.obj.message }));
  }
}

export function* loadIntent() {
  const watcher = yield takeLatest(LOAD_INTENT, getIntent);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getScenario(payload) {
  const { api, id } = payload;
  try {
    const responseScenario = yield call(api.intent.getIntentIdScenario, { id });
    const scenario = responseScenario.obj;
    yield put(loadScenarioSuccess(scenario));
  } catch ({ response }) {
    yield put(loadScenarioError({ message: response.obj.message }));
  }
}

export function* loadScenario() {
  const watcher = yield takeLatest(LOAD_SCENARIO, getScenario);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getWebhook(payload) {
  const { api, id } = payload;
  try {
    const response = yield call(api.intent.getIntentIdWebhook, { id });
    const webhook = response.obj;
    yield put(loadWebhookSuccess(webhook));
  } catch ({ response }) {
    yield put(loadWebhookError({ message: response.obj.message }));
  }
}

export function* loadWebhook() {
  const watcher = yield takeLatest(LOAD_WEBHOOK, getWebhook);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  createIntent,
  loadAgents,
  loadAgentDomains,
  loadAgentEntities,
  updateIntent,
  loadIntent,
  loadScenario,
  loadWebhook,
];
