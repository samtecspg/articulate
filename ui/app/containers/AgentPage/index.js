/**
 *
 * AgentPage
 *
 */

import { Grid, CircularProgress } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import MainTab from '../../components/MainTab';
import injectSaga from '../../utils/injectSaga';
import {
  addAgent,
  addAgentFallbackResponse,
  changeAgentData,
  changeAgentName,
  changeAgentSettingsData,
  changeCategoryClassifierThreshold,
  changePostFormatData,
  changeWebhookData,
  changeWebhookPayloadType,
  deleteAgentFallbackResponse,
  loadAgent,
  resetAgentData,
  resetStatusFlag,
  trainAgent,
  updateAgent,
  addNewHeaderAgentWebhook,
  deleteHeaderAgentWebhook,
  changeHeaderNameAgentWebhook,
  changeHeaderValueAgentWebhook,
  deleteAgent,
  loadActions,
  clearSayingToAction,
  addNewAgentParameter,
  deleteAgentParameter,
  changeAgentParameterName,
  changeAgentParameterValue,
  loadSettings,
  setAgentDefaults,
} from '../App/actions';
import {
  makeSelectAgent,
  makeSelectAgentPostFormat,
  makeSelectAgentSettings,
  makeSelectAgentWebhook,
  makeSelectSettings,
  makeSelectAgentTouched,
  makeSelectActions,
  makeSelectLoading,
  makeSelectSuccessAgent,
  makeSelectLocale,
} from '../App/selectors';

import Form from './Components/Form';
import saga from './saga';

