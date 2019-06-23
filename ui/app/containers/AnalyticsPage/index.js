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

import {
  trainAgent, loadKeywords, loadActions, loadAgentDocuments
} from '../App/actions';

import {
  makeSelectAgent,
  makeSelectServerStatus,
  makeSelectDocuments,
  makeSelectTotalDocuments
} from '../App/selectors';

import Form from './Components/Form';
import saga from './saga';

/* eslint-disable react/prefer-stateless-function */
export class AnalyticsPage extends React.PureComponent {

  componentWillMount(){
    const {
      onLoadKeywords,
      onLoadActions,
      onLoadDocuments
    } = this.props;

    onLoadKeywords();
    onLoadActions();
    onLoadDocuments();
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
};

const mapStateToProps = createStructuredSelector({
  agent: makeSelectAgent(),
  serverStatus: makeSelectServerStatus(),
  documents: makeSelectDocuments(),
  totalDocuments: makeSelectTotalDocuments(),
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
    onLoadDocuments: () => {
      dispatch(loadAgentDocuments());
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
