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

import { Grid, CircularProgress } from '@material-ui/core';
import MainTab from './Components/MainTab';
import KeywordForm from './Components/KeywordForm';
import ValuesForm from './Components/ValuesForm';

import injectSaga from 'utils/injectSaga';
import saga from './saga';

import {
  makeSelectKeyword,
  makeSelectAgent,
  makeSelectSuccessKeyword,
  makeSelectSettings,
  makeSelectKeywords,
  makeSelectLoading,
  makeSelectKeywordTouched,
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
  addNewModifier,
  changeModifierName,
  changeModifierData,
  addModifierSaying,
  deleteModifierSaying,
  sortModifiers,
  deleteModifier,
  untagModifierKeyword,
  tagModifierKeyword,
  onChangeModifiersSayingsPageSize,
  loadSettings,
  loadKeywords
} from '../App/actions';
import ModifiersForm from './Components/ModifiersForm';

/* eslint-disable react/prefer-stateless-function */
export class KeywordsEditPage extends React.Component {
  
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.moveNextTab = this.moveNextTab.bind(this);
    this.onChangeTab = this.onChangeTab.bind(this);
    this.initForm = this.initForm.bind(this);
  }

  state = {
    isNewKeyword: this.props.match.params.keywordId === 'create',
    currentTab: 'keyword',
    userCompletedAllRequiredFields: false,
    formError: false,
    exitAfterSubmit: false,
    errorState: {
      keywordName: false,
      examples: false,
      modifiers: [],
      tabs: [],
      modifiersTabs: [],
    },
  };

  initForm(){
    if(this.state.isNewKeyword) {
      this.props.onResetData();
    }
    else {
      this.props.onLoadKeyword(this.props.match.params.keywordId);
      this.props.onLoadKeywords();
    }
    this.props.onLoadSettings();
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
    if (this.props.success){ 
      if (this.state.exitAfterSubmit) {
        this.props.onSuccess(`/agent/${this.props.agent.id}/dialogue?tab=keywords`);
      }
      if (this.state.isNewKeyword) {
        this.setState({
          isNewKeyword: false,
        });
        this.props.onLoadKeywords();
      }
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

  submit(exit){
    let errors = false;
    const newErrorState = {
      keywordName: false,
      examples: false,
      modifiers: [],
      tabs: [],
      modifiersTabs: [],
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

    if (this.props.keyword.modifiers.length > 0){
      this.props.keyword.modifiers.forEach((modifier, modifierIndex) => {
        const newModifierError = {
          modifierName: false,
          action: false,
          sourceValue: false,
          staticValue: false,
        };
        if (!modifier.modifierName){
          errors = true;
          newModifierError.modifierName = true;
          newErrorState.tabs.push(2);
          newErrorState.modifiersTabs.push(modifierIndex);
        }
        else{
          newModifierError.modifierName = false;
        }
        if (!modifier.action){
          errors = true;
          newModifierError.action = true;
          newErrorState.tabs.push(2);
          newErrorState.modifiersTabs.push(modifierIndex);
        }
        else{
          newModifierError.action = false;
        }
        if (!modifier.valueSource){
          errors = true;
          newModifierError.valueSource = true;
          newErrorState.tabs.push(2);
          newErrorState.modifiersTabs.push(modifierIndex);
        }
        else{
          newModifierError.valueSource = false;
        }
        if (modifier.valueSource && modifier.valueSource === 'static' && !modifier.staticValue){
          errors = true;
          newModifierError.staticValue = true;
          newErrorState.tabs.push(2);
          newErrorState.modifiersTabs.push(modifierIndex);
        }
        else{
          newModifierError.staticValue = false;
        }
        newErrorState.modifiers.push(newModifierError);
      });
    }

    if (!errors){
      this.setState({
        formError: false,
        exitAfterSubmit: exit,
        errorState: {...newErrorState},
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
      this.props.settings && this.props.agent.id && this.props.agentKeywords ?
      <Grid container>
        <MainTab
          touched={this.props.touched}
          loading={this.props.loading}
          success={this.props.success}
          goBack={() => {this.props.onGoToUrl(`/agent/${this.props.agent.id}/dialogue?tab=keywords`)}}
          onSaveAndExit={() => { this.submit(true) }}
          newKeyword={this.state.isNewKeyword}
          keywordName={this.props.keyword.keywordName}
          formError={this.state.formError}
          hideFinishButton={this.state.currentTab === 'keyword' && !this.state.userCompletedAllRequiredFields}
          isLastTab={this.state.currentTab === 'modifiers'}
          onFinishAction={() => { this.submit(false) }}
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
          modifiersForm={
            <ModifiersForm
              keyword={this.props.keyword}
              settings={this.props.settings}
              onChangeModifierData={this.props.onChangeModifierData}
              onAddModifierSaying={this.props.onAddModifierSaying}
              onDeleteModifierSaying={this.props.onDeleteModifierSaying}
              onAddNewModifier={this.props.onAddNewModifier}
              onChangeModifierName={this.props.onChangeModifierName}
              errorState={this.state.errorState}
              newKeyword={this.state.isNewKeyword}
              onSortModifiers={this.props.onSortModifiers}
              onDeleteModifier={this.props.onDeleteModifier}
              onDelete={this.props.onDelete.bind(null, this.props.keyword.id)}
              agentKeywords={this.props.agentKeywords}
              onUntagModifierKeyword={this.props.onUntagModifierKeyword}
              onTagModifierKeyword={this.props.onTagModifierKeyword}
              modifierSayingsPageSize={this.props.agent.settings.modifierSayingsPageSize}
              onChangeModifiersSayingsPageSize={this.props.onChangeModifiersSayingsPageSize.bind(null, this.props.agent.id)}
            />
          }
          onChangeTab={this.onChangeTab}
        />
      </Grid> : 
      <CircularProgress style={{position: 'absolute', top: '40%', left: '49%'}}/>
    );
  }
}

KeywordsEditPage.propTypes = {
  agent: PropTypes.object,
  keywords: PropTypes.object,
  settings: PropTypes.object,
  onResetData: PropTypes.func,
  onLoadKeyword: PropTypes.func,
  onCreateKeyword: PropTypes.func,
  onUpdateKeyword: PropTypes.func,
  onChangeKeywordData: PropTypes.func,
  onAddKeywordExample: PropTypes.func,
  onDeleteKeywordExample: PropTypes.func,
  onChangeExampleSynonyms: PropTypes.func,
  onDelete: PropTypes.func,
  newModifier: PropTypes.object,
  onChangeModifierData: PropTypes.func,
  onAddNewModifier: PropTypes.func,
  onChangeModifierName: PropTypes.func,
  onSortModifiers: PropTypes.func,
  onDeleteModifier: PropTypes.func,
  onUntagModifierKeyword: PropTypes.func,
  agentKeywords: PropTypes.array,
  loading: PropTypes.bool,
  success: PropTypes.bool,
  touched: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  agent: makeSelectAgent(),
  keyword: makeSelectKeyword(),
  settings: makeSelectSettings(),
  agentKeywords: makeSelectKeywords(),
  success: makeSelectSuccessKeyword(),
  loading: makeSelectLoading(),
  touched: makeSelectKeywordTouched(),
});

function mapDispatchToProps(dispatch) {
  return {
    onResetData: () => {
      dispatch(resetKeywordData());
    },
    onLoadKeyword: (id) => {
      dispatch(loadKeyword(id));
    },
    onLoadKeywords: () => {
      dispatch(loadKeywords());
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
    onAddNewModifier: () => {
      dispatch(addNewModifier());
    },
    onChangeModifierName: (modifierIndex, modifierName) => {
      dispatch(changeModifierName({modifierIndex, modifierName}));
    },
    onChangeModifierData: (modifierIndex, field, value) => {
      dispatch(changeModifierData({modifierIndex, field, value}))
    },
    onAddModifierSaying: (modifierIndex, newSaying) => {
      dispatch(addModifierSaying(modifierIndex, newSaying))
    },
    onDeleteModifierSaying: (modifierIndex, sayingIndex) => {
      dispatch(deleteModifierSaying({modifierIndex, sayingIndex}));
    },
    onSortModifiers: (oldIndex, newIndex) => {
      dispatch(sortModifiers(oldIndex, newIndex));
    },
    onDeleteModifier: (modifierIndex) => {
      dispatch(deleteModifier(modifierIndex));
    },
    onTagModifierKeyword: (modifierIndex, sayingIndex, value, start, end, keywordId, keywordName) => {
      dispatch(tagModifierKeyword(modifierIndex, sayingIndex, value, start, end, keywordId, keywordName));
    },
    onUntagModifierKeyword: (modifierIndex, sayingIndex, start, end) => {
      dispatch(untagModifierKeyword(modifierIndex, sayingIndex, start, end));
    },
    onChangeModifiersSayingsPageSize: (agentId, pageSize) => {
      dispatch(onChangeModifiersSayingsPageSize(agentId, pageSize));
    },
    onLoadSettings: () => {
      dispatch(loadSettings())
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
