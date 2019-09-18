/**
 *
 * AnalyticsPage
 *
 */

import { Grid, CircularProgress } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import MainTab from '../../components/MainTab';
import injectSaga from '../../utils/injectSaga';
import Nes from 'nes';
import { getWS } from '../../utils/locationResolver';

import {
  trainAgent, loadKeywords, loadActions, loadAgentDocuments, loadAgentDocumentsSuccess,
  toggleChatButton
} from '../App/actions';

import { AUTH_ENABLED } from "../../../common/env";
import {
  ROUTE_DOCUMENT,
  ROUTE_AGENT,
} from '../../../common/constants';

import {
  makeSelectAgent,
  makeSelectServerStatus,
  makeSelectDocumentsAnalytics,
  makeSelectTotalDocumentsAnalytics
} from '../App/selectors';

import Form from './Components/Form';
import saga from './saga';

/* eslint-disable react/prefer-stateless-function */
export class AnalyticsPage extends React.PureComponent {

  state = {
    client: null,
    socketClientConnected: false,
    dateRange: 'all'
  };

  componentWillMount(){
    const {
      onLoadKeywords,
      onLoadActions,
      onLoadDocuments,
      onRefreshDocuments
    } = this.props;

    onLoadKeywords();
    onLoadActions();
    onLoadDocuments();

    if (!this.state.socketClientConnected) {
      const client = new Nes.Client(getWS());
      client.onConnect = () => {
        this.setState({
          client,
          socketClientConnected: true,
        });

        const handler = documents => {
          if (documents) {
            const payload = {
              documents: documents.data,
              total: documents.totalCount,
            };
            onLoadDocuments(this.state.dateRange);
          }
        };

        client.subscribe(
          `/${ROUTE_AGENT}/${this.props.agent.id}/${ROUTE_DOCUMENT}`,
          handler,
        );
      };
      client.connect({
        delay: 1000,
        auth: AUTH_ENABLED
          ? { headers: { cookie: document.cookie } }
          : undefined,
      });
    }
    this.props.onShowChatButton(true);
  }

  componentWillUnmount() {
    if (this.state.client) {
      this.state.client.unsubscribe(`/${ROUTE_AGENT}/${this.props.agent.id}/${ROUTE_DOCUMENT}`);
    }
  }

  render() {
    const { agent, onTrain } = this.props;
    return agent.id ? (
      <Grid container>
        <MainTab
          disableSave
          agentName={agent.agentName}
          agentGravatar={agent.gravatar ? agent.gravatar : 1}
          agentUIColor={agent.uiColor}
          onTrain={onTrain}
          agentStatus={agent.status}
          serverStatus={this.props.serverStatus}
          lastTraining={agent.lastTraining}
          enableTabs
          selectedTab="analytics"
          agentForm={Link}
          agentURL={`/agent/${agent.id}?ref=mainTab`}
          analyticsForm={
            <Form
              totalDocuments={this.props.totalDocuments}
              documents={this.props.documents}
              dateRange={this.state.dateRange}
              onSetDateRange={(dateRange) => {
                this.setState({
                  dateRange
                });
                this.props.onLoadDocuments(dateRange);
              }}
            />
          }
          agentForm={Link}
          agentURL={`/agent/${agent.id}?ref=mainTab`}
          dialogueForm={Link}
          dialogueURL={`/agent/${this.props.agent.id}/dialogue`}
          reviewForm={Link}
          reviewURL={`/agent/${this.props.agent.id}/review`}
        />
      </Grid>
    ) : (
      <CircularProgress
        style={{ position: 'absolute', top: '40%', left: '49%' }}
      />
    );
  }
}

AnalyticsPage.propTypes = {
  agent: PropTypes.object,
  serverStatus: PropTypes.string,
  onTrain: PropTypes.func,
  documents: PropTypes.array,
  totalDocuments: PropTypes.number,
  onShowChatButton: PropTypes.func
};

const mapStateToProps = createStructuredSelector({
  agent: makeSelectAgent(),
  serverStatus: makeSelectServerStatus(),
  documents: makeSelectDocumentsAnalytics(),
  totalDocuments: makeSelectTotalDocumentsAnalytics(),
});

function mapDispatchToProps(dispatch) {
  return {
    onTrain: () => {
      dispatch(trainAgent());
    },
    onLoadKeywords: () => {
      dispatch(loadKeywords());
    },
    onLoadActions: () => {
      dispatch(loadActions());
    },
    onLoadDocuments: (dateRange) => {
      dispatch(loadAgentDocuments({ dateRange }));
    },
    onRefreshDocuments: (payload) => {
      dispatch(loadAgentDocumentsSuccess(payload));
    },
    onShowChatButton: value => {
      dispatch(toggleChatButton(value));
    }
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga({ key: 'analytics', saga });

export default 
  compose(
    withSaga,
    withConnect,
  )(withRouter(AnalyticsPage));
