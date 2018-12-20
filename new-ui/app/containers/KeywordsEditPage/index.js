/**
 *
 * KeywordsEditPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { injectIntl, intlShape } from 'react-intl';
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
  resetStatusFlag,
  changeExampleName,
} from '../App/actions';
import ActionButtons from './Components/ActionButtons';
import { push } from 'react-router-redux';

/* eslint-disable react/prefer-stateless-function */
export class KeywordsEditPage extends React.Component {

  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
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


  state = {
    isNewKeyword: this.props.match.params.keywordId === 'create',
    formError: false,
    errorState: {
      keywordName: false,
      examples: false,
    },
  };

  submit(){
    let errors = false;
    const newErrorState = {
      keywordName: false,
      examples: false,
    };

    if (!this.props.keyword.keywordName || this.props.keyword.keywordName === ''){
      errors = true;
      newErrorState.keywordName = true;
    }
    else {
      newErrorState.keywordName = false;
    }

    if (!this.props.keyword.examples || this.props.keyword.examples.length === 0){
      errors = true;
      newErrorState.examples = true;
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
    const { intl } = this.props;
    return (
      <Grid container>
        <ContentHeader
          title={messages.title}
          subtitle={this.state.isNewKeyword ? intl.formatMessage(messages.newKeyword) : this.props.keyword.keywordName}
          inlineElement={
            <ActionButtons
              formError={this.state.formError}
              agentId={this.props.agent.id}
              onFinishAction={this.submit}
              backButton={messages.backButton}
              goBack={() => {this.props.onGoToUrl(`/agent/${this.props.agent.id}/keywords`)}}
            />
          }
        />
        <Form
          keyword={this.props.keyword}
          onChangeKeywordData={this.props.onChangeKeywordData}
          onAddKeywordExample={this.props.onAddKeywordExample}
          onDeleteKeywordExample={this.props.onDeleteKeywordExample}
          onChangeExampleName={this.props.onChangeExampleName}
          onChangeExampleSynonyms={this.props.onChangeExampleSynonyms}
          errorState={this.state.errorState}
        />
      </Grid>
    );
  }
}

KeywordsEditPage.propTypes = {
  intl: intlShape,
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
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga({ key: 'keywordsEdit', saga });

export default compose(
  injectIntl,
  withSaga,
  withConnect
)(KeywordsEditPage);
