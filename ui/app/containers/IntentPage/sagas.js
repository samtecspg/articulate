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
  makeSelectScenarioData,
  makeSelectWebhookData,
} from './selectors';

function* postWebhook(payload) {
  const { api, id } = payload;
  const webhookData = yield select(makeSelectWebhookData());

  try {
    yield call(api.intent.postIntentIdWebhook, { id, body: webhookData });
  } catch ({ response }) {
    yield put(webhookCreationError({ message: response.obj.message }));
    throw response;
  }
}

function* postScenario(payload) {
  const { api, id } = payload;
  const scenarioData = yield select(makeSelectScenarioData());

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
  const intentData = yield select(makeSelectIntentData());

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
  delete webhookData.id;
  delete webhookData.agent;
  delete scenarioData.domain;
  delete scenarioData.intent;
  try {
    const response = yield call(api.agent.putAgentIdWebhook, { id, body: webhookData });
    const webhook = response.obj;
  } catch ({ response }) {
    yield put(updateWebhookError({ message: response.obj.message }));
    throw response;
  }
}


function* putScenario(payload) {
  const { api, id, name } = payload;
  const scenarioData = yield select(makeSelectScenarioData());
  delete scenarioData.id;
  delete scenarioData.agent;
  delete scenarioData.domain;
  delete scenarioData.intent;
  try {
    const response = yield call(api.intent.putIntentIdScenario, { id, body: scenarioData });
    const scenario = response.obj;
    yield put(updateScenarioSuccess(scenario));
  } catch ({ response }) {
    yield put(updateScenarioError({ message: response.obj.message }));
    throw response;
  }
}

export function* putIntent(payload) {
  const { api } = payload;
  const intentData = yield select(makeSelectIntentData());
  const { id, ...data } = intentData;
  delete data.agent;
  delete data.domain;
  data.examples = data.examples.map((example) => {
    if (example.entities === '') {
      example.entities = [];
    }
    return example;
  });
  try {
    const response = yield call(api.intent.putIntentId, { id, body: data });
    const intent = response.obj;
    yield put(updateIntentSuccess(intent));
    yield call(putScenario, { api, id: intent.id, name: intent.intentName });
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