/* eslint-disable react/prefer-stateless-function */
export class AgentPage extends React.PureComponent {

  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.initForm = this.initForm.bind(this);
  }

  state = {
    isNewAgent: this.props.match.params.id === 'create',
    settingsLoaded: false,
    formError: false,
    exitAfterSubmit: false,
    errorState: {
      agentName: false,
      fallbackAction: false,
      webhookUrl: false,
      rasaURL: false,
      ducklingURL: false,
      ducklingDimension: false,
      categoryClassifierPipeline: false,
      sayingClassifierPipeline: false,
      keywordClassifierPipeline: false,
      spacyPretrainedEntities: false,
      postFormatPayload: false,
      webhookPayload: false,
      tabs: [],
    },
  };

  initForm(){
    if (this.state.isNewAgent) {
      this.props.onResetData();
      if (!this.state.settingsLoaded) {
        this.props.onSetAgentDefaults();
        this.setState({
          settingsLoaded: true,
        });
      }
    } else {
      this.props.onResetData();
      this.props.onLoadActions(this.props.match.params.id);
      this.props.onLoadAgent(this.props.match.params.id);
    }
  }

  componentWillMount() {
    if (this.props.settings.defaultAgentLanguage){
      this.initForm();
    }
    else {
      this.props.onLoadSettings();
    }
  }

  componentDidUpdate(prevProps){
    if (!prevProps.settings.defaultAgentLanguage && this.props.settings.defaultAgentLanguage){
      this.initForm();
    }
    if (this.props.success) {
      if (this.state.isNewAgent) {
        this.setState({
          isNewAgent: false,
        });
      }
    }
  }

  submit(exit) {
    let errors = false;
    const newErrorState = {
      agentName: false,
      agentDescription: false,
      fallbackAction: false,
      webhookUrl: false,
      rasaURL: false,
      ducklingURL: false,
      ducklingDimension: false,
      categoryClassifierPipeline: false,
      sayingClassifierPipeline: false,
      keywordClassifierPipeline: false,
      spacyPretrainedEntities: false,
      tabs: [],
    };
    if (!this.props.agent.agentName || this.props.agent.agentName === '') {
      errors = true;
      newErrorState.agentName = true;
      newErrorState.tabs.push(0);
    } else {
      newErrorState.agentName = false;
    }
    if (!this.props.agent.description || this.props.agent.description === '') {
      errors = true;
      newErrorState.agentDescription = true;
      newErrorState.tabs.push(0);
    } else {
      newErrorState.agentDescription = false;
    }
    if (!this.state.isNewAgent && !this.props.agent.fallbackAction) {
      errors = true;
      newErrorState.fallbackAction = true;
      newErrorState.tabs.push(0);
    } else {
      newErrorState.fallbackAction = false;
    }
    if (this.props.agent.useWebhook && (!this.props.webhook.webhookUrl || this.props.webhook.webhookUrl === '')) {
      errors = true;
      newErrorState.webhookUrl = true;
      newErrorState.tabs.push(1);
    } else {
      newErrorState.webhookUrl = false;
    }
    if (!this.props.agentSettings.rasaURL || this.props.agentSettings.rasaURL === '') {
      errors = true;
      newErrorState.rasaURL = true;
      newErrorState.tabs.push(1);
    } else {
      newErrorState.rasaURL = false;
    }
    if (!this.props.agentSettings.ducklingURL || this.props.agentSettings.ducklingURL === '') {
      errors = true;
      newErrorState.ducklingURL = true;
      newErrorState.tabs.push(1);
    } else {
      newErrorState.ducklingURL = false;
    }

    try {
      if (!Array.isArray(this.props.agentSettings.ducklingDimension)) {
        throw 'Duckling dimensions is not an array';
      }
      newErrorState.ducklingDimension = false;
    } catch (e) {
      errors = true;
      newErrorState.tabs.push(1);
      newErrorState.ducklingDimension = true;
    }

    try {
      if (!Array.isArray(this.props.agentSettings.categoryClassifierPipeline)) {
        throw 'Category classifier pipeline is not an array';
      }
      newErrorState.categoryClassifierPipeline = false;
    } catch (e) {
      errors = true;
      newErrorState.tabs.push(1);
      newErrorState.categoryClassifierPipeline = true;
    }

    try {
      if (!Array.isArray(this.props.agentSettings.sayingClassifierPipeline)) {
        throw 'Saying classifier pipeline is not an array';
      }
      newErrorState.sayingClassifierPipeline = false;
    } catch (e) {
      errors = true;
      newErrorState.tabs.push(1);
      newErrorState.sayingClassifierPipeline = true;
    }

    try {
      if (!Array.isArray(this.props.agentSettings.keywordClassifierPipeline)) {
        throw 'Keyword classifier pipeline is not an array';
      }
      newErrorState.keywordClassifierPipeline = false;
    } catch (e) {
      errors = true;
      newErrorState.tabs.push(1);
      newErrorState.keywordClassifierPipeline = true;
    }

    try {
      if (!Array.isArray(this.props.agentSettings.spacyPretrainedEntities)) {
        throw 'Spacy pretrained entities is not an array';
      }
      newErrorState.spacyPretrainedEntities = false;
    } catch (e) {
      errors = true;
      newErrorState.tabs.push(1);
      newErrorState.spacyPretrainedEntities = true;
    }

    try {
      if (this.props.agent.usePostFormat && this.props.postFormat.postFormatPayload === '') {
        throw 'Response payload is not an object';
      }
      newErrorState.postFormatPayload = false;
    } catch (e) {
      errors = true;
      newErrorState.tabs.push(1);
      newErrorState.postFormatPayload = true;
    }

    try {
      if (this.props.agent.useWebhook && this.props.webhook.webhookPayloadType !== 'None' && this.props.webhook.webhookPayload === '') {
        throw 'Webhook payload is not an object';
      }
      newErrorState.webhookPayload = false;
    } catch (e) {
      errors = true;
      newErrorState.tabs.push(1);
      newErrorState.webhookPayload = true;
    }

    if (!errors) {
      this.setState({
        formError: false,
        exitAfterSubmit: exit,
        errorState: {...newErrorState},
      });
      if (this.state.isNewAgent) {
        this.props.onAddNewAgent();
      } else {
        this.props.onEditAgent();
      }
    } else {
      this.setState({
        formError: true,
        errorState: { ...newErrorState },
      });
    }
  }

  render() {
    return (
      this.props.settings.defaultAgentLanguage ?
      <Grid container>
        <MainTab
          locale={this.props.locale}
          touched={this.props.touched}
          loading={this.props.loading}
          success={this.props.success}
          onSaveAndExit={() => { this.submit(true) }}
          agentName={this.props.agent.agentName}
          newAgent={this.state.isNewAgent}
          formError={this.state.formError}
          onFinishAction={this.submit}
          onTrain={this.props.onTrain}
          agentStatus={this.props.agent.status}
          lastTraining={this.props.agent.lastTraining}
          enableTabs={!this.state.isNewAgent}
          selectedTab="agents"
          agentForm={
            <Form
              agentNameErrorState={this.state.errorState.agentName}
              errorState={this.state.errorState}
              agent={this.props.agent}
              webhook={this.props.webhook}
              postFormat={this.props.postFormat}
              settings={this.props.settings}
              agentSettings={this.props.agentSettings}
              onChangeAgentData={this.props.onChangeAgentData}
              onChangeAgentName={this.props.onChangeAgentName}
              onChangeWebhookData={this.props.onChangeWebhookData}
              onChangeWebhookPayloadType={this.props.onChangeWebhookPayloadType}
              onAddNewHeader={this.props.onAddNewHeader}
              onDeleteHeader={this.props.onDeleteHeader}
              onChangeHeaderName={this.props.onChangeHeaderName}
              onChangeHeaderValue={this.props.onChangeHeaderValue}
              onChangePostFormatData={this.props.onChangePostFormatData}
              onChangeAgentSettingsData={this.props.onChangeAgentSettingsData}
              onChangeCategoryClassifierThreshold={this.props.onChangeCategoryClassifierThreshold}
              onAddFallbackResponse={this.props.onAddFallbackResponse}
              onDeleteFallbackResponse={this.props.onDeleteFallbackResponse}
              onDelete={this.props.onDelete.bind(null, this.props.agent.id)}
              newAgent={this.state.isNewAgent}
              agentActions={this.props.agentActions}
              onGoToUrl={this.props.onGoToUrl}
              defaultaFallbackActionName={this.props.settings.defaultaFallbackActionName}
              onAddNewParameter={this.props.onAddNewParameter}
              onDeleteParameter={this.props.onDeleteParameter}
              onChangeParameterName={this.props.onChangeParameterName}
              onChangeParameterValue={this.props.onChangeParameterValue}
            />
          }
          dialogueForm={Link}
          dialogueURL={`/agent/${this.props.agent.id}/dialogue`}
          reviewURL={`/agent/${this.props.agent.id}/review`}
          reviewForm={Link}
        />
      </Grid> : 
      <CircularProgress style={{position: 'absolute', top: '40%', left: '49%'}}/>
    );
  }
}

