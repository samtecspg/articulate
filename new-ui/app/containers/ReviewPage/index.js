/**
 *
 * ReviewPage
 *
 */

import { Grid } from '@material-ui/core';
import _ from 'lodash';
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
  makeSelectSelectedCategory,
  makeSelectTotalDocuments,
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
    this.copySayingFromDocument = this.copySayingFromDocument.bind(this);
  }

  state = {
    filter: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).filter ? qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).filter : '',
    categoryFilter: '',
    currentPage: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).page ? parseInt(qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).page) : 1,
    pageSize: this.props.agent.settings.reviewPageSize,
    numberOfPages: null,
    totalDocuments: null,
    documents: [],
  };

  componentWillMount() {
    const {
      onLoadKeywords,
      onLoadActions,
      onLoadCategories,
      onLoadAgentDocuments,
    } = this.props.actions;

    if (this.props.agent.id) {
      onLoadKeywords();
      onLoadActions();
      onLoadCategories();
      onLoadAgentDocuments(this.state.currentPage, this.state.pageSize);
    } else {
      // TODO: An action when there isn't an agent
      console.log('YOU HAVEN\'T SELECTED AN AGENT');
    }
  }

  componentDidUpdate() {
    const { documents } = this.props;
    if (documents !== this.state.documents) {
      this.setState({ documents });
      this.setNumberOfPages(this.state.pageSize);
    }
  }

  setNumberOfPages(pageSize) {
    const numberOfPages = Math.ceil(this.props.totalDocuments / pageSize);
    this.setState({
      numberOfPages,
    });
  }

  changePage(pageNumber) {
    const { onLoadAgentDocuments } = this.props.actions;
    this.setState({
      currentPage: pageNumber,
    });
    onLoadAgentDocuments(pageNumber, this.state.pageSize);
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
      onLoadAgentDocuments,
      onChangeReviewPageSize,
    } = this.props.actions;
    this.setState({
      currentPage: 1,
      pageSize,
    });
    onChangeReviewPageSize(this.props.agent.id, pageSize);
    onLoadAgentDocuments(1, pageSize);
  }

  onSearchSaying(filter) {
    const { onLoadAgentDocuments } = this.props.actions;
    this.setState({
      filter,
      currentPage: 1,
    });
    onLoadAgentDocuments(1, this.state.pageSize);
  }

  onSearchCategory(categoryFilter) {
    const { onLoadFilteredCategories } = this.props.actions;
    this.setState({
      categoryFilter,
    });
    onLoadFilteredCategories(categoryFilter);
  }

  copySayingFromDocument(document) {
    const { agentCategories, agentKeywords } = this.props;
    const { onCopySaying } = this.props.actions;
    const rasaResult = document.rasa_results[0];
    const category = _.find(agentCategories, { 'categoryName': rasaResult.category });
    const saying = {
      userSays: document.document,
      keywords: rasaResult.keywords.map((keyword) => {
        const agentKeyword = _.find(agentKeywords, { 'keywordName': keyword.keyword });
        return {
          'value': keyword.value.value,
          'keyword': keyword.keyword,
          'start': keyword.start,
          'end': keyword.end,
          'keywordId': agentKeyword.id,
        };
      }),
      actions: [rasaResult.action.name],
      categoryId: category.id,
    };
    onCopySaying(saying);
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
              onCopySaying={this.copySayingFromDocument}
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
          sayingsURL={`/agent/${agent.id}/sayings`}
          sayingsForm={Link}
          keywordsForm={Link}
          keywordsURL={`/agent/${agent.id}/keywords`}
        />
      </Grid>
    );
  }
}

ReviewPage.propTypes = {
  actions: PropTypes.shape({
    onLoadAgentDocuments: PropTypes.func.isRequired,
    onLoadFilteredCategories: PropTypes.func.isRequired,
    onLoadCategories: PropTypes.func.isRequired,
    onLoadKeywords: PropTypes.func.isRequired,
    onLoadActions: PropTypes.func.isRequired,
    onCopySaying: PropTypes.func.isRequired,
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
  totalDocuments: PropTypes.number,
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
  totalDocuments: makeSelectTotalDocuments(),
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
      onLoadAgentDocuments: Actions.loadAgentDocuments,
      onLoadFilteredCategories: Actions.loadFilteredCategories,
      onLoadCategories: Actions.loadCategories,
      onLoadKeywords: Actions.loadKeywords,
      onLoadActions: Actions.loadActions,
      onCopySaying: Actions.copySaying,
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
