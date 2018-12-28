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

import { Grid } from '@material-ui/core';
import MainTab from './Components/MainTab';
import KeywordForm from './Components/KeywordForm';
import ValuesForm from './Components/ValuesForm';

import injectSaga from 'utils/injectSaga';
import saga from './saga';

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
  resetStatusFlag,
  changeExampleName,
  deleteKeyword,
} from '../App/actions';

/* eslint-disable react/prefer-stateless-function */
export class KeywordsEditPage extends React.Component {
  
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.moveNextTab = this.moveNextTab.bind(this);
    this.onChangeTab = this.onChangeTab.bind(this);
  }

  componentDidMount() {
    if(this.state.isNewKeyword) {
      this.props.onResetData();
    }
    else {
      this.props.onLoadKeyword(this.props.match.params.keywordId);
    }
  }

  componentDidUpdate() {
    if (this.props.success) {
      this.props.onSuccess(`/agent/${this.props.agent.id}/keywords`);
    }
  }

  moveNextTab(){
    // If isn't currently on the last tab
    if (this.state.currentTab !== 'modifiers'){
      const tabs = ['keyword', 'values', 'modifiers'];
      const currentTab = tabs.indexOf(this.state.currentTab);
      const nextTab = currentTab + 1;
      this.setState({
        currentTab: tabs[nextTab],
      })
    }
  }

  onChangeTab(tab){
    this.setState({
      currentTab: tab,
    });
  }


  state = {
    isNewKeyword: this.props.match.params.keywordId === 'create',
    currentTab: 'keyword',
    userCompletedAllRequiredFields: false,
    formError: false,
    errorState: {
      keywordName: false,
      examples: false,
      tabs: [],
    },
  };

  submit(){
    let errors = false;
    const newErrorState = {
      keywordName: false,
      examples: false,
      tabs: [],
    };

    if (!this.props.keyword.keywordName || this.props.keyword.keywordName === ''){
      errors = true;
      newErrorState.keywordName = true;
      newErrorState.tabs.push(0);
    }
    else {
      newErrorState.keywordName = false;
    }

    if (!this.props.keyword.examples || this.props.keyword.examples.length === 0){
      errors = true;
      newErrorState.examples = true;
      newErrorState.tabs.push(1);
    }
    else {
      newErrorState.examples = false;
    }

    if (!errors){
      this.setState({
        formError: false,
      });
      if (this.state.isNewKeyword){
        this.props.onCreateKeyword();
      }
      else {
        this.props.onUpdateKeyword();
      }
    }
    else {
      this.setState({
        formError: true,
        errorState: {...newErrorState},
      });
    }
  }

  render() {
    return (
      <Grid container>
        <MainTab
          goBack={() => {this.props.onGoToUrl(`/agent/${this.props.agent.id}/keywords`)}}
          newKeyword={this.state.isNewKeyword}
          keywordName={this.props.keyword.keywordName}
          formError={this.state.formError}
          hideFinishButton={this.state.currentTab === 'keyword' && !this.state.userCompletedAllRequiredFields}
          isLastTab={this.state.currentTab === 'modifiers'}
          onFinishAction={this.submit}
          onNextAction={this.moveNextTab}
          selectedTab={this.state.currentTab}
          errorState={this.state.errorState}
          keywordForm={
            <KeywordForm
              keyword={this.props.keyword}
              onChangeKeywordData={this.props.onChangeKeywordData}
              errorState={this.state.errorState}
              newKeyword={this.state.isNewKeyword}
              onDelete={this.props.onDelete.bind(null, this.props.keyword.id)}
            />
          }
          valuesForm={
            <ValuesForm
              keyword={this.props.keyword}
              onChangeKeywordData={this.props.onChangeKeywordData}
              onAddKeywordExample={this.props.onAddKeywordExample}
              onDeleteKeywordExample={this.props.onDeleteKeywordExample}
              onChangeExampleName={this.props.onChangeExampleName}
              onChangeExampleSynonyms={this.props.onChangeExampleSynonyms}
              errorState={this.state.errorState}
              newKeyword={this.state.isNewKeyword}
              onDelete={this.props.onDelete.bind(null, this.props.keyword.id)}
            />
          }
          onChangeTab={this.onChangeTab}
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
  onDelete: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  agent: makeSelectAgent(),
  keyword: makeSelectKeyword(),
  success: makeSelectSuccess(),
});

function mapDispatchToProps(dispatch) {
  return {
    onResetData: () => {
      dispatch(resetKeywordData());
    },
    onLoadKeyword: (id) => {
      dispatch(loadKeyword(id));
    },
    onCreateKeyword: () => {
      dispatch(createKeyword());
    },
    onUpdateKeyword: () => {
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
    onChangeExampleName: (exampleIndex, name) => {
      dispatch(changeExampleName(exampleIndex, name));
    },
    onChangeExampleSynonyms: (exampleIndex, synonyms) => {
      dispatch(changeExampleSynonyms(exampleIndex, synonyms));
    },
    onSuccess: (url) => {
      dispatch(resetStatusFlag());
      dispatch(push(url));
    },
    onGoToUrl: (url) => {
      dispatch(push(url));
    },
    onDelete: (id) => {
      dispatch(deleteKeyword(id));
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
