/**
 *
 * ReviewPage
 *
 */

import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import qs from 'query-string';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
import {
  bindActionCreators,
  compose,
} from 'redux';
import { createStructuredSelector } from 'reselect';
import MainTab from '../../components/MainTab';
import injectSaga from '../../utils/injectSaga';
import * as Actions from '../App/actions';
import {
  makeSelectActions,
  makeSelectAgent,
  makeSelectCategories,
  makeSelectDocuments,
  makeSelectFilteredCategories,
  makeSelectKeywords,
  makeSelectNewSayingActions,
  makeSelectSayings,
  makeSelectSelectedCategory,
  makeSelectTotalSayings,
} from '../App/selectors';
import Form from './Components/Form';
import saga from './saga';

/* eslint-disable react/prefer-stateless-function */
export class ReviewPage extends React.Component {
  constructor(props) {
    super(props);
    this.changePage = this.changePage.bind(this);
    this.movePageBack = this.movePageBack.bind(this);
    this.movePageForward = this.movePageForward.bind(this);
    this.changePageSize = this.changePageSize.bind(this);
    this.onSearchSaying = this.onSearchSaying.bind(this);
    this.onSearchCategory = this.onSearchCategory.bind(this);
    this.setNumberOfPages = this.setNumberOfPages.bind(this);
    this.addSaying = this.addSaying.bind(this);
  }

  state = {
    filter: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).filter ? qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).filter : '',
    categoryFilter: '',
    currentPage: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).page ? parseInt(qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).page) : 1,
    pageSize: this.props.agent.settings.reviewPageSize,
    numberOfPages: null,
    totalSayings: null,
  };

  componentWillMount() {
    const {
      onLoadSayings,
      onLoadKeywords,
      onLoadActions,
      onLoadCategories,
      onLoadAgentDocuments,
    } = this.props.actions;

    if (this.props.agent.id) {
      onLoadKeywords();
      onLoadActions();
      onLoadCategories();
      onLoadSayings('', this.state.currentPage, this.state.pageSize);
      onLoadAgentDocuments();
    } else {
      // TODO: An action when there isn't an agent
      console.log('YOU HAVEN\'T SELECTED AN AGENT');
    }
  }

  componentDidUpdate() {
    const { totalSayings } = this.props;
    if (totalSayings !== this.state.totalSayings) {
      this.setState({ totalSayings });
      this.setNumberOfPages(this.state.pageSize);
    }
  }

  setNumberOfPages(pageSize) {
    const numberOfPages = Math.ceil(this.props.totalSayings / pageSize);
    this.setState({
      numberOfPages,
    });
  }

  changePage(pageNumber) {
    const { onLoadSayings } = this.props.actions;
    this.setState({
      currentPage: pageNumber,
    });
    onLoadSayings(this.state.filter, pageNumber, this.state.pageSize);
  }

  movePageBack() {
    let newPage = this.state.currentPage;
    if (this.state.currentPage > 1) {
      newPage = this.state.currentPage - 1;
    }
    this.changePage(newPage);
  }

  movePageForward() {
    let newPage = this.state.currentPage;
    if (this.state.currentPage < this.state.numberOfPages) {
      newPage = this.state.currentPage + 1;
    }
    this.changePage(newPage);
  }

  changePageSize(pageSize) {
    const {
      onLoadSayings,
      onChangeReviewPageSize,
    } = this.props.actions;
    this.setState({
      currentPage: 1,
      pageSize,
    });
    onChangeReviewPageSize(this.props.agent.id, pageSize);
    onLoadSayings(this.state.filter, 1, pageSize);
  }

  onSearchSaying(filter) {
    const { onLoadSayings } = this.props.actions;
    this.setState({
      filter,
      currentPage: 1,
    });
    onLoadSayings(filter, 1, this.state.pageSize);
  }

  onSearchCategory(categoryFilter) {
    const { onLoadFilteredCategories } = this.props.actions;
    this.setState({
      categoryFilter,
    });
    onLoadFilteredCategories(categoryFilter);
  }

  addSaying(saying) {
    const { onAddSaying } = this.props.actions;
    this.setState({
      currentPage: 1,
    });
    onAddSaying(this.state.pageSize, saying);
  }

  render() {
    const {
      onDeleteSaying,
      onTagKeyword,
      onUntagKeyword,
      onAddAction,
      onDeleteAction,
      onAddNewSayingAction,
      onDeleteNewSayingAction,
      onSendSayingToAction,
      onClearSayingToAction,
      onSelectCategory,
      onTrain,
      onToggleConversationBar,
      onSendMessage,
    } = this.props.actions;

    const {
      agent,
      documents,
      agentCategories,
      agentFilteredCategories,
      agentKeywords,
      agentActions,
      category,
      newSayingActions,
      onGoToUrl,
    } = this.props;
    return (
      <Grid container>
        <MainTab
          disableSave
          agentName={agent.agentName}
          onTrain={onTrain}
          agentStatus={agent.status}
          lastTraining={agent.lastTraining}
          enableTabs
          selectedTab="review"
          agentForm={Link}
          agentURL={`/agent/${agent.id}`}
          reviewForm={
            <Form
              agentId={agent.id}
              documents={documents}
              agentKeywords={agentKeywords}
              agentActions={agentActions}
              agentCategories={agentCategories}
              agentFilteredCategories={agentFilteredCategories}
              onAddSaying={this.addSaying}
              onDeleteSaying={() => onDeleteSaying(null, this.state.pageSize)}
              onTagKeyword={() => onTagKeyword(null, this.state.filter, this.state.currentPage, this.state.pageSize)}
              onUntagKeyword={() => onUntagKeyword(null, this.state.filter, this.state.currentPage, this.state.pageSize)}
              onAddAction={() => onAddAction(null, this.state.filter, this.state.currentPage, this.state.pageSize)}
              onDeleteAction={() => onDeleteAction(null, this.state.filter, this.state.currentPage, this.state.pageSize)}
              onAddNewSayingAction={onAddNewSayingAction}
              onDeleteNewSayingAction={onDeleteNewSayingAction}
              onSearchSaying={this.onSearchSaying}
              onSearchCategory={this.onSearchCategory}
              onGoToUrl={() => onGoToUrl(null, this.state.filter, this.state.currentPage, this.state.pageSize)}
              onSendSayingToAction={onSendSayingToAction}
              currentPage={this.state.currentPage}
              pageSize={this.state.pageSize}
              numberOfPages={this.state.numberOfPages}
              changePage={this.changePage}
              movePageBack={this.movePageBack}
              movePageForward={this.movePageForward}
              changePageSize={this.changePageSize}
              onSelectCategory={onSelectCategory}
              category={category}
              newSayingActions={newSayingActions}
              onClearSayingToAction={onClearSayingToAction}
              onToggleConversationBar={onToggleConversationBar}
              onSendMessage={onSendMessage}
            />
          }
          keywordsForm={Link}
          keywordsURL={`/agent/${agent.id}/keywords`}
        />
      </Grid>
    );
  }
}

