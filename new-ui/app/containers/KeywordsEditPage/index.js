/**
 *
 * KeywordsEditPage
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
import { makeSelectKeyword } from './selectors';

/* eslint-disable react/prefer-stateless-function */
export class KeywordsEditPage extends React.Component {

  componentDidMount() {
    if(this.state.isNewKeyword) {
      this.props.onResetData();
    }
    else {
      this.props.onLoadAction(this.props.match.params.id);
    }
  }

  state = {
    isNewKeyword: this.props.match.params.keywordId === 'create'
  };

  render() {
    return (
      <Grid container>
        <ContentHeader
          title={messages.title}
          subtitle={'Pizza Agent'}
        />
        <MainTab
          enableTabs={true}
          selectedTab={'keywords'}
          agentForm={Link}
          agentURL={'/agent/81'}
          sayingsForm={Link}
          sayingsURL={'/agent/81/sayings'}
          keywordsForm={
            <Form
              onSearchKeyword={this.onSearchKeyword}
              keyword={this.props.keyword}
              onChangeKeywordData={this.props.onChangeKeywordData}
            />
          }
        />
      </Grid>
    );
  }
}

KeywordsEditPage.propTypes = {
  keywords: PropTypes.object,
  onLoadKeywords: PropTypes.func,
  onDeleteKeyword: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  keyword: makeSelectKeyword()
});

function mapDispatchToProps(dispatch) {
  return {
    onResetData: () => {
      console.log('reset data');
    },
    onLoadKeywords: (filter, page) => {
      console.log(filter, page);
    },
    onDeleteKeyword: (keywordIndex) => {
      console.log(keywordIndex);
    },
    onCreateKeyword: (url) => {
      dispatch(push(url))
    },
    onChangeKeywordData: (field, value) => {
      console.log(field, value);
    }
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga({ key: 'keywordsEdit', saga });

export default compose(
  withSaga,
  withConnect
)(KeywordsEditPage);