AgentPage.propTypes = {
  agent: PropTypes.object,
  webhook: PropTypes.object,
  postFormat: PropTypes.object,
  settings: PropTypes.object,
  agentSettings: PropTypes.object,
  onLoadAgent: PropTypes.func,
  onLoadActions: PropTypes.func,
  onChangeAgentData: PropTypes.func,
  onChangeAgentName: PropTypes.func,
  onChangeWebhookData: PropTypes.func,
  onChangeWebhookPayloadType: PropTypes.func,
  onAddNewHeader: PropTypes.func,
  onDeleteHeader: PropTypes.func,
  onChangeHeaderName: PropTypes.func,
  onChangeHeaderValue: PropTypes.func,
  onChangePostFormatData: PropTypes.func,
  onChangeCategoryClassifierThreshold: PropTypes.func,
  onChangeAgentSettingsData: PropTypes.func,
  onAddFallbackResponse: PropTypes.func,
  onDeleteFallbackResponse: PropTypes.func,
  onAddNewAgent: PropTypes.func,
  onEditAgent: PropTypes.func,
  onSuccess: PropTypes.func,
  onTrain: PropTypes.func,
  onDelete: PropTypes.func,
  agentActions: PropTypes.array,
  onGoToUrl: PropTypes.func,
  onAddNewParameter: PropTypes.func,
  onDeleteParameter: PropTypes.func,
  onChangeParameterName: PropTypes.func,
  onChangeParameterValue: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  agent: makeSelectAgent(),
  webhook: makeSelectAgentWebhook(),
  postFormat: makeSelectAgentPostFormat(),
  agentSettings: makeSelectAgentSettings(),
  settings: makeSelectSettings(),
  agentActions: makeSelectActions(),
  loading: makeSelectLoading(),
  success: makeSelectSuccessAgent(),
  touched: makeSelectAgentTouched(),
  locale: makeSelectLocale(),
});