ReviewPage.propTypes = {
  actions: PropTypes.shape({
    onLoadSayings: PropTypes.func.isRequired,
    onLoadAgentDocuments: PropTypes.func.isRequired,
    onLoadFilteredCategories: PropTypes.func.isRequired,
    onLoadCategories: PropTypes.func.isRequired,
    onLoadKeywords: PropTypes.func.isRequired,
    onLoadActions: PropTypes.func.isRequired,
    onAddSaying: PropTypes.func.isRequired,
    onDeleteSaying: PropTypes.func.isRequired,
    onTagKeyword: PropTypes.func.isRequired,
    onUntagKeyword: PropTypes.func.isRequired,
    onAddAction: PropTypes.func.isRequired,
    onDeleteAction: PropTypes.func.isRequired,
    onAddNewSayingAction: PropTypes.func.isRequired,
    onDeleteNewSayingAction: PropTypes.func.isRequired,
    onSendSayingToAction: PropTypes.func.isRequired,
    onClearSayingToAction: PropTypes.func.isRequired,
    onSelectCategory: PropTypes.func.isRequired,
    onTrain: PropTypes.func.isRequired,
    onToggleConversationBar: PropTypes.func.isRequired,
    onSendMessage: PropTypes.func.isRequired,
    onChangeReviewPageSize: PropTypes.func.isRequired,
  }),
  agent: PropTypes.object.isRequired,
  documents: PropTypes.array,
  totalSayings: PropTypes.number,
  agentCategories: PropTypes.array,
  agentFilteredCategories: PropTypes.array,
  agentKeywords: PropTypes.array,
  agentActions: PropTypes.array,
  category: PropTypes.string,
  newSayingActions: PropTypes.array,
  onGoToUrl: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  agent: makeSelectAgent(),
  sayings: makeSelectSayings(),
  totalSayings: makeSelectTotalSayings(),
  agentCategories: makeSelectCategories(),
  agentFilteredCategories: makeSelectFilteredCategories(),
  agentKeywords: makeSelectKeywords(),
  agentActions: makeSelectActions(),
  category: makeSelectSelectedCategory(),
  newSayingActions: makeSelectNewSayingActions(),
  documents: makeSelectDocuments(),
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      onLoadSayings: Actions.loadSayings,
      onLoadAgentDocuments: Actions.loadAgentDocuments,
      onLoadFilteredCategories: Actions.loadFilteredCategories,
      onLoadCategories: Actions.loadCategories,
      onLoadKeywords: Actions.loadKeywords,
      onLoadActions: Actions.loadActions,
      onAddSaying: Actions.addSaying,
      onDeleteSaying: Actions.deleteSaying,
      onTagKeyword: Actions.tagKeyword,
      onUntagKeyword: Actions.untagKeyword,
      onAddAction: Actions.addActionSaying,
      onDeleteAction: Actions.deleteActionSaying,
      onAddNewSayingAction: Actions.addActionNewSaying,
      onDeleteNewSayingAction: Actions.deleteActionNewSaying,
      onSendSayingToAction: Actions.sendSayingToAction,
      onClearSayingToAction: Actions.clearSayingToAction,
      onSelectCategory: Actions.selectCategory,
      onTrain: Actions.trainAgent,
      onToggleConversationBar: Actions.toggleConversationBar,
      onSendMessage: Actions.sendMessage,
      onChangeReviewPageSize: Actions.changeReviewPageSize,
    }, dispatch),
    onGoToUrl: (filter, page, pageSize, url) => {
      dispatch(push(`${url}?filter=${filter}&page=${page}&pageSize=${pageSize}`));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const withSaga = injectSaga({ key: 'review', saga });

export default compose(
  withSaga,
  withConnect,
)(ReviewPage);
