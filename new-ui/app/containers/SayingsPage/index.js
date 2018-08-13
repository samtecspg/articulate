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
  makeSelectSayings,
  makeSelectAgent,
  makeSelectTotalSayings
} from '../App/selectors';
import {
  loadSayings,
  addSaying,
  deleteSaying,
  tagKeyword,
  untagKeyword,
  addAction,
  deleteAction,
} from '../App/actions';

/* eslint-disable react/prefer-stateless-function */
export class SayingsPage extends React.Component {

  constructor(){
    super();
    this.changePage = this.changePage.bind(this);
    this.movePageBack = this.movePageBack.bind(this);
    this.movePageForward = this.movePageForward.bind(this);
    this.onSearchSaying = this.onSearchSaying.bind(this);
    this.getTotalPages = this.getTotalPages.bind(this);
  }

  state = {
    filter: '',
    currentPage: 1,
  }

  componentWillMount() {
    if(this.props.agent.id) {
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

  render() {
    return (
      <Grid container>
        <ContentHeader
          title={messages.title}
          subtitle={'Pizza Agent'}
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
              agentKeywords={{
                keywords: [
                  {
                    id: 1,
                    keywordName: 'Topping',
                    uiColor: '#f44336'
                  }
                ]
              }}
              onAddSaying={this.props.onAddSaying}
              onDeleteSaying={this.props.onDeleteSaying}
              onTagKeyword={this.props.onTagKeyword.bind(null, this.state.filter, this.state.currentPage)}
              onUntagKeyword={this.props.onUntagKeyword.bind(null, this.state.filter, this.state.currentPage)}
              onAddAction={this.props.onAddAction.bind(null, this.state.filter, this.state.currentPage)}
              onDeleteAction={this.props.onDeleteAction.bind(null, this.state.filter, this.state.currentPage)}
              onSearchSaying={this.onSearchSaying}
              onCreateAction={this.props.onCreateAction}
              currentPage={this.state.currentPage}
              numberOfPages={this.getTotalPages()}
              changePage={this.changePage}
              movePageBack={this.movePageBack}
              movePageForward={this.movePageForward}
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
  onChangeSayingsData: PropTypes.func,
  onDeleteSaying: PropTypes.func,
  onDeleteAction: PropTypes.func,
  onTagKeyword: PropTypes.func,
  onUntagKeyword: PropTypes.func,
  onAddAction: PropTypes.func,
  onCreateAction: PropTypes.func,
  sayings: PropTypes.array,
  totalSayings: PropTypes.number,
  agentKeywords: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  agent: makeSelectAgent(),
  sayings: makeSelectSayings(),
  totalSayings: makeSelectTotalSayings(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadSayings: (filter, page) => {
      dispatch(loadSayings(filter, page));
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
      dispatch(addAction(filter, page, saying, actionName));
    },
    onDeleteAction: (filter, page, saying, actionName) => {
      dispatch(deleteAction(filter, page, saying, actionName));
    },
    onCreateAction: (url) => {
      dispatch(push(url));
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
