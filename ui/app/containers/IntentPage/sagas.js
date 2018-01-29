import _ from 'lodash';
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
  updateIntentError,
  updateIntentSuccess
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
  loadIntentSuccess
} from './actions';
import { LOAD_INTENT } from './constants';
import {
  makeSelectIntentData,
  makeSelectScenarioData,
} from './selectors';

function* postScenario(payload) {
  const { api, id, name } = payload;
  const scenarioData = yield select(makeSelectScenarioData());
  scenarioData.intent = name;
  if (!scenarioData.useWebhook) {
    delete scenarioData.webhookUrl;
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
  const intentData = yield select(makeSelectIntentData());

  const examples = _.map(intentData.examples, (example) => {
    example.entities.forEach(entity => {
      example.userSays = example.userSays.replace(entity.value, `{${entity.entity}}`);
    });
    return example.userSays;
  });

  intentData.examples = examples;

  try {
    const response = yield call(api.intent.postIntent, { body: intentData });
    const intent = response.obj;
    yield put(intentCreated(intent, intent.id));
    yield call(postScenario, { api, id: intent.id, name: intent.intentName });
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

export function* putIntent(payload) {
  const { api } = payload;
  const intentData = yield select(makeSelectIntentData());
  const { id, ...data } = intentData;
  data.examples = _.map(intentData.examples, (example) => {
    example.entities.forEach(entity => {
      example.userSays = example.userSays.replace(entity.value, `{${entity.entity}}`);
    });
    return example.userSays;
  });

  try {
    const response = yield call(api.intent.putIntentId, { id, body: data });
    const intent = response.obj;
    yield put(updateIntentSuccess(intent));
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

// Bootstrap sagas
export default [
  createIntent,
  loadAgents,
  loadAgentDomains,
  loadAgentEntities,
  updateIntent,
  loadIntent,
];
