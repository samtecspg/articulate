import { CircularProgress, Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { GROUP_ACCESS_CONTROL } from '../../../common/constants';
import AccessControl from '../../components/AccessControl';
import AC from '../../utils/accessControl';
import injectSaga from '../../utils/injectSaga';
import { exportAgent, importAgent, loadAgents, loadChannels, loadConnections, toggleConversationBar } from '../App/actions';
import { makeSelectAgentExport, makeSelectAgents, makeSelectChannels, makeSelectConnections, makeSelectCurrentUser } from '../App/selectors';
import AgentsCards from './Components/AgentsCards';
import ConnectionsCards from './Components/ConnectionsCards';
import GetStarted from './Components/GetStarted';
import MainContentHeader from './Components/MainContentHeader';
import messages from './messages';
import saga from './saga';

const agentAccessPolicies = [GROUP_ACCESS_CONTROL.AGENT_READ, GROUP_ACCESS_CONTROL.AGENT_WRITE];
const connectionAccessPolicies = [GROUP_ACCESS_CONTROL.CONNECTION_READ, GROUP_ACCESS_CONTROL.CONNECTION_WRITE];

/* eslint-disable react/prefer-stateless-function */
export class AgentsPage extends React.PureComponent {
  componentWillMount() {
    const { onLoadAgents, onLoadConnections, onLoadChannels, currentUser } = this.props;
    onLoadChannels();
    AC.validate(
      {
        userPolicies: currentUser.simplifiedGroupPolicies,
        requiredPolicies: agentAccessPolicies,
      },
      onLoadAgents,
    );
    AC.validate(
      {
        userPolicies: currentUser.simplifiedGroupPolicies,
        requiredPolicies: connectionAccessPolicies,
      },
      onLoadConnections,
    );
  }

  render() {
    const { agents, connections, channels, currentUser } = this.props;
    const isAgentReadOnly = !AC.validate({ userPolicies: currentUser.simplifiedGroupPolicies, requiredPolicies: [GROUP_ACCESS_CONTROL.AGENT_WRITE] });
    const isConnectionReadOnly = !AC.validate({ userPolicies: currentUser.simplifiedGroupPolicies, requiredPolicies: [GROUP_ACCESS_CONTROL.CONNECTION_WRITE] });
    return (
      <Grid container>
        <GetStarted title={messages.title} sizesForHideInlineElement={['sm', 'xs']} />
        <AccessControl
          requiredPolicies={agentAccessPolicies}
          userPolicies={currentUser.simplifiedGroupPolicies}
          fallback={<MainContentHeader title={messages.titleAccessDenied} sizesForHideInlineElement={['sm', 'xs']} />}
        >
          <MainContentHeader title={messages.title} sizesForHideInlineElement={['sm', 'xs']} showHelp={true} />

          {agents ? (
            <React.Fragment>
              <AgentsCards
                isReadOnly={isAgentReadOnly}
                agents={agents}
                onImportAgent={this.props.onImportAgent}
                onExportAgent={this.props.onExportAgent}
                agentExport={this.props.agentExport}
                onGoToUrl={this.props.onGoToUrl}
                onToggleConversationBar={this.props.onToggleConversationBar}
              />

              <AccessControl
                requiredPolicies={connectionAccessPolicies}
                userPolicies={currentUser.simplifiedGroupPolicies}
                fallback={<MainContentHeader title={messages.connectionsTitleAccessDenied} sizesForHideInlineElement={['sm', 'xs']} />}
              >
                <MainContentHeader title={messages.connectionsTitle} sizesForHideInlineElement={['sm', 'xs']} showHelp={false} />
                {agents && connections && channels ? (
                  <ConnectionsCards
                    isReadOnly={isConnectionReadOnly}
                    agents={agents}
                    connections={connections}
                    channels={channels}
                    onGoToUrl={this.props.onGoToUrl}
                  />
                ) : (
                    <CircularProgress style={{ position: 'absolute', top: '40%', left: '49%' }} />
                  )}
              </AccessControl>
            </React.Fragment>
          ) : (
              <CircularProgress style={{ position: 'absolute', top: '40%', left: '49%' }} />
            )}
        </AccessControl>
      </Grid>
    );
  }
}

AgentsPage.propTypes = {
  onLoadAgents: PropTypes.func,
  onLoadConnections: PropTypes.func,
  onLoadChannels: PropTypes.func,
  onImportAgent: PropTypes.func,
  onGoToUrl: PropTypes.func,
  onExportAgent: PropTypes.func,
  onToggleConversationBar: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  agents: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  channels: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  connections: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  agentExport: PropTypes.object,
  currentUser: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  agents: makeSelectAgents(),
  connections: makeSelectConnections(),
  channels: makeSelectChannels(),
  agentExport: makeSelectAgentExport(),
  currentUser: makeSelectCurrentUser(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadAgents: () => {
      dispatch(loadAgents());
    },
    onLoadConnections: () => {
      dispatch(loadConnections());
    },
    onLoadChannels: () => {
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
    onToggleConversationBar: value => {
      dispatch(toggleConversationBar(value));
    },
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
