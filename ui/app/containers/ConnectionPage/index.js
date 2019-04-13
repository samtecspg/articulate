/**
 *
 * ConnectionPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { Grid, CircularProgress } from '@material-ui/core';
import MainTab from './Components/MainTab';
import ConnectionForm from './Components/ConnectionForm';
import DetailsForm from './Components/DetailsForm';

import injectSaga from 'utils/injectSaga';
import saga from './saga';

import {
  makeSelectConnection,
  makeSelectAgents,
  makeSelectSuccessConnection,
  makeSelectChannels,
  makeSelectLoading,
  makeSelectConnectionTouched,
} from '../App/selectors';

import {
  loadAgents,
  resetStatusFlag,
  changeConnectionData,
  loadConnection,
  resetConnectionData,
  createConnection,
  updateConnection,
  changeDetailValue,
  deleteConnection,
  loadChannels,
} from '../App/actions';

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
  };

  initForm(){
    if(this.state.isNewConnection) {
      this.props.onResetData();
    }
    else {
      this.props.onLoadConnection(this.props.match.params.id);
    }
    this.props.onLoadAgents();
    this.props.onLoadChannels();
  }

  componentWillMount() {
    this.initForm();
  }

  componentDidUpdate(){
    if (this.props.success){ 
      if (this.state.exitAfterSubmit) {
        this.props.onSuccess(`/`);
      }
      if (this.state.isNewConnection) {
        this.setState({
          isNewConnection: false,
          currentTab: 'connection'
        });
      }
    }
  }

  moveNextTab(){
    // If isn't currently on the last tab
    if (this.state.currentTab !== 'details'){
      const tabs = ['connection', 'details'];
      const currentTab = tabs.indexOf(this.state.currentTab);
      const nextTab = currentTab + 1;
      this.setState({
        currentTab: tabs[nextTab],
      })
    }
  }

  onChangeTab(tab){
    this.setState({
      currentTab: tab,
    });
  }

  submit(exit){
    let errors = false;
    const newErrorState = {
      channel: false,
      agent: false,
      details: {},
      tabs: [],
    };

    if (!this.props.connection.channel || this.props.connection.channel === ''){
      errors = true;
      newErrorState.channel = true;
      newErrorState.tabs.push(0);
    }
    else {
      newErrorState.channel = false;
    }

    if (!this.props.connection.agent || this.props.connection.agent === ''){
      errors = true;
      newErrorState.agent = true;
      newErrorState.tabs.push(0);
    }
    else {
      newErrorState.agent = false;
    }

    if (this.props.connection.channel){
      const usedChannel = this.props.channels[this.props.connection.channel];
      Object.keys(usedChannel.details).forEach((channelDetail) => {

        newErrorState.details[channelDetail] = this.props.connection.details[channelDetail] === undefined || this.props.connection.details[channelDetail] === null;
        if (newErrorState.details[channelDetail]){
          errors = true;
          newErrorState.tabs.push(1);
        }
      });
    }

    if (!errors){
      this.setState({
        formError: false,
        exitAfterSubmit: exit,
        errorState: {...newErrorState},
      });
      if (this.state.isNewConnection){
        this.props.onCreateConnection();
      }
      else {
        this.props.onUpdateConnection();
      }
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
      this.props.channels && this.props.agents ?
      <Grid container>
        <MainTab
          touched={this.props.touched}
          loading={this.props.loading}
          success={this.props.success}
          goBack={() => {this.props.onGoToUrl(`/`)}}
          onSaveAndExit={() => { this.submit(true) }}
          newConnection={this.state.isNewConnection}
          connectionName={this.props.channels[this.props.connection.channel] ? this.props.channels[this.props.connection.channel].name : ''}
          formError={this.state.formError}
          hideFinishButton={this.state.currentTab === 'connection' && !this.state.userCompletedAllRequiredFields}
          isLastTab={this.state.currentTab === 'details'}
          onFinishAction={() => { this.submit(false) }}
          onNextAction={this.moveNextTab}
          selectedTab={this.state.currentTab}
          errorState={this.state.errorState}
          connectionForm={
            <ConnectionForm
              channels={this.props.channels}
              agents={this.props.agents}
              connection={this.props.connection}
              onChangeConnectionData={this.props.onChangeConnectionData}
              errorState={this.state.errorState}
              newConnection={this.state.isNewConnection}
              onDelete={this.props.onDelete.bind(null, this.props.connection.id)}
            />
          }
          detailsForm={
            <DetailsForm
              channels={this.props.channels}
              agents={this.props.agents}
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
      </Grid> : 
      <CircularProgress style={{position: 'absolute', top: '40%', left: '49%'}}/>
    );
  }
}

ConnectionPage.propTypes = {
  connection: PropTypes.object,
  agents: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool,
  ]),
  channels: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
  onLoadAgents: PropTypes.func,
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
  channels: makeSelectChannels(),
  connection: makeSelectConnection(),
  success: makeSelectSuccessConnection(),
  loading: makeSelectLoading(),
  touched: makeSelectConnectionTouched(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadAgents: () => {
      dispatch(loadAgents());
    },
    onLoadChannels: () => {
      dispatch(loadChannels());
    },
    onResetData: () => {
      dispatch(resetConnectionData());
    },
    onLoadConnection: (id) => {
      dispatch(loadConnection(id));
    },
    onCreateConnection: () => {
      dispatch(createConnection());
    },
    onUpdateConnection: () => {
      dispatch(updateConnection());
    },
    onChangeConnectionData: (field, value) => {
      dispatch(changeConnectionData({field, value}));
    },
    onChangeDetailValue: (detailIndex, value) => {
      dispatch(changeDetailValue(detailIndex, value));
    },
    onSuccess: (url) => {
      dispatch(resetStatusFlag());
      dispatch(push(url));
    },
    onGoToUrl: (url) => {
      dispatch(push(url));
    },
    onDelete: (id) => {
      dispatch(deleteConnection(id));
    },
    onLoadSettings: () => {
      dispatch(loadSettings())
    }
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga({ key: 'connectionsEdit', saga });

export default compose(
  withSaga,
  withConnect
)(ConnectionPage);
