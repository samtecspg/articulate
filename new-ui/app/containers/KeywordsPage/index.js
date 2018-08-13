/**
 *
 * KeywordsPage
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
  makeSelectKeywords,
  makeSelectTotalKeywords,
} from '../App/selectors';

import {
  loadKeywords,
  deleteKeyword,
} from '../App/actions';

/* eslint-disable react/prefer-stateless-function */
export class KeywordsPage extends React.Component {

  constructor(){
    super();
    this.changePage = this.changePage.bind(this);
    this.movePageBack = this.movePageBack.bind(this);
    this.movePageForward = this.movePageForward.bind(this);
    this.onSearchKeyword = this.onSearchKeyword.bind(this);
    this.getTotalPages = this.getTotalPages.bind(this);
  }

  state = {
    filter: '',
    currentPage: 1,
  }

  componentWillMount() {
    if(this.props.agent.id) {
      this.props.onLoadKeywords('', this.state.currentPage);
    }
    else {
      //TODO: An action when there isn't an agent
      console.log('YOU HAVEN\'T SELECTED AN AGENT');
    }
  }

  getTotalPages(){
    const itemsByPage = 5;
    return Math.ceil(this.props.totalKeywords / itemsByPage);
  }

  changePage(pageNumber){
    this.setState({
        currentPage: pageNumber
    });
    this.props.onLoadKeywords(this.state.filter, pageNumber);
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

  onSearchKeyword(filter){
    this.setState({
      filter
    });
    this.props.onLoadKeywords(filter, this.state.currentPage);
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
          selectedTab={'keywords'}
          agentForm={Link}
          agentURL={`/agent/${this.props.agent.id}`}
          sayingsForm={Link}
          sayingsURL={`/agent/${this.props.agent.id}/sayings`}
          keywordsForm={
            <Form
              agentId={this.props.agent.id}
              onSearchKeyword={this.onSearchKeyword}
              keywords={this.props.keywords}
              onDeleteKeyword={this.props.onDeleteKeyword}
              onCreateKeyword={this.props.onCreateKeyword}
              currentPage={this.state.currentPage}
              numberOfPages={this.state.numberOfPages}
              changePage={this.changePage}
              movePageBack={this.movePageBack}
              movePageForward={this.movePageForward}
            />
          }
        />
      </Grid>
    );
  }
}

KeywordsPage.propTypes = {
  agent: PropTypes.object,
  keywords: PropTypes.array,
  onLoadKeywords: PropTypes.func,
  onDeleteKeyword: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  agent: makeSelectAgent(),
  keywords: makeSelectKeywords(),
  totalKeywords: makeSelectTotalKeywords(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadKeywords: (filter, page) => {
      dispatch(loadKeywords(filter, page));
    },
    onDeleteKeyword: (keywordId) => {
      dispatch(deleteKeyword(keywordId));
    },
    onCreateKeyword: (url) => {
      dispatch(push(url))
    }
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga({ key: 'keywords', saga });

export default compose(
  withSaga,
  withConnect
)(KeywordsPage);
