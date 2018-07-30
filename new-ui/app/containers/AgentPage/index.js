/**
 *
 * AgentPage
 *
 */

import React from 'react';
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import {
  makeSelectAgent,
  makeSelectWebhook,
  makeSelectPostFormat,
  makeSelectSettings,
} from './selectors';
import saga from './saga';
import messages from './messages';

import { Grid } from '@material-ui/core';
import ContentHeader from 'components/ContentHeader';
import MainTab from 'components/MainTab';
import Form from './Components/Form';
import ActionButtons from './Components/ActionButtons';
import {
  resetData,
  loadAgent,
  changeAgentData,
  changeAgentName,
  changeDomainClassifierThreshold,
  addFallbackResponse,
  deleteFallbackResponse,
  changeWebhookData,
  changeWebhookPayloadType,
  changePostFormatData,
  changeSettingsData,
} from './actions';

/* eslint-disable react/prefer-stateless-function */
export class AgentPage extends React.PureComponent {

  componentDidMount() {
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
              onChangeAgentData={this.props.onChangeAgentData}
              onChangeAgentName={this.props.onChangeAgentName}
              onChangeWebhookData={this.props.onChangeWebhookData}
              onChangeWebhookPayloadType={this.props.onChangeWebhookPayloadType}
              onChangePostFormatData={this.props.onChangePostFormatData}
              onChangeSettingsData={this.props.onChangeSettingsData}
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
  onLoadAgent: PropTypes.func,
  onChangeAgentData: PropTypes.func,
  onChangeAgentName: PropTypes.func,
  onChangeWebhookData: PropTypes.func,
  onChangeWebhookPayloadType: PropTypes.func,
  onChangePostFormatData: PropTypes.func,
  onChangeDomainClassifierThreshold: PropTypes.func,
  onChangeSettingsData: PropTypes.func,
  onAddFallbackResponse: PropTypes.func,
  onDeleteFallbackResponse: PropTypes.func,
  onAddNewAgent: PropTypes.func,
  onEditAgent: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  agent: makeSelectAgent(),
  webhook: makeSelectWebhook(),
  postFormat: makeSelectPostFormat(),
  settings: makeSelectSettings(),
});

function mapDispatchToProps(dispatch) {
  return {
    onResetData: () => {
      dispatch(resetData());
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
    onChangeSettingsData: (field, value) => {
      dispatch(changeSettingsData({ field, value }));
    },
    onChangeDomainClassifierThreshold: (value) => {
      dispatch(changeDomainClassifierThreshold(value));
    },
    onAddFallbackResponse: (newFallback) => {
      dispatch(addFallbackResponse(newFallback));
    },
    onDeleteFallbackResponse: (fallbackIndex) => {
      dispatch(deleteFallbackResponse(fallbackIndex));
    },
    onAddNewAgent: () => {
      console.log('add new agent');
    },
    onEditAgent: () => {
      console.log('edit agent');
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
