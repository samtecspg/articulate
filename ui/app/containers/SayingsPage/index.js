/**
 *
 * SayingsPage
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
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import MainTab from '../../components/MainTab';
import ExtractTokensFromString from '../../utils/extractTokensFromString';
import injectSaga from '../../utils/injectSaga';
import {
  addActionNewSaying,
  addActionSaying,
  addSaying,
  changeSayingsPageSize,
  clearSayingToAction,
  deleteActionNewSaying,
  deleteActionSaying,
  deleteSaying,
  loadActions,
  loadCategories,
  loadFilteredCategories,
  loadKeywords,
  loadSayings,
  selectCategory,
  sendSayingToAction,
  tagKeyword,
  trainAgent,
  untagKeyword,
} from '../App/actions';
import {
  makeSelectActions,
  makeSelectAgent,
  makeSelectCategories,
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
export class SayingsPage extends React.Component {

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
    filter: { category: '', actions: '', query: '' },
    categoryFilter: '',
    currentPage: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).page ? parseInt(qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).page) : 1,
    pageSize: this.props.agent.settings.sayingsPageSize,
    numberOfPages: null,
    totalSayings: null,
  };

  componentWillMount() {
    if (this.props.agent.id) {
      this.props.onLoadKeywords();
      this.props.onLoadActions();
      this.props.onLoadCategories();
      this.props.onLoadSayings('', this.state.currentPage, this.state.pageSize);
    }
    else {
      // TODO: An action when there isn't an agent
      console.log('YOU HAVEN\'T SELECTED AN AGENT');
    }

    this.callFilter = _.throttle((filter) => {
      this.props.onLoadSayings(filter, 1, this.state.pageSize);
    }, 2000, { 'trailing': true });
  }

  componentWillUnmount() {
    this.callFilter = null;
  }

  componentDidUpdate() {
    if (this.props.totalSayings !== this.state.totalSayings) {
      this.setState({
        totalSayings: this.props.totalSayings,
      });
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
    this.setState({
      currentPage: pageNumber,
    });
    this.props.onLoadSayings(this.state.filter, pageNumber, this.state.pageSize);
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
    this.setState({
      currentPage: 1,
      pageSize,
    });
    this.props.onChangeSayingsPageSize(this.props.agent.id, pageSize);
    this.props.onLoadSayings(this.state.filter, 1, pageSize);
  }

  onSearchSaying(filter) {
    const updatedFilter = { ...this.state.filter, ...filter };
    const { remainingText, found } = ExtractTokensFromString({ text: updatedFilter.query, tokens: ['category', 'actions'] });
    updatedFilter.category = found.category;
    updatedFilter.actions = found.actions;
    this.setState({
      filter: {
        category: found.category,
        actions: found.actions,
        query: updatedFilter.query,
      },
      currentPage: 1,
    });
    this.callFilter({
      category: updatedFilter.category,
      actions: updatedFilter.actions,
      query: remainingText,
    });
  }

  onSearchCategory(categoryFilter) {
    this.setState({
      categoryFilter,
    });
    this.props.onLoadFilteredCategories(categoryFilter);
  }

  addSaying(saying) {
    this.setState({
      currentPage: 1,
    });
    this.props.onAddSaying(this.state.filter, 1, this.state.pageSize, saying);
  }

  render() {
    return (
      <Grid container>
        <MainTab
          disableSave
          agentName={this.props.agent.agentName}
          onTrain={this.props.onTrain}
          agentStatus={this.props.agent.status}
          lastTraining={this.props.agent.lastTraining}
          enableTabs
          selectedTab="sayings"
          agentForm={Link}
          agentURL={`/agent/${this.props.agent.id}`}
          reviewURL={`/agent/${this.props.agent.id}/review`}
          reviewForm={Link}
          sayingsForm={
            <Form
              agentId={this.props.agent.id}
              sayingsPageSize={this.props.agent.settings.sayingsPageSize}
              sayings={this.props.sayings}
              agentKeywords={this.props.agentKeywords}
              agentActions={this.props.agentActions}
              agentCategories={this.props.agentCategories}
              agentFilteredCategories={this.props.agentFilteredCategories}
              onAddSaying={this.addSaying}
              onDeleteSaying={this.props.onDeleteSaying.bind(null, this.state.pageSize)}
              onTagKeyword={this.props.onTagKeyword.bind(null, this.state.filter, this.state.currentPage, this.state.pageSize)}
              onUntagKeyword={this.props.onUntagKeyword.bind(null, this.state.filter, this.state.currentPage, this.state.pageSize)}
              onAddAction={this.props.onAddAction.bind(null, this.state.filter, this.state.currentPage, this.state.pageSize)}
              onDeleteAction={this.props.onDeleteAction.bind(null, this.state.filter, this.state.currentPage, this.state.pageSize)}
              onAddNewSayingAction={this.props.onAddNewSayingAction}
              onDeleteNewSayingAction={this.props.onDeleteNewSayingAction}
              onSearchSaying={this.onSearchSaying}
              onSearchCategory={this.onSearchCategory}
              onGoToUrl={this.props.onGoToUrl.bind(null, this.state.filter, this.state.currentPage, this.state.pageSize)}
              onSendSayingToAction={this.props.onSendSayingToAction}
              currentPage={this.state.currentPage}
              pageSize={this.state.pageSize}
              numberOfPages={this.state.numberOfPages}
              changePage={this.changePage}
              movePageBack={this.movePageBack}
              movePageForward={this.movePageForward}
              changePageSize={this.changePageSize}
              onSelectCategory={this.props.onSelectCategory}
              category={this.props.category}
              newSayingActions={this.props.newSayingActions}
              onClearSayingToAction={this.props.onClearSayingToAction}
              filter={this.state.filter}
            />
          }
          keywordsForm={Link}
          keywordsURL={`/agent/${this.props.agent.id}/keywords`}
        />
      </Grid>
    );
  }
}

SayingsPage.propTypes = {
  agent: PropTypes.object,
  onLoadSayings: PropTypes.func,
  onLoadKeywords: PropTypes.func,
  onLoadActions: PropTypes.func,
  onChangeSayingsData: PropTypes.func,
  onDeleteSaying: PropTypes.func,
  onAddAction: PropTypes.func,
  onDeleteAction: PropTypes.func,
  onAddNewSayingAction: PropTypes.func,
  onDeleteNewSayingAction: PropTypes.func,
  onTagKeyword: PropTypes.func,
  onUntagKeyword: PropTypes.func,
  onGoToUrl: PropTypes.func,
  onSendSayingToAction: PropTypes.func,
  onClearSayingToAction: PropTypes.func,
  sayings: PropTypes.array,
  totalSayings: PropTypes.number,
  agentCategories: PropTypes.array,
  agentFilteredCategories: PropTypes.array,
  agentKeywords: PropTypes.array,
  agentActions: PropTypes.array,
  onSelectCategory: PropTypes.func,
  category: PropTypes.string,
  onTrain: PropTypes.func,
  newSayingActions: PropTypes.array,
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
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadSayings: (filter, page, pageSize) => {
      dispatch(loadSayings(filter, page, pageSize));
    },
    onLoadFilteredCategories: (filter) => {
      dispatch(loadFilteredCategories(filter));
    },
    onLoadCategories: () => {
      dispatch(loadCategories());
    },
    onLoadKeywords: () => {
      dispatch(loadKeywords());
    },
    onLoadActions: () => {
      dispatch(loadActions());
    },
    onAddSaying: (filter, page, pageSize, value) => {
      dispatch(addSaying(filter, page, pageSize, value));
    },
    onDeleteSaying: (pageSize, sayingId, categoryId) => {
      dispatch(deleteSaying(pageSize, sayingId, categoryId));
    },
    onTagKeyword: (filter, page, pageSize, saying, value, start, end, keywordId, keywordName) => {
      dispatch(tagKeyword(filter, page, pageSize, saying, value, start, end, keywordId, keywordName));
    },
    onUntagKeyword: (filter, page, pageSize, saying, start, end) => {
      dispatch(untagKeyword(filter, page, pageSize, saying, start, end));
    },
    onAddAction: (filter, page, pageSize, saying, actionName) => {
      dispatch(addActionSaying(filter, page, pageSize, saying, actionName));
    },
    onDeleteAction: (filter, page, pageSize, saying, actionName) => {
      dispatch(deleteActionSaying(filter, page, pageSize, saying, actionName));
    },
    onAddNewSayingAction: (actionName) => {
      dispatch(addActionNewSaying(actionName));
    },
    onDeleteNewSayingAction: (actionName) => {
      dispatch(deleteActionNewSaying(actionName));
    },
    onGoToUrl: (filter, page, pageSize, url) => {
      dispatch(push(`${url}?filter=${filter}&page=${page}&pageSize=${pageSize}`));
    },
    onSendSayingToAction: (saying) => {
      dispatch(sendSayingToAction(saying));
    },
    onClearSayingToAction: () => {
      dispatch(clearSayingToAction());
    },
    onSelectCategory: (categoryName) => {
      dispatch(selectCategory(categoryName));
    },
    onTrain: () => {
      dispatch(trainAgent());
    },
    onChangeSayingsPageSize: (agentId, pageSize) => {
      dispatch(changeSayingsPageSize(agentId, pageSize));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga({ key: 'sayings', saga });

export default compose(
  withSaga,
  withConnect,
)(SayingsPage);
