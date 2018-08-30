/**
 *
 * KeywordsEditPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
  makeSelectKeyword,
  makeSelectAgent,
  makeSelectSuccess,
} from '../App/selectors';

import {
  changeKeywordData,
  addKeywordExample,
  deleteKeywordExample,
  loadKeyword,
  resetKeywordData,
  createKeyword,
  updateKeyword,
  changeExampleSynonyms,
  resetStatusFlag
} from '../App/actions';
import ActionButtons from './Components/ActionButtons';
import { push } from 'react-router-redux';

/* eslint-disable react/prefer-stateless-function */
export class KeywordsEditPage extends React.Component {

  componentDidMount() {
    if(this.state.isNewKeyword) {
      this.props.onResetData();
    }
    else {
      this.props.onLoadKeyword(this.props.match.params.keywordId);
    }
  }

  componentDidUpdate() {
    console.log(this.props.success);
    if (this.props.success) {
      this.props.onSuccess(`/agent/${this.props.agent.id}/keywords`);
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
          subtitle={this.props.agent.agentName}
          inlineElement={
            <ActionButtons
              agentId={this.props.agent.id}
              onFinishAction={this.state.isNewKeyword ? this.props.onCreateKeyword.bind(null, this.props.agent.id) : this.props.onUpdateKeyword.bind(null, this.props.agent.id)}
            />
          }
          backButton={messages.backButton}


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
              keyword={this.props.keyword}
              onChangeKeywordData={this.props.onChangeKeywordData}
              onAddKeywordExample={this.props.onAddKeywordExample}
              onDeleteKeywordExample={this.props.onDeleteKeywordExample}
              onChangeExampleSynonyms={this.props.onChangeExampleSynonyms}
            />
          }
        />
      </Grid>
    );
  }
}

KeywordsEditPage.propTypes = {
  agent: PropTypes.object,
  keywords: PropTypes.object,
  onResetData: PropTypes.func,
  onLoadKeyword: PropTypes.func,
  onCreateKeyword: PropTypes.func,
  onUpdateKeyword: PropTypes.func,
  onChangeKeywordData: PropTypes.func,
  onAddKeywordExample: PropTypes.func,
  onDeleteKeywordExample: PropTypes.func,
  onChangeExampleSynonyms: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  agent: makeSelectAgent(),
  keyword: makeSelectKeyword(),
  success: makeSelectSuccess()
});

function mapDispatchToProps(dispatch) {
  return {
    onResetData: () => {
      dispatch(resetKeywordData());
    },
    onLoadKeyword: (id) => {
      dispatch(loadKeyword(id));
    },
    onCreateKeyword: (agentId) => {
      dispatch(createKeyword());
    },
    onUpdateKeyword: (agentId) => {
      dispatch(updateKeyword());
    },
    onChangeKeywordData: (field, value) => {
      dispatch(changeKeywordData({field, value}));
    },
    onAddKeywordExample: (newExample) => {
      dispatch(addKeywordExample(newExample));
    },
    onDeleteKeywordExample: (exampleIndex) => {
      dispatch(deleteKeywordExample(exampleIndex));
    },
    onChangeExampleSynonyms: (exampleIndex, synonyms) => {
      dispatch(changeExampleSynonyms(exampleIndex, synonyms));
    },
    onSuccess: (url) => {
      dispatch(resetStatusFlag());
      dispatch(push(url));
    },
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
