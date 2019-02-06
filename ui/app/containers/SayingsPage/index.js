/**
 *
 * SayingsPage
 *
 */
import { Grid, CircularProgress } from '@material-ui/core';
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
  loadAgent,
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
    this.addSaying = this.addSaying.bind(this);
    this.deleteSaying = this.deleteSaying.bind(this);
    this.initForm = this.initForm.bind(this);
  }

  state = {
    filter: '',
    categoryFilter: '',
    currentPage: 1,
    pageSize: this.props.agent.id ? this.props.agent.settings.sayingsPageSize : 5,
    numberOfPages: null,
    userSays: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).userSays,

  };

  initForm() {
    const agentSayingsPageSize = this.props.agent.settings.sayingsPageSize;
    this.throttledOnLoadSayings = _.throttle((filter, currentPage = this.state.currentPage, pageSize = agentSayingsPageSize) => {
      this.props.onLoadSayings(filter, currentPage, pageSize);
    }, 2000, { 'trailing': true });

    const locationSearchParams = qs.parse(this.props.location.search);
    const filter = locationSearchParams.filter || this.state.filter;
    const currentPage = locationSearchParams.page ? _.toNumber(locationSearchParams.page) : this.state.currentPage;
    this.setState({ filter, currentPage, pageSize: agentSayingsPageSize });

    this.props.onLoadKeywords();
    this.props.onLoadActions();
    this.props.onLoadCategories();
    this.props.onLoadSayings(filter, currentPage, agentSayingsPageSize);
  }

  componentWillMount() {
    if (this.props.agent.id) {
      this.initForm();
    }
  }

  componentWillUnmount() {
    this.throttledOnLoadSayings = null;
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.agent.id && this.props.agent.id){
      this.initForm();
    }
    if (this.props.totalSayings !== prevProps.totalSayings) {
      this.setState({
        numberOfPages: Math.ceil(this.props.totalSayings / this.state.pageSize),
      });
    }
  }

  changePage(pageNumber) {
    this.setState({
      currentPage: pageNumber,
    });
    this.props.onLoadSayings(this.state.filter, pageNumber, this.state.pageSize);
  }

  movePageBack() {
    const { currentPage } = this.state;
    this.changePage(currentPage > 1 ? currentPage - 1 : currentPage);
  }

  movePageForward() {
    const { currentPage, numberOfPages } = this.state;
    this.changePage(currentPage < numberOfPages ? currentPage + 1 : currentPage);
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
    this.setState({
      filter,
      currentPage: 1,
    });
    this.throttledOnLoadSayings(filter, 1);
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

  deleteSaying(sayingId, categoryId) {
    this.props.onDeleteSaying(this.state.filter, this.state.currentPage, this.state.pageSize, sayingId, categoryId);
  }

  render() {
    return (
      this.props.agent.id ?
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
              onDeleteSaying={this.deleteSaying}
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
              userSays={this.state.userSays}
              newSayingActions={this.props.newSayingActions}
              onClearSayingToAction={this.props.onClearSayingToAction}
              filter={this.state.filter}
            />
          }
          keywordsForm={Link}
          keywordsURL={`/agent/${this.props.agent.id}/keywords`}
        />
      </Grid> :
      <CircularProgress style={{position: 'absolute', top: '40%', left: '49%'}}/>
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
  location: PropTypes.object,
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
    onLoadAgent: (id) => {
      dispatch(loadAgent(id));
    },
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
    onDeleteSaying: (filter, page, pageSize, sayingId, categoryId) => {
      dispatch(deleteSaying(filter, page, pageSize, sayingId, categoryId));
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
