import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { CREATE_INTENT, LOAD_AGENTS, LOAD_AGENT_DOMAINS, LOAD_AGENT_ENTITIES } from 'containers/App/constants';
import {
  intentCreated,
  intentCreationError,
  scenarioCreated,
  scenarioCreationError,
  agentsLoaded,
  agentsLoadingError,
  agentDomainsLoaded,
  agentDomainsLoadingError,
  agentEntitiesLoaded,
  agentEntitiesLoadingError } from 'containers/App/actions';

import request from 'utils/request';
import { makeSelectIntentData, makeSelectScenarioData } from 'containers/IntentPage/selectors';
import _ from 'lodash';

function* postScenario(intentName) {
  const scenarioData = yield select(makeSelectScenarioData());
  
  scenarioData.intent = intentName;

  const requestURL = `http://127.0.0.1:8000/scenario`;
  const requestOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(scenarioData),
  }

  try {
    const scenario = yield call(request, requestURL, requestOptions);
    yield put(scenarioCreated( scenario, scenario.id));
  } catch (error) {
    yield put(scenarioCreationError({
      message: 'An error ocurred creating the scenario',
      error
    }));
  }
}

export function* postIntent() {
  const intentData = yield select(makeSelectIntentData());

  const examples = _.map(intentData.examples, (example) => {
    console.log('example: ', example);
    example.entities.forEach(entity => {
      example.userSays = example.userSays.replace(entity.value, `{${entity.entity}}`);
    });
    return example.userSays;
  });

  intentData.examples = examples;

  console.log(intentData);

  const requestURL = `http://127.0.0.1:8000/intent`;
  const requestOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(intentData),
  }

  try {
    const intent = yield call(request, requestURL, requestOptions);
    yield call(postScenario, intent.intentName);
    yield put(intentCreated(intent, intent.id));
  } catch (error) {
    yield put(intentCreationError({
      message: 'An error ocurred creating the intent',
      error
    }));
  }
}

export function* createIntent() {
  const watcher = yield takeLatest(CREATE_INTENT, postIntent);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getAgents() {
  const requestURL = `http://127.0.0.1:8000/agent`;

  try {
    const agents = yield call(request, requestURL);
    yield put(agentsLoaded(agents));
  } catch (error) {
    yield put(agentsLoadingError({
      message: 'An error ocurred loading the list of available agents',
      error
    }));
  }
}

export function* loadAgents() {
  const watcher = yield takeLatest(LOAD_AGENTS, getAgents);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getAgentDomains(payload) {
  const agentId = payload.agentId.split('~')[0];
  const requestURL = `http://127.0.0.1:8000/agent/${agentId}/domain`;

  try {
    const agentDomains = yield call(request, requestURL);
    yield put(agentDomainsLoaded(agentDomains));
  } catch (error) {
    yield put(agentDomainsLoadingError({
      message: 'An error ocurred loading the list of available domains in this agent',
      error
    }));
  }
}

export function* loadAgentDomains() {
  const watcher = yield takeLatest(LOAD_AGENT_DOMAINS, getAgentDomains);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getAgentEntities(payload) {
  const agentId = payload.agentId.split('~')[0];
  const requestURL = `http://127.0.0.1:8000/agent/${agentId}/entity`;

  try {
    const agentEntities = yield call(request, requestURL);
    yield put(agentEntitiesLoaded(agentEntities));
  } catch (error) {
    yield put(agentEntitiesLoadingError({
      message: 'An error ocurred loading the list of available entities',
      error
    }));
  }
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
  loadAgentEntities
];
