/**
 *
 * AgentPage
 *
 */

import React from 'react';
import { push } from 'react-router-redux';
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import {
  makeSelectAgent,
  makeSelectAgentWebhook,
  makeSelectAgentPostFormat,
  makeSelectAgentSettings,
  makeSelectSettings,
  makeSelectSuccess,
} from '../App/selectors';
import saga from './saga';
import messages from './messages';

import { Grid } from '@material-ui/core';
import ContentHeader from 'components/ContentHeader';
import MainTab from 'components/MainTab';
import Form from './Components/Form';
import ActionButtons from './Components/ActionButtons';

import {
  resetAgentData,
  loadAgent,
  changeAgentData,
  changeAgentName,
  changeCategoryClassifierThreshold,
  addAgentFallbackResponse,
  deleteAgentFallbackResponse,
  changeWebhookData,
  changeWebhookPayloadType,
  changePostFormatData,
  changeAgentSettingsData,
  addAgent,
  resetStatusFlag,
  updateAgent,
  trainAgent,
} from '../App/actions';

/* eslint-disable react/prefer-stateless-function */
export class AgentPage extends React.PureComponent {

  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  componentDidUpdate() {
    if (this.props.success) {
      this.props.onSuccess(`/agent/${this.props.agent.id}/sayings`);
    }
  }

  componentWillUpdate() {
    if (this.state.isNewAgent && !this.state.settingsLoaded){
      this.props.onChangeAgentData('language', this.props.settings.defaultAgentLanguage);
      this.props.onChangeAgentData('timezone', this.props.settings.defaultTimezone);
      this.props.onChangeAgentData('fallbackResponses', this.props.settings.defaultAgentFallbackResponses);
      this.props.onChangeAgentSettingsData('rasaURL', this.props.settings.rasaURL);
      this.props.onChangeAgentSettingsData('categoryClassifierPipeline', this.props.settings.categoryClassifierPipeline);
      this.props.onChangeAgentSettingsData('sayingClassifierPipeline', this.props.settings.sayingClassifierPipeline);
      this.props.onChangeAgentSettingsData('keywordClassifierPipeline', this.props.settings.keywordClassifierPipeline);
      this.props.onChangeAgentSettingsData('spacyPretrainedEntities', this.props.settings.spacyPretrainedEntities);
      this.props.onChangeAgentSettingsData('ducklingURL', this.props.settings.ducklingURL);
      this.props.onChangeAgentSettingsData('ducklingDimension', this.props.settings.ducklingDimension);
      this.setState({
        settingsLoaded: true,
      });
    }
  }

  componentWillMount() {
    if(this.state.isNewAgent) {
      this.props.onResetData();
    }
    else {
      this.props.onLoadAgent(this.props.match.params.id);
    }
  }

  state = {
    isNewAgent: this.props.match.params.id === 'create',
    settingsLoaded: false,
    formError: false,
    errorState: {
      agentName: false,
      fallbackResponses: false,
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
    },
  };

