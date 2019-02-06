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
import { Grid, CircularProgress } from '@material-ui/core';
import MainTab from 'components/MainTab';
import Form from './Components/Form';

import injectSaga from 'utils/injectSaga';
import saga from './saga';
import {
  makeSelectAgent,
  makeSelectKeywords,
  makeSelectTotalKeywords,
  makeSelectLocale,
} from '../App/selectors';

import {
  loadKeywords,
  trainAgent,
  changeKeywordsPageSize,
} from '../App/actions';

/* eslint-disable react/prefer-stateless-function */
export class KeywordsPage extends React.Component {

  constructor(props){
    super(props);
    this.changePage = this.changePage.bind(this);
    this.movePageBack = this.movePageBack.bind(this);
    this.movePageForward = this.movePageForward.bind(this);
    this.onSearchKeyword = this.onSearchKeyword.bind(this);
    this.setNumberOfPages = this.setNumberOfPages.bind(this);
    this.changePageSize = this.changePageSize.bind(this);
    this.initForm = this.initForm.bind(this);
  }

  state = {
    filter: '',
    currentPage: 1,
    pageSize: this.props.agent.id ? this.props.agent.settings.keywordsPageSize : 5,
    numberOfPages: null,
    totalKeywords: null,
  };

  initForm(){
    this.setState({ pageSize: this.props.agent.settings.keywordsPageSize });
    this.props.onLoadKeywords('', this.state.currentPage, this.state.pageSize);
  }

  componentWillMount() {
    if(this.props.agent.id) {
      this.initForm();
    }
  }

  componentDidUpdate(prevProps){
    if (!prevProps.agent.id && this.props.agent.id){
      this.initForm();
    }
    if (this.props.totalKeywords !== this.state.totalKeywords){
      this.setState({
        totalKeywords: this.props.totalKeywords,
      });
      this.setNumberOfPages(this.state.pageSize);
    }
  }

  setNumberOfPages(pageSize){
    const numberOfPages = Math.ceil(this.props.totalKeywords / pageSize);
    this.setState({
      numberOfPages,
    });
  }

  changePage(pageNumber){
    this.setState({
      currentPage: pageNumber,
    });
    this.props.onLoadKeywords(this.state.filter, pageNumber, this.state.pageSize);
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
    if (this.state.currentPage < this.state.numberOfPages){
      newPage = this.state.currentPage + 1;
    }
    this.changePage(newPage);
  }

  changePageSize(pageSize){
    this.setState({
      currentPage: 1,
      pageSize,
    });
    this.props.onChangeKeywordsPageSize(this.props.agent.id, pageSize);
    this.props.onLoadKeywords(this.state.filter, 1, pageSize);
  }

  onSearchKeyword(filter){
    this.setState({
      filter,
    });
    this.props.onLoadKeywords(filter, this.state.currentPage, this.state.pageSize);
  }

  render() {
    return (
      this.props.agent.id ?
      <Grid container>
        <MainTab
          locale={this.props.locale}
          disableSave
          agentName={this.props.agent.agentName}
          onTrain={this.props.onTrain}
          agentStatus={this.props.agent.status}
          lastTraining={this.props.agent.lastTraining}
          enableTabs
          selectedTab="keywords"
          agentForm={Link}
          agentURL={`/agent/${this.props.agent.id}`}
          reviewURL={`/agent/${this.props.agent.id}/review`}
          reviewForm={Link}
          sayingsForm={Link}
          sayingsURL={`/agent/${this.props.agent.id}/sayings`}
          keywordsForm={
            <Form
              agentId={this.props.agent.id}
              onSearchKeyword={this.onSearchKeyword}
              keywords={this.props.keywords}
              onCreateKeyword={this.props.onCreateKeyword}
              currentPage={this.state.currentPage}
              pageSize={this.state.pageSize}
              numberOfPages={this.state.numberOfPages}
              changePage={this.changePage}
              changePageSize={this.changePageSize}
              movePageBack={this.movePageBack}
              movePageForward={this.movePageForward}
              onGoToUrl={this.props.onGoToUrl}
            />
          }
        />
      </Grid> : 
      <CircularProgress style={{position: 'absolute', top: '40%', left: '49%'}}/>
    );
  }
}

KeywordsPage.propTypes = {
  agent: PropTypes.object,
  keywords: PropTypes.array,
  onLoadKeywords: PropTypes.func,
  onTrain: PropTypes.func,
  onGoToUrl: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  agent: makeSelectAgent(),
  keywords: makeSelectKeywords(),
  totalKeywords: makeSelectTotalKeywords(),
  locale: makeSelectLocale(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadKeywords: (filter, page, pageSize) => {
      dispatch(loadKeywords(filter, page, pageSize));
    },
    onCreateKeyword: (url) => {
      dispatch(push(url))
    },
    onTrain: () => {
      dispatch(trainAgent());
    },
    onChangeKeywordsPageSize: (agentId, pageSize) => {
      dispatch(changeKeywordsPageSize(agentId, pageSize));
    },
    onGoToUrl: (url) => {
      dispatch(push(url));
    },
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
