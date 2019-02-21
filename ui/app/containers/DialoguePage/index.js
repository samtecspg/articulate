/**
 *
 * DialoguePage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import qs from 'query-string';
import _ from 'lodash';

import { Link } from 'react-router-dom';
import { Grid, CircularProgress } from '@material-ui/core';
import MainTab from '../../components/MainTab';
import Form from './Components/Form';

import injectSaga from '../../utils/injectSaga';
import saga from './saga';

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
  makeSelectLocale,
  makeSelectTotalKeywords,
} from '../App/selectors';

import {
  loadAgent,
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
  changeKeywordsPageSize,
} from '../App/actions';


/* eslint-disable react/prefer-stateless-function */
export class DialoguePage extends React.PureComponent {

  constructor(props) {
    super(props);
    this.changePage = this.changePage.bind(this);
    this.moveSayingsPageBack = this.moveSayingsPageBack.bind(this);
    this.moveSayingsPageForward = this.moveSayingsPageForward.bind(this);
    this.changeSayingsPageSize = this.changeSayingsPageSize.bind(this);
    this.onSearchSaying = this.onSearchSaying.bind(this);
    this.onSearchCategory = this.onSearchCategory.bind(this);
    this.addSaying = this.addSaying.bind(this);
    this.deleteSaying = this.deleteSaying.bind(this);
    this.initForm = this.initForm.bind(this);
    this.changeKeywordsPage = this.changeKeywordsPage.bind(this);
    this.moveKeywordsPageBack = this.moveKeywordsPageBack.bind(this);
    this.moveKeywordsPageForward = this.moveKeywordsPageForward.bind(this);
    this.onSearchKeyword = this.onSearchKeyword.bind(this);
    this.setNumberOfKeywordsPages = this.setNumberOfKeywordsPages.bind(this);
    this.changeKeywordsPageSize = this.changeKeywordsPageSize.bind(this);
    this.initForm = this.initForm.bind(this);
  }