  submit(){
    let errors = false;
    const newErrorState = {
      agentName: false,
      agentDescription: false,
      fallbackResponses: false,
      webhookUrl: false,
      rasaURL: false,
      ducklingURL: false,
      ducklingDimension: false,
      categoryClassifierPipeline: false,
      sayingClassifierPipeline: false,
      keywordClassifierPipeline: false,
      spacyPretrainedEntities: false,
    }
    if (!this.props.agent.agentName || this.props.agent.agentName === ''){
      errors = true;
      newErrorState.agentName = true;
    }
    else {
      newErrorState.agentName = false;
    }
    if (!this.props.agent.description || this.props.agent.description === ''){
      errors = true;
      newErrorState.agentDescription = true;
    }
    else {
      newErrorState.agentDescription = false;
    }
    if (!this.props.agent.fallbackResponses || this.props.agent.fallbackResponses.length === 0){
      errors = true;
      newErrorState.fallbackResponses = true;
    }
    else {
      newErrorState.fallbackResponses = false;
    }
    if (this.props.agent.useWebhook && (!this.props.webhook.webhookUrl || this.props.webhook.webhookUrl === '')){
      errors = true;
      newErrorState.webhookUrl = true;
    }
    else {
      newErrorState.webhookUrl = false;
    }
    if (!this.props.agentSettings.rasaURL || this.props.agentSettings.rasaURL === ''){
      errors = true;
      newErrorState.rasaURL = true;
    }
    else {
      newErrorState.rasaURL = false;
    }
    if (!this.props.agentSettings.ducklingURL || this.props.agentSettings.ducklingURL === ''){
      errors = true;
      newErrorState.ducklingURL = true;
    }
    else {
      newErrorState.ducklingURL = false;
    }

    try {
      if (!Array.isArray(this.props.agentSettings.ducklingDimension)){
        throw 'Duckling dimensiones is not an array';
      }
      newErrorState.ducklingDimension = false;
    } catch(e) {
      errors = true;
      newErrorState.ducklingDimension = true;
    }

    try {
      if (!Array.isArray(this.props.agentSettings.categoryClassifierPipeline)){
        throw 'Category classifier pipeline is not an array';
      }
      newErrorState.categoryClassifierPipeline = false;
    } catch(e) {
      errors = true;
      newErrorState.categoryClassifierPipeline = true;
    }

    try {
      if (!Array.isArray(this.props.agentSettings.sayingClassifierPipeline)){
        throw 'Saying classifier pipeline is not an array';
      }
      newErrorState.sayingClassifierPipeline = false;
    } catch(e) {
      errors = true;
      newErrorState.sayingClassifierPipeline = true;
    }

    try {
      if (!Array.isArray(this.props.agentSettings.keywordClassifierPipeline)){
        throw 'Keyword classifier pipeline is not an array';
      }
      newErrorState.keywordClassifierPipeline = false;
    } catch(e) {
      errors = true;
      newErrorState.keywordClassifierPipeline = true;
    }

    try {
      if (!Array.isArray(this.props.agentSettings.spacyPretrainedEntities)){
        throw 'Spacy pretrained entities is not an array';
      }
      newErrorState.spacyPretrainedEntities = false;
    } catch(e) {
      errors = true;
      newErrorState.spacyPretrainedEntities = true;
    }

    try {
      if (this.props.agent.usePostFormat && this.props.postFormat.postFormatPayload === ''){
        throw 'Response payload is not an object';
      }
      newErrorState.postFormatPayload = false;
    } catch(e) {
      errors = true;
      newErrorState.postFormatPayload = true;
    }

    try {
      if (this.props.agent.useWebhook && this.props.webhook.webhookPayloadType !== 'None' && this.props.webhook.webhookPayload === ''){
        throw 'Webhook payload is not an object';
      }
      newErrorState.webhookPayload = false;
    } catch(e) {
      errors = true;
      newErrorState.webhookPayload = true;
    }

    if (!errors){
      this.setState({
        formError: false,
      });
      if (this.state.isNewAgent){
        this.props.onAddNewAgent();
      }
      else {
        this.props.onEditAgent();
      };
    }
    else {
      this.setState({
        formError: true,
        errorState: {...newErrorState},
      });
    }
  }

  render() {
    return (
      <Grid container>
        <ContentHeader
          title={messages.title}
          subtitle={this.state.isNewAgent ? messages.createSubtitle : this.props.agent.agentName}
          inlineElement={
            <ActionButtons
              newAgent={this.state.isNewAgent}
              formError={this.state.formError}
              onFinishAction={this.submit}
              onTrain={this.props.onTrain}
              agentStatus={this.props.agent.status}
              lastTraining={this.props.agent.lastTraining}
            />
          }
        />
        <MainTab
          enableTabs={!this.state.isNewAgent}
          selectedTab={'agents'}
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
              onChangePostFormatData={this.props.onChangePostFormatData}
              onChangeAgentSettingsData={this.props.onChangeAgentSettingsData}
              onChangeCategoryClassifierThreshold={this.props.onChangeCategoryClassifierThreshold}
              onAddFallbackResponse={this.props.onAddFallbackResponse}
              onDeleteFallbackResponse={this.props.onDeleteFallbackResponse}
            />
          }
          sayingsForm={Link}
          sayingsURL={`/agent/${this.props.agent.id}/sayings`}
          keywordsForm={Link}
          keywordsURL={`/agent/${this.props.agent.id}/keywords`}
        />
      </Grid>
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
  onChangeAgentData: PropTypes.func,
  onChangeAgentName: PropTypes.func,
  onChangeWebhookData: PropTypes.func,
  onChangeWebhookPayloadType: PropTypes.func,
  onChangePostFormatData: PropTypes.func,
  onChangeCategoryClassifierThreshold: PropTypes.func,
  onChangeAgentSettingsData: PropTypes.func,
  onAddFallbackResponse: PropTypes.func,
  onDeleteFallbackResponse: PropTypes.func,
  onAddNewAgent: PropTypes.func,
  onEditAgent: PropTypes.func,
  onSuccess: PropTypes.func,
  onTrain: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  agent: makeSelectAgent(),
  webhook: makeSelectAgentWebhook(),
  postFormat: makeSelectAgentPostFormat(),
  settings: makeSelectSettings(),
  agentSettings: makeSelectAgentSettings(),
  settings: makeSelectSettings(),
  success: makeSelectSuccess(),
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
  withConnect
)(AgentPage);
