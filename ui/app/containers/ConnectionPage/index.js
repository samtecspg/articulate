/**
 *
 * ConnectionPage
 *
 */

import { CircularProgress, Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import qs from 'query-string';
import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectSaga from 'utils/injectSaga';
import { GROUP_ACCESS_CONTROL } from '../../../common/constants';
import AC from '../../utils/accessControl';
import {
  changeConnectionData,
  changeDetailValue,
  createConnection,
  deleteConnection,
  loadActions,
  loadAgents,
  loadChannels,
  loadConnection,
  resetActions,
  resetConnectionData,
  resetStatusFlag,
  toggleChatButton,
  updateConnection,
} from '../App/actions';
import {
  makeSelectActions,
  makeSelectAgents,
  makeSelectChannels,
  makeSelectConnection,
  makeSelectConnectionTouched,
  makeSelectCurrentUser,
  makeSelectLoading,
  makeSelectSuccessConnection,
} from '../App/selectors';
import ConnectionForm from './Components/ConnectionForm';
import DetailsForm from './Components/DetailsForm';
import MainTab from './Components/MainTab';
import saga from './saga';

/* eslint-disable react/prefer-stateless-function */
export class ConnectionPage extends React.Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.moveNextTab = this.moveNextTab.bind(this);
    this.onChangeTab = this.onChangeTab.bind(this);
    this.initForm = this.initForm.bind(this);
  }

  state = {
    isNewConnection: this.props.match.params.id === 'create',
    currentTab: 'connection',
    userCompletedAllRequiredFields: false,
    formError: false,
    exitAfterSubmit: false,
    errorState: {
      channel: false,
      agent: false,
      details: {},
      tabs: [],
    },
    channel: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).channel
      ? qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).channel
      : '',
    agent: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).agent
      ? qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).agent
      : '',
  };

  initForm() {
    if (this.state.isNewConnection) {
      this.props.onResetData();
      if (this.state.channel) {
        this.props.onChangeConnectionData('channel', this.state.channel);
      }
      if (this.state.agent) {
        this.props.onChangeConnectionData('agent', this.state.agent);
      }
      if (this.state.channel && this.state.agent) {
        this.onChangeTab('details');
      }
    } else {
      this.props.onLoadConnection(this.props.match.params.id);
    }
    this.props.onLoadAgents();
    this.props.onLoadChannels();
    this.props.onShowChatButton(false);
  }

  componentWillMount() {
    this.initForm();
  }

  componentDidUpdate() {
    if (this.props.success) {
      if (this.state.exitAfterSubmit) {
        this.props.onSuccess(`/`);
      }
      if (this.state.isNewConnection) {
        this.setState({
          isNewConnection: false,
          currentTab: 'connection',
        });
      }
    }
  }

  moveNextTab() {
    // If isn't currently on the last tab
    if (this.state.currentTab !== 'details') {
      const tabs = ['connection', 'details'];
      const currentTab = tabs.indexOf(this.state.currentTab);
      const nextTab = currentTab + 1;
      this.setState({
        currentTab: tabs[nextTab],
      });
    }
  }

  onChangeTab(tab) {
    this.setState({
      currentTab: tab,
    });
  }

  submit(exit) {
    let errors = false;
    const newErrorState = {
      channel: false,
      agent: false,
      details: {},
      tabs: [],
    };

    if (!this.props.connection.channel || this.props.connection.channel === '') {
      errors = true;
      newErrorState.channel = true;
      newErrorState.tabs.push(0);
    } else {
      newErrorState.channel = false;
    }

    if (!this.props.connection.agent || this.props.connection.agent === '') {
      errors = true;
      newErrorState.agent = true;
      newErrorState.tabs.push(0);
    } else {
      newErrorState.agent = false;
    }

    if (this.props.connection.channel) {
      const usedChannel = this.props.channels[this.props.connection.channel];
      Object.keys(usedChannel.details).forEach(channelDetail => {
        newErrorState.details[channelDetail] =
          (this.props.connection.details[channelDetail] === undefined || this.props.connection.details[channelDetail] === null) &&
          !this.props.channels[this.props.connection.channel].details[channelDetail].allowEmpty;
        if (newErrorState.details[channelDetail]) {
          errors = true;
          newErrorState.tabs.push(1);
        }
      });
    }

    if (!errors) {
      this.setState({
        formError: false,
        exitAfterSubmit: exit,
        errorState: { ...newErrorState },
      });
      if (this.state.isNewConnection) {
        this.props.onCreateConnection();
      } else {
        this.props.onUpdateConnection();
      }
    } else {
      this.setState({
        formError: true,
        errorState: { ...newErrorState },
      });
    }
  }

  render() {
    const { currentUser } = this.props;
    const isReadOnly = !AC.validate({ userPolicies: currentUser.simplifiedGroupPolicies, requiredPolicies: [GROUP_ACCESS_CONTROL.CONNECTION_WRITE] });

    return this.props.channels && this.props.agents ? (
      <Grid container>
        <MainTab
          touched={this.props.touched}
          loading={this.props.loading}
          success={this.props.success}
          goBack={() => {
            this.props.onGoToUrl(`/`);
          }}
          onSaveAndExit={() => {
            this.submit(true);
          }}
          newConnection={this.state.isNewConnection}
          connectionName={this.props.channels[this.props.connection.channel] ? this.props.channels[this.props.connection.channel].name : ''}
          formError={this.state.formError}
          hideFinishButton={this.state.currentTab === 'connection' && !this.state.userCompletedAllRequiredFields}
          isLastTab={this.state.currentTab === 'details'}
          onFinishAction={() => {
            this.submit(false);
          }}
          onNextAction={this.moveNextTab}
          selectedTab={this.state.currentTab}
          errorState={this.state.errorState}
          connectionForm={
            <ConnectionForm
              isReadOnly={isReadOnly}
              channels={this.props.channels}
              agents={this.props.agents}
              onResetActions={this.props.onResetActions}
              onLoadActions={this.props.onLoadActions}
              connection={this.props.connection}
              onChangeConnectionData={this.props.onChangeConnectionData}
              errorState={this.state.errorState}
              newConnection={this.state.isNewConnection}
              onDelete={this.props.onDelete.bind(null, this.props.connection.id)}
            />
          }
          detailsForm={
            <DetailsForm
              isReadOnly={isReadOnly}
              channels={this.props.channels}
              agentActions={this.props.agentActions}
              connection={this.props.connection}
              onChangeConnectionData={this.props.onChangeConnectionData}
              onChangeDetailValue={this.props.onChangeDetailValue}
              errorState={this.state.errorState}
              newConnection={this.state.isNewConnection}
              onDelete={this.props.onDelete.bind(null, this.props.connection.id)}
            />
          }
          onChangeTab={this.onChangeTab}
        />
      </Grid>
    ) : (
      <CircularProgress style={{ position: 'absolute', top: '40%', left: '49%' }} />
    );
  }
}

