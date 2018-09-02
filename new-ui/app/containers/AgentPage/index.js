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
  changeDomainClassifierThreshold,
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

  componentDidMount() {
    if (this.state.isNewAgent){
      this.props.onChangeAgentData('language', this.props.settings.defaultAgentLanguage);
      this.props.onChangeAgentData('timezone', this.props.settings.defaultTimezone);
      this.props.onChangeAgentData('fallbackResponses', this.props.settings.defaultAgentFallbackResponses);
      this.props.onChangeAgentSettingsData('rasaURL', this.props.settings.rasaURL);
      this.props.onChangeAgentSettingsData('domainClassifierPipeline', this.props.settings.domainClassifierPipeline);
      this.props.onChangeAgentSettingsData('intentClassifierPipeline', this.props.settings.intentClassifierPipeline);
      this.props.onChangeAgentSettingsData('entityClassifierPipeline', this.props.settings.entityClassifierPipeline);
      this.props.onChangeAgentSettingsData('spacyPretrainedEntities', this.props.settings.spacyPretrainedEntities);
      this.props.onChangeAgentSettingsData('ducklingURL', this.props.settings.ducklingURL);
      this.props.onChangeAgentSettingsData('ducklingDimension', this.props.settings.ducklingDimension);
    }
  }

  componentDidUpdate() {
    if (this.props.success) {
      this.props.onSuccess(`/agent/${this.props.agent.id}/sayings`);
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
    isNewAgent: this.props.match.params.id === 'create'
  };

  render() {
    return (
      <Grid container>
        <ContentHeader
          title={messages.title}
          subtitle={this.state.isNewAgent ? messages.createSubtitle : this.props.agent.agentName}
          inlineElement={
            <ActionButtons
              onFinishAction={this.state.isNewAgent ? this.props.onAddNewAgent : this.props.onEditAgent}
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
              onChangeDomainClassifierThreshold={this.props.onChangeDomainClassifierThreshold}
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
  onChangeDomainClassifierThreshold: PropTypes.func,
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
    onChangeDomainClassifierThreshold: (value) => {
      dispatch(changeDomainClassifierThreshold(value));
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
