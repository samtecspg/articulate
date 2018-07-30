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
import { makeSelectSayings } from './selectors';

/* eslint-disable react/prefer-stateless-function */
export class SayingsPage extends React.Component {

  constructor(){
    super();
    this.changePage = this.changePage.bind(this);
    this.movePageBack = this.movePageBack.bind(this);
    this.movePageForward = this.movePageForward.bind(this);
    this.onSearchSaying = this.onSearchSaying.bind(this);
  }

  state = {
    filter: '',
    currentPage: 1,
    numberOfPages: 10,
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
    if (this.state.currentPage < this.state.numberOfPages){
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
          agentURL={'/agent/81'}
          sayingsForm={
            <Form
              sayings={this.props.sayings}
              agentKeywords={{
                keywords: [
                  {
                    keywordName: 'Toppings',
                    uiColor: '#f44336'
                  },
                  {
                    keywordName: 'Size',
                    uiColor: '#e91e63'
                  },
                  {
                    keywordName: 'Address',
                    uiColor: '#9575cd'
                  }
                ]
              }}
              onAddSaying={this.props.onAddSaying}
              onDeleteSaying={this.props.onDeleteSaying}
              onDeleteAction={this.props.onDeleteAction}
              onTagEntity={this.props.onTagEntity}
              onDeleteHighlight={this.props.onDeleteHighlight}
              onAddAction={this.props.onAddAction}
              onSearchSaying={this.onSearchSaying}
              onCreateAction={this.props.onCreateAction}
              currentPage={this.state.currentPage}
              numberOfPages={this.state.numberOfPages}
              changePage={this.changePage}
              movePageBack={this.movePageBack}
              movePageForward={this.movePageForward}
            />
          }
          keywordsForm={Link}
          keywordsURL={'/agent/81/keywords'}
        />
      </Grid>
    );
  }
}

SayingsPage.propTypes = {
  onLoadSayings: PropTypes.func,
  onChangeSayingsData: PropTypes.func,
  onDeleteSaying: PropTypes.func,
  onDeleteAction: PropTypes.func,
  onChangePage: PropTypes.func,
  onTagEntity: PropTypes.func,
  onDeleteHighlight: PropTypes.func,
  onAddAction: PropTypes.func,
  onCreateAction: PropTypes.func,
  sayings: PropTypes.array,
  agentKeywords: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  sayings: makeSelectSayings()
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadSayings: (filter, page) => {
      console.log(filter, page);
    },
    onAddSaying: (value) => {
      console.log(value)
    },
    onDeleteSaying: (sayingIndex) => {
      console.log(sayingIndex);
    },
    onDeleteAction: (sayingId, action) => {
      console.log(sayingId, action);
    },
    onChangePage: (pageNumber) => {
      console.log(pageNumber);
    },
    onTagEntity: (userSays, taggedText, entity) => {
      console.log(userSays, taggedText, entity);
    },
    onDeleteHighlight: (userSays, text, start, end) => {
      console.log(userSays, text, start, end);
    },
    onAddAction: (sayingId, actionName) => {
      console.log(sayingId, actionName);
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
