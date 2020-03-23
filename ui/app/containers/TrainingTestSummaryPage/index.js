/**
 *
 * Training Test Summary Page
 *
 */

import { CircularProgress, Grid } from '@material-ui/core';
import _ from 'lodash';
import PropTypes from 'prop-types';
import qs from 'query-string';
import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { GROUP_ACCESS_CONTROL } from '../../../common/constants';
import MainTab from './Components/MainTab';
import Form from './Components/Form';
import AC from '../../utils/accessControl';
import injectSaga from '../../utils/injectSaga';
import saga from './saga';

import {
  makeSelectAgent,
  makeSelectLocale,
  makeSelectDialoguePageFilterString,
  makeSelectCurrentUser,
  makeSelectTrainTest
} from '../App/selectors';

import {
  toggleChatButton,
  loadAgentTrainTest,
  loadSayings,
  changeDialoguePageFilterKeywords,
  changeDialoguePageFilterActions,
  changeDialoguePageFilterKeywordIssues,
  changeDialoguePageFilterString,
  changeDialoguePageNumberOfFiltersApplied,
  changeDialoguePageFilterActionIssues,
  resetDialoguePageFilters,
  loadAgentLatestTrainTest,
} from '../App/actions';

/* eslint-disable react/prefer-stateless-function */
export class TrainingTestSummaryPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onSearchSaying = this.onSearchSaying.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
  }

  state = {
    selectedTab: 'keywords',
    filter: this.props.dialoguePageFilterString,
  };

  componentWillMount() {
    this.props.onShowChatButton(true);
  }

  componentWillUnmount() {
    this.props.onLoadAgentLatestTrainTest();
  }

  onSearchSaying() {
    this.setState({
      currentSayingsPage: 1,
    });
    this.props.onLoadSayings(this.props.dialoguePageFilterString, 1, this.state.sayingsPageSize);
  }


  handleTabChange = (event, value) => {
    this.setState({
      selectedTab: value,
    });
  };

  render() {
    const { currentUser } = this.props;
    const isReadOnly = !AC.validate({ userPolicies: currentUser.simplifiedGroupPolicies, requiredPolicies: [GROUP_ACCESS_CONTROL.AGENT_WRITE] });

    return this.props.agent.id ? (
      <Grid container>
        <MainTab
          isReadOnly={isReadOnly}
          locale={this.props.locale}
          onGoToUrl={this.props.onGoToUrl}
          agent={this.props.agent}
          trainingTestSummaryForm={
            <Form
              handleTabChange={this.handleTabChange}
              selectedTab={this.state.selectedTab}
              testTrain={this.props.testTrain}
              onSearchSaying={this.onSearchSaying}
              onChangeDialoguePageFilterKeywords={this.props.onChangeDialoguePageFilterKeywords}
              onChangeDialoguePageFilterActions={this.props.onChangeDialoguePageFilterActions}
              onChangeDialoguePageFilterString={this.props.onChangeDialoguePageFilterString}
              onChangeDialoguePageFilterKeywordIssues={this.props.onChangeDialoguePageFilterKeywordIssues}
              onChangeDialoguePageFilterActionIssues={this.props.onChangeDialoguePageFilterActionIssues}
              onResetDialoguePageFilter={this.props.onResetDialoguePageFilter}
              onChangeDialoguePageNumberOfFiltersApplied={this.props.onChangeDialoguePageNumberOfFiltersApplied}
              onGoToUrl={this.props.onGoToUrl}
              agent={this.props.agent}
            />
          }
        />
      </Grid>
    ) : (
        <CircularProgress style={{ position: 'absolute', top: '40%', left: '49%' }} />
      );
  }
}

TrainingTestSummaryPage.propTypes = {
  agent: PropTypes.object,
  onLoadSayings: PropTypes.func,
  onGoToUrl: PropTypes.func,
  onShowChatButton: PropTypes.func,
  currentUser: PropTypes.object,
  onChangeDialoguePageFilterSearchSaying: PropTypes.func,
  dialoguePageFilterSearchSaying: PropTypes.string,
  onChangeDialoguePageFilterCategory: PropTypes.func,
  dialoguePageFilterCategory: PropTypes.string,
  onChangeDialoguePageFilterActions: PropTypes.func,
  dialoguePageFilterActions: PropTypes.array,
  onChangeDialoguePageNumberOfFiltersApplied: PropTypes.func,
  dialoguePageNumberOfFiltersApplied: PropTypes.number,
  onChangeDialoguePageFilterString: PropTypes.func,
  dialoguePageFilterString: PropTypes.string,
  onResetDialoguePageFilters: PropTypes.func,
  onChangeDialoguePageFilterKeywords: PropTypes.func,
  dialoguePageFilterKeywords: PropTypes.array,
  onChangeDialoguePageFilterKeywordIssues: PropTypes.func,
  dialoguePageFilterKeywordIssues: PropTypes.bool,
  onChangeDialoguePageFilterActionIssues: PropTypes.func,
  dialoguePageFilterActionIssues: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  agent: makeSelectAgent(),
  locale: makeSelectLocale(),
  currentUser: makeSelectCurrentUser(),
  testTrain: makeSelectTrainTest(),
  dialoguePageFilterString: makeSelectDialoguePageFilterString()

});

function mapDispatchToProps(dispatch) {
  return {
    onShowChatButton: value => {
      dispatch(toggleChatButton(value));
    },
    onResetDialoguePageFilters: () => {
      dispatch(resetDialoguePageFilters());
    },
    onChangeDialoguePageFilterKeywords: newValue => {
      dispatch(changeDialoguePageFilterKeywords(newValue));
    },
    onChangeDialoguePageFilterKeywordIssues: () => {
      dispatch(changeDialoguePageFilterKeywordIssues())
    },
    onChangeDialoguePageFilterActionIssues: () => {
      dispatch(changeDialoguePageFilterActionIssues())
    },
    onLoadAgentTestTrain: () => {
      dispatch(loadAgentTrainTest());
    },
    onLoadSayings: (filter, page, pageSize, ignoreKeywords) => {
      dispatch(loadSayings(filter, page, pageSize, ignoreKeywords));
    },
    onChangeDialoguePageFilterActions: newValue => {
      dispatch(changeDialoguePageFilterActions(newValue));
    },
    onChangeDialoguePageNumberOfFiltersApplied: newValue => {
      dispatch(changeDialoguePageNumberOfFiltersApplied(newValue));
    },
    onChangeDialoguePageFilterString: newValue => {
      dispatch(changeDialoguePageFilterString(newValue));
    },
    onChangeDialoguePageFilterKeywords: newValue => {
      dispatch(changeDialoguePageFilterKeywords(newValue));
    },
    onChangeDialoguePageFilterKeywordIssues: () => {
      dispatch(changeDialoguePageFilterKeywordIssues())
    },
    onChangeDialoguePageFilterActionIssues: () => {
      dispatch(changeDialoguePageFilterActionIssues())
    },
    onResetDialoguePageFilter: () => {
      dispatch(resetDialoguePageFilters())
    },
    onChangeDialoguePageNumberOfFiltersApplied: newValue => {
      dispatch(changeDialoguePageNumberOfFiltersApplied(newValue))
    },
    onGoToUrl: url => {
      dispatch(push(url));
    },
    onLoadAgentLatestTrainTest: () => {
      dispatch(loadAgentLatestTrainTest());
    }
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga({ key: 'trainingTestSummary', saga });

export default compose(
  withSaga,
  withConnect,
)(TrainingTestSummaryPage);
