/*
 * AgentsPage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import { CircularProgress, Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import injectSaga from 'utils/injectSaga';
import {
  exportAgent,
  importAgent,
  loadAgents,
  loadChannels,
  loadConnections,
  toggleConversationBar,
  toggleChatButton
} from '../App/actions';
import {
  makeSelectAgentExport,
  makeSelectAgents,
  makeSelectChannels,
  makeSelectConnections,
  makeSelectShowChatButton
} from '../App/selectors';
import AgentsCards from './Components/AgentsCards';
import ConnectionsCards from './Components/ConnectionsCards';

import MainContentHeader from './Components/MainContentHeader';
import messages from './messages';

import saga from './saga';
import GetStarted from './Components/GetStarted';

/* eslint-disable react/prefer-stateless-function */
export class AgentsPage extends React.PureComponent {
  componentWillMount() {
    this.props.onComponentMounted();
  }

  render() {
    const { agents, connections, channels } = this.props;
    return agents && connections && channels ? (
      <Grid container>
        <GetStarted
          title={messages.title}
          sizesForHideInlineElement={['sm', 'xs']}
        />
        <MainContentHeader
          title={messages.title}
          sizesForHideInlineElement={['sm', 'xs']}
        />

        <AgentsCards
          agents={agents}
          onImportAgent={this.props.onImportAgent}
          onExportAgent={this.props.onExportAgent}
          agentExport={this.props.agentExport}
          onGoToUrl={this.props.onGoToUrl}
          onToggleConversationBar = {this.props.onToggleConversationBar}
          onShowChatButton = {this.props.onShowChatButton}
        />
        <MainContentHeader
          title={messages.connectionsTitle}
          sizesForHideInlineElement={['sm', 'xs']}
        />
        <ConnectionsCards
          agents={agents}
          connections={connections}
          channels={channels}
          onGoToUrl={this.props.onGoToUrl}
        />
      </Grid>
    ) : (
      <CircularProgress
        style={{ position: 'absolute', top: '40%', left: '49%' }}
      />
    );
  }
}

AgentsPage.propTypes = {
  onComponentMounted: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  agents: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  connections: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  agentExport: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  agents: makeSelectAgents(),
  connections: makeSelectConnections(),
  channels: makeSelectChannels(),
  agentExport: makeSelectAgentExport(),
});

function mapDispatchToProps(dispatch) {
  return {
    onComponentMounted: () => {
      dispatch(loadAgents());
      dispatch(loadConnections());
      dispatch(loadChannels());
    },
    onGoToUrl: url => {
      dispatch(push(url));
    },
    onExportAgent: id => {
      dispatch(exportAgent(id));
    },
    onImportAgent: agent => {
      dispatch(importAgent(agent));
    },
    onToggleConversationBar : value => {
      dispatch(toggleConversationBar(value));
    },
    onShowChatButton : value => {
      dispatch(toggleChatButton(value));
    }
  };
}

const withSaga = injectSaga({ key: 'agents', saga });
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withSaga,
  withConnect,
)(AgentsPage);
