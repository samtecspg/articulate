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
  scenarioCreationError
} from '../../containers/App/actions';
import {
  CREATE_INTENT,
  LOAD_AGENT_DOMAINS,
  LOAD_AGENT_ENTITIES,
  LOAD_AGENTS,
} from '../../containers/App/constants';
import { getAgents } from '../../containers/App/sagas';
import { getAgentDomains } from '../../containers/DomainListPage/sagas';
import { getAgentEntities } from '../../containers/EntityListPage/sagas';
import {
  makeSelectIntentData,
  makeSelectScenarioData,
} from '../../containers/IntentPage/selectors';

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

// Bootstrap sagas
export default [
  createIntent,
  loadAgents,
  loadAgentDomains,
  loadAgentEntities,
];