function mapDispatchToProps(dispatch) {
  return {
    onResetData: () => {
      dispatch(resetAgentData());
    },
    onLoadAgent: (agentId) => {
      dispatch(loadAgent(agentId));
    },
    onChangeAgentData: (field, value) => {
      dispatch(changeAgentData({ field, value }));
    },
    onChangeAgentName: (field, value) => {
      dispatch(changeAgentName({ field, value }));
    },
    onChangeWebhookData: (field, value) => {
      dispatch(changeWebhookData({ field, value }));
    },
    onChangeWebhookPayloadType: (field, value) => {
      dispatch(changeWebhookPayloadType({ field, value }));
    },
    onAddNewHeader: (payload) => {
      dispatch(addNewHeaderAgentWebhook(payload));
    },
    onDeleteHeader: (headerIndex) => {
      dispatch(deleteHeaderAgentWebhook(headerIndex));
    },
    onChangeHeaderName: (headerIndex, value) => {
      dispatch(changeHeaderNameAgentWebhook(headerIndex, value));
    },
    onChangeHeaderValue: (headerIndex, value) => {
      dispatch(changeHeaderValueAgentWebhook(headerIndex, value));
    },
    onChangePostFormatData: (field, value) => {
      dispatch(changePostFormatData({ field, value }));
    },
    onChangeAgentSettingsData: (field, value) => {
      dispatch(changeAgentSettingsData({ field, value }));
    },
    onChangeCategoryClassifierThreshold: (value) => {
      dispatch(changeCategoryClassifierThreshold(value));
    },
    onAddFallbackResponse: (newFallback) => {
      dispatch(addAgentFallbackResponse(newFallback));
    },
    onDeleteFallbackResponse: (fallbackIndex) => {
      dispatch(deleteAgentFallbackResponse(fallbackIndex));
    },
    onAddNewAgent: () => {
      dispatch(addAgent());
    },
    onSuccess: (url) => {
      dispatch(resetStatusFlag());
      dispatch(push(url));
    },
    onEditAgent: () => {
      dispatch(updateAgent());
    },
    onTrain: () => {
      dispatch(trainAgent());
    },
    onDelete: (id) => {
      dispatch(deleteAgent(id));
    },
    onLoadActions: (agentId) => {
      dispatch(loadActions(agentId));
    },
    onGoToUrl: (url) => {
      dispatch(clearSayingToAction());
      dispatch(push(`${url}?ref=agent`));
    },
    onAddNewParameter: (payload) => {
      dispatch(addNewAgentParameter(payload));
    },
    onDeleteParameter: (parameterName) => {
      dispatch(deleteAgentParameter(parameterName));
    },
    onChangeParameterName: (oldParameterName, newParameterName) => {
      dispatch(changeAgentParameterName(oldParameterName, newParameterName));
    },
    onChangeParameterValue: (parameterName, value) => {
      dispatch(changeAgentParameterValue(parameterName, value));
    },
    onLoadSettings: () => {
      dispatch(loadSettings());
    },
    onSetAgentDefaults: () => {
      dispatch(setAgentDefaults());
    }
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga({ key: 'agent', saga });

export default compose(
  withSaga,
  withConnect,
)(AgentPage);