ConnectionPage.propTypes = {
  connection: PropTypes.object,
  agents: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  channels: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  agentActions: PropTypes.array,
  onLoadAgents: PropTypes.func,
  onResetActions: PropTypes.func,
  onLoadActions: PropTypes.func,
  onLoadChannels: PropTypes.func,
  onResetData: PropTypes.func,
  onLoadConnection: PropTypes.func,
  onCreateConnection: PropTypes.func,
  onUpdateConnection: PropTypes.func,
  onChangeConnectionData: PropTypes.func,
  onChangeDetailValue: PropTypes.func,
  onDelete: PropTypes.func,
  loading: PropTypes.bool,
  success: PropTypes.bool,
  touched: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  agents: makeSelectAgents(),
  agentActions: makeSelectActions(),
  channels: makeSelectChannels(),
  connection: makeSelectConnection(),
  success: makeSelectSuccessConnection(),
  loading: makeSelectLoading(),
  touched: makeSelectConnectionTouched(),
  currentUser: makeSelectCurrentUser(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadAgents: () => {
      dispatch(loadAgents());
    },
    onLoadChannels: () => {
      dispatch(loadChannels());
    },
    onResetActions: () => {
      dispatch(resetActions());
    },
    onLoadActions: agentId => {
      dispatch(loadActions(agentId));
    },
    onResetData: () => {
      dispatch(resetConnectionData());
    },
    onLoadConnection: id => {
      dispatch(loadConnection(id));
    },
    onCreateConnection: () => {
      dispatch(createConnection());
    },
    onUpdateConnection: () => {
      dispatch(updateConnection());
    },
    onChangeConnectionData: (field, value) => {
      dispatch(changeConnectionData({ field, value }));
    },
    onChangeDetailValue: (detailIndex, value) => {
      dispatch(changeDetailValue(detailIndex, value));
    },
    onSuccess: url => {
      dispatch(resetStatusFlag());
      dispatch(push(url));
    },
    onGoToUrl: url => {
      dispatch(push(url));
    },
    onDelete: id => {
      dispatch(deleteConnection(id));
    },
    onLoadSettings: () => {
      dispatch(loadSettings());
    },
    onShowChatButton: value => {
      dispatch(toggleChatButton(value));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga({ key: 'connectionsEdit', saga });

export default compose(
  withSaga,
  withConnect,
)(ConnectionPage);
