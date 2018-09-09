/**
 *
 * SayingsPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { Link } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import ContentHeader from 'components/ContentHeader';
import MainTab from 'components/MainTab';
import Form from './Components/Form';

import injectSaga from 'utils/injectSaga';
import saga from './saga';
import messages from './messages';
import {
  makeSelectAgent,
  makeSelectSayings,
  makeSelectTotalSayings,
  makeSelectKeywords,
  makeSelectActions,
  makeSelectDomains,
  makeSelectSelectedDomain,
  makeSelectFilteredDomains,
} from '../App/selectors';
import {
  loadSayings,
  addSaying,
  deleteSaying,
  tagKeyword,
  untagKeyword,
  addActionSaying,
  deleteActionSaying,
  loadKeywords,
  loadActions,
  sendSayingToAction,
  loadDomains,
  selectDomain,
  loadFilteredDomains,
} from '../App/actions';

/* eslint-disable react/prefer-stateless-function */
export class SayingsPage extends React.Component {

  constructor(){
    super();
    this.changePage = this.changePage.bind(this);
    this.movePageBack = this.movePageBack.bind(this);
    this.movePageForward = this.movePageForward.bind(this);
    this.onSearchSaying = this.onSearchSaying.bind(this);
    this.onSearchDomain = this.onSearchDomain.bind(this);
    this.getTotalPages = this.getTotalPages.bind(this);
  }

  state = {
    filter: '',
    domainFilter: '',
    currentPage: 1,
  }

  componentWillMount() {
    if(this.props.agent.id) {
      this.props.onLoadKeywords();
      this.props.onLoadActions();
      this.props.onLoadDomains();
      this.props.onLoadSayings('', this.state.currentPage);
    }
    else {
      //TODO: An action when there isn't an agent
      console.log('YOU HAVEN\'T SELECTED AN AGENT');
    }
  }

  getTotalPages(){
    const itemsByPage = 5;
    return Math.ceil(this.props.totalSayings / itemsByPage);
  }

  changePage(pageNumber){
    this.setState({
        currentPage: pageNumber
    });
    this.props.onLoadSayings(this.state.filter, pageNumber);
  }

  movePageBack(){
    let newPage = this.state.currentPage;
    if (this.state.currentPage > 1){
        newPage = this.state.currentPage - 1;
    }
    this.changePage(newPage);
  }

  movePageForward(){
    let newPage = this.state.currentPage;
    if (this.state.currentPage < this.getTotalPages()){
        newPage = this.state.currentPage + 1;
    }
    this.changePage(newPage);
  }

  onSearchSaying(filter){
    this.setState({
      filter
    });
    this.props.onLoadSayings(filter, this.state.currentPage);
  }

  onSearchDomain(domainFilter){
    this.setState({
      domainFilter
    });
    this.props.onLoadFilteredDomains(domainFilter);
  }

  render() {
    return (
      <Grid container>
        <ContentHeader
          title={messages.title}
          subtitle={this.props.agent.agentName}
        />
        <MainTab
          enableTabs={true}
          selectedTab={'sayings'}
          agentForm={Link}
          agentURL={`/agent/${this.props.agent.id}`}
          sayingsForm={
            <Form
              agentId={this.props.agent.id}
              sayings={this.props.sayings}
              agentKeywords={this.props.agentKeywords}
              agentActions={this.props.agentActions}
              agentDomains={this.props.agentDomains}
              agentFilteredDomains={this.props.agentFilteredDomains}
              onAddSaying={this.props.onAddSaying}
              onDeleteSaying={this.props.onDeleteSaying}
              onTagKeyword={this.props.onTagKeyword.bind(null, this.state.filter, this.state.currentPage)}
              onUntagKeyword={this.props.onUntagKeyword.bind(null, this.state.filter, this.state.currentPage)}
              onAddAction={this.props.onAddAction.bind(null, this.state.filter, this.state.currentPage)}
              onDeleteAction={this.props.onDeleteAction.bind(null, this.state.filter, this.state.currentPage)}
              onSearchSaying={this.onSearchSaying}
              onSearchDomain={this.onSearchDomain}
              onGoToUrl={this.props.onGoToUrl}
              onSendSayingToAction={this.props.onSendSayingToAction}
              currentPage={this.state.currentPage}
              numberOfPages={this.getTotalPages()}
              changePage={this.changePage}
              movePageBack={this.movePageBack}
              movePageForward={this.movePageForward}
              onSelectDomain={this.props.onSelectDomain}
              domain={this.props.domain}
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
  onDeleteAction: PropTypes.func,
  onTagKeyword: PropTypes.func,
  onUntagKeyword: PropTypes.func,
  onAddAction: PropTypes.func,
  onGoToUrl: PropTypes.func,
  onSendSayingToAction: PropTypes.func,
  sayings: PropTypes.array,
  totalSayings: PropTypes.number,
  agentDomains: PropTypes.array,
  agentFilteredDomains: PropTypes.array,
  agentKeywords: PropTypes.array,
  agentActions: PropTypes.array,
  onSelectDomain: PropTypes.func,
  domain: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  agent: makeSelectAgent(),
  sayings: makeSelectSayings(),
  totalSayings: makeSelectTotalSayings(),
  agentDomains: makeSelectDomains(),
  agentFilteredDomains: makeSelectFilteredDomains(),
  agentKeywords: makeSelectKeywords(),
  agentActions: makeSelectActions(),
  domain: makeSelectSelectedDomain(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadSayings: (filter, page) => {
      dispatch(loadSayings(filter, page));
    },
    onLoadFilteredDomains: (filter) => {
      dispatch(loadFilteredDomains(filter));
    },
    onLoadDomains: () => {
      dispatch(loadDomains());
    },
    onLoadKeywords: () => {
      dispatch(loadKeywords());
    },
    onLoadActions: () => {
      dispatch(loadActions());
    },
    onAddSaying: (value) => {
      dispatch(addSaying(value));
    },
    onDeleteSaying: (sayingId) => {
      dispatch(deleteSaying(sayingId));
    },
    onTagKeyword: (filter, page, saying, taggedText, keywordId, keywordName) => {
      dispatch(tagKeyword(filter, page, saying, taggedText, keywordId, keywordName));
    },
    onUntagKeyword: (filter, page, saying, start, end) => {
      dispatch(untagKeyword(filter, page, saying, start, end));
    },
    onAddAction: (filter, page, saying, actionName) => {
      dispatch(addActionSaying(filter, page, saying, actionName));
    },
    onDeleteAction: (filter, page, saying, actionName) => {
      dispatch(deleteActionSaying(filter, page, saying, actionName));
    },
    onGoToUrl: (url) => {
      dispatch(push(url));
    },
    onSendSayingToAction: (saying) => {
      dispatch(sendSayingToAction(saying));
    },
    onSelectDomain: (domainName) => {
      dispatch(selectDomain(domainName));
    }
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga({ key: 'sayings', saga });

export default compose(
  withSaga,
  withConnect
)(SayingsPage);