  state = {
    filter: '',
    categoryFilter: '',
    currentSayingsPage: 1,
    sayingsPageSize: this.props.agent.id ? this.props.agent.settings.sayingsPageSize : 5,
    numberOfSayingsPages: null,
    userSays: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).userSays,
    currentKeywordsPage: 1,
    keywordsPageSize: this.props.agent.id ? this.props.agent.settings.keywordsPageSize : 5,
    numberOfKeywordsPages: null,
    totalKeywords: null,

  };

  initForm() {
    const agentSayingsPageSize = this.props.agent.settings.sayingsPageSize;
    this.throttledOnLoadSayings = _.throttle((filter, currentSayingsPage = this.state.currentSayingsPage, pageSize = agentSayingsPageSize) => {
      this.props.onLoadSayings(filter, currentSayingsPage, pageSize);
    }, 2000, { 'trailing': true });

    const locationSearchParams = qs.parse(this.props.location.search);
    const filter = locationSearchParams.filter || this.state.filter;
    const currentSayingsPage = locationSearchParams.page ? _.toNumber(locationSearchParams.page) : this.state.currentSayingsPage;
    this.setState({ filter, currentSayingsPage, pageSize: agentSayingsPageSize });

    this.props.onLoadKeywords();
    this.props.onLoadActions();
    this.props.onLoadCategories();
    this.props.onLoadSayings(filter, currentSayingsPage, agentSayingsPageSize);
    
    this.setState({ keywordsPageSize: this.props.agent.settings.keywordsPageSize });
    this.props.onLoadKeywords('', this.state.currentKeywordsPage, this.state.keywordsPageSize);
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
        numberOfSayingsPages: Math.ceil(this.props.totalSayings / this.state.sayingsPageSize),
      });
    }
    if (this.props.totalKeywords !== this.state.totalKeywords){
      this.setState({
        totalKeywords: this.props.totalKeywords,
      });
      this.setNumberOfKeywordsPages(this.state.keywordsPageSize);
    }
  }

  changePage(pageNumber) {
    this.setState({
      currentSayingsPage: pageNumber,
    });
    this.props.onLoadSayings(this.state.filter, pageNumber, this.state.sayingsPageSize);
  }

  moveSayingsPageBack() {
    const { currentSayingsPage } = this.state;
    this.changePage(currentSayingsPage > 1 ? currentSayingsPage - 1 : currentSayingsPage);
  }

  moveSayingsPageForward() {
    const { currentSayingsPage, numberOfSayingsPages } = this.state;
    this.changePage(currentSayingsPage < numberOfSayingsPages ? currentSayingsPage + 1 : currentSayingsPage);
  }

  changeSayingsPageSize(pageSize) {
    this.setState({
      currentSayingsPage: 1,
      sayingsPageSize,
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
    this.props.onDeleteSaying(this.state.filter, this.state.currentSayingsPage, this.state.sayingsPageSize, sayingId, categoryId);
  }

  setNumberOfKeywordsPages(pageSize){
    const numberOfKeywordsPages = Math.ceil(this.props.totalKeywords / pageSize);
    this.setState({
      numberOfKeywordsPages,
    });
  }

  changeKeywordsPage(pageNumber){
    this.setState({
      currentKeywordsPage: pageNumber,
    });
    this.props.onLoadKeywords(this.state.filter, pageNumber, this.state.keywordsPageSize);
  }

  moveKeywordsPageBack(){
    let newPage = this.state.currentKeywordsPage;
    if (this.state.currentKeywordsPage > 1){
      newPage = this.state.currentKeywordsPage - 1;
    }
    this.changePage(newPage);
  }

  moveKeywordsPageForward(){
    let newPage = this.state.currentKeywordsPage;
    if (this.state.currentKeywordsPage < this.state.numberOfKeywordsPages){
      newPage = this.state.currentKeywordsPage + 1;
    }
    this.changePage(newPage);
  }

  changeKeywordsPageSize(keywordsPageSize){
    this.setState({
      currentKeywordsPage: 1,
      keywordsPageSize,
    });
    this.props.onChangeKeywordsPageSize(this.props.agent.id, keywordsPageSize);
    this.props.onLoadKeywords(this.state.filter, 1, keywordsPageSize);
  }

  onSearchKeyword(filter){
    this.setState({
      filter,
    });
    this.props.onLoadKeywords(filter, this.state.currentKeywordsPage, this.state.keywordsPageSize);
  }

  render() {
    return (
      this.props.agent.id && this.props.agentKeywords ?
      <Grid container>
        <MainTab
          locale={this.props.locale}
          touched={this.props.touched}
          loading={this.props.loading}
          success={this.props.success}
          onSaveAndExit={() => { this.submit(true) }}
          agentName={this.props.agent.agentName}
          newAgent={this.state.isNewAgent}
          formError={this.state.formError}
          onFinishAction={this.submit}
          onTrain={this.props.onTrain}
          agentStatus={this.props.agent.status}
          lastTraining={this.props.agent.lastTraining}
          enableTabs={!this.state.isNewAgent}
          selectedTab="dialogue"
          agentForm={Link}
          agentURL={`/agent/${this.props.agent.id}`}
          dialogueForm={
            <Form
              onSearchKeyword={this.onSearchKeyword}
              keywords={this.props.keywords}
              onCreateKeyword={this.props.onCreateKeyword}
              currentKeywordsPage={this.state.currentKeywordsPage}
              keywordsPageSize={this.state.keywordsPageSize}
              numberOfKeywordsPages={this.state.numberOfKeywordsPages}
              changeKeywordsPage={this.changeKeywordsPage}
              changeKeywordsPageSize={this.changeKeywordsPageSize}
              moveKeywordsPageBack={this.moveKeywordsPageBack}
              moveKeywordsPageForward={this.moveKeywordsPageForward}
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
              currentSayingsPage={this.state.currentSayingsPage}
              sayingsPageSize={this.state.sayingsPageSize}
              numberOfSayingsPages={this.state.numberOfSayingsPages}
              changeSayingsPage={this.changeSayingsPage}
              moveSayingsPageBack={this.moveSayingsPageBack}
              moveSayingsPageForward={this.moveSayingsPageForward}
              changeSayingsPageSize={this.changeSayingsPageSize}
              onSelectCategory={this.props.onSelectCategory}
              category={this.props.category}
              userSays={this.state.userSays}
              newSayingActions={this.props.newSayingActions}
              onClearSayingToAction={this.props.onClearSayingToAction}
              filter={this.state.filter}
            />
          }
          dialogueURL={`/agent/${this.props.agent.id}/dialogue`}
          reviewURL={`/agent/${this.props.agent.id}/review`}
          reviewForm={Link}
        />
      </Grid> : 
      <CircularProgress style={{position: 'absolute', top: '40%', left: '49%'}}/>
    );
  }
}

DialoguePage.propTypes = {
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
  keywords: PropTypes.array,
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
  locale: makeSelectLocale(),
  totalKeywords: makeSelectTotalKeywords(),
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
    onLoadKeywords: (filter, page, pageSize) => {
      dispatch(loadKeywords(filter, page, pageSize));
    },
    onCreateKeyword: (url) => {
      dispatch(push(url))
    },
    onChangeKeywordsPageSize: (agentId, pageSize) => {
      dispatch(changeKeywordsPageSize(agentId, pageSize));
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
    onGoToUrl: (filter, page, pageSize, tab, url) => {
      dispatch(push(`${url}?filter=${filter}&page=${page}&pageSize=${pageSize}&tab=${tab}`));
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

const withSaga = injectSaga({ key: 'agent', saga });

export default compose(
  withSaga,
  withConnect,
)(DialoguePage);
