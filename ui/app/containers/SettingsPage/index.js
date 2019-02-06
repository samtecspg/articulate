/**
 *
 * SettingsPage
 *
 */

import { Grid, CircularProgress } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import ContentHeader from '../../components/ContentHeader';
import injectSaga from '../../utils/injectSaga';
import {
  addFallbackResponse,
  changeSettingsData,
  deleteFallbackResponse,
  loadSettings,
  updateSettings,
} from '../App/actions';
import { makeSelectSettings } from '../App/selectors';
import ActionButtons from './Components/ActionButtons';
import Form from './Components/Form';
import messages from './messages';
import saga from './saga';

/* eslint-disable react/prefer-stateless-function */
export class SettingsPage extends React.PureComponent {

  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  componentWillMount() {
    this.props.onLoadSettings();
  }

  state = {
    formError: false,
    errorState: {
      rasaURL: false,
      ducklingURL: false,
      defaultUISessionId: false,
      ducklingDimension: false,
      categoryClassifierPipeline: false,
      sayingClassifierPipeline: false,
      keywordClassifierPipeline: false,
      spacyPretrainedEntities: false,
      timezones: false,
      agentLanguages: false,
      uiLanguages: false,
      defaultTimezone: false,
      defaultAgentFallbackResponses: false,
    },
  };

  submit() {
    let errors = false;
    const newErrorState = {
      rasaURL: false,
      ducklingURL: false,
      defaultUISessionId: false,
      ducklingDimension: false,
      categoryClassifierPipeline: false,
      sayingClassifierPipeline: false,
      keywordClassifierPipeline: false,
      spacyPretrainedEntities: false,
      timezones: false,
      agentLanguages: false,
      uiLanguages: false,
      defaultTimezone: false,
      defaultAgentLanguage: false,
      uiLanguage: false,
      defaultAgentFallbackResponses: false,
    };
    
    if (!this.props.settings.defaultUISessionId || this.props.settings.defaultUISessionId === '') {
      errors = true;
      newErrorState.defaultUISessionId = true;
    } else {
      newErrorState.defaultUISessionId = false;
    }

    if (!this.props.settings.rasaURL || this.props.settings.rasaURL === '') {
      errors = true;
      newErrorState.rasaURL = true;
    } else {
      newErrorState.rasaURL = false;
    }

    if (!this.props.settings.ducklingURL || this.props.settings.ducklingURL === '') {
      errors = true;
      newErrorState.ducklingURL = true;
    } else {
      newErrorState.ducklingURL = false;
    }

    if (!this.props.settings.defaultAgentFallbackResponses || this.props.settings.defaultAgentFallbackResponses.length === 0) {
      errors = true;
      newErrorState.defaultAgentFallbackResponses = true;
    } else {
      newErrorState.defaultAgentFallbackResponses = false;
    }

    if (!Array.isArray(this.props.settings.agentLanguages) ||
      (Array.isArray(this.props.settings.agentLanguages) &&
        this.props.settings.agentLanguages.filter((agentLanguage) => agentLanguage.value === this.props.settings.defaultAgentLanguage).length === 0) ||
      !this.props.settings.defaultAgentLanguage || this.props.settings.defaultAgentLanguage === '') {
      errors = true;
      newErrorState.defaultAgentLanguage = true;
    } else {
      newErrorState.defaultAgentLanguage = false;
    }

    if (!Array.isArray(this.props.settings.uiLanguages) ||
      (Array.isArray(this.props.settings.uiLanguages) &&
        this.props.settings.uiLanguages.filter((uiLanguage) => uiLanguage.value === this.props.settings.uiLanguage).length === 0) ||
      !this.props.settings.uiLanguage || this.props.settings.uiLanguage === '') {
      errors = true;
      newErrorState.uiLanguage = true;
    } else {
      newErrorState.uiLanguage = false;
    }

    if (!Array.isArray(this.props.settings.timezones) ||
      (Array.isArray(this.props.settings.timezones) &&
        this.props.settings.timezones.indexOf(this.props.settings.defaultTimezone) === -1) ||
      !this.props.settings.defaultTimezone || this.props.settings.defaultTimezone === '') {
      errors = true;
      newErrorState.defaultTimezone = true;
    } else {
      newErrorState.defaultTimezone = false;
    }

    try {
      if (!Array.isArray(this.props.settings.ducklingDimension)) {
        throw 'Duckling dimensions is not an array';
      }
      newErrorState.ducklingDimension = false;
    } catch (e) {
      errors = true;
      newErrorState.ducklingDimension = true;
    }

    try {
      if (!Array.isArray(this.props.settings.categoryClassifierPipeline)) {
        throw 'Category classifier pipeline is not an array';
      }
      newErrorState.categoryClassifierPipeline = false;
    } catch (e) {
      errors = true;
      newErrorState.categoryClassifierPipeline = true;
    }

    try {
      if (!Array.isArray(this.props.settings.sayingClassifierPipeline)) {
        throw 'Saying classifier pipeline is not an array';
      }
      newErrorState.sayingClassifierPipeline = false;
    } catch (e) {
      errors = true;
      newErrorState.sayingClassifierPipeline = true;
    }

    try {
      if (!Array.isArray(this.props.settings.keywordClassifierPipeline)) {
        throw 'Keyword classifier pipeline is not an array';
      }
      newErrorState.keywordClassifierPipeline = false;
    } catch (e) {
      errors = true;
      newErrorState.keywordClassifierPipeline = true;
    }

    try {
      if (!Array.isArray(this.props.settings.spacyPretrainedEntities)) {
        throw 'Spacy pretrained entities is not an array';
      }
      newErrorState.spacyPretrainedEntities = false;
    } catch (e) {
      errors = true;
      newErrorState.spacyPretrainedEntities = true;
    }

    try {
      if (!Array.isArray(this.props.settings.timezones)) {
        throw 'Timezones is not an array';
      }
      newErrorState.timezones = false;
    } catch (e) {
      errors = true;
      newErrorState.timezones = true;
    }

    try {
      if (!Array.isArray(this.props.settings.agentLanguages)) {
        throw 'Agent languages is not an array of object';
      }
      newErrorState.agentLanguages = false;
    } catch (e) {
      errors = true;
      newErrorState.agentLanguages = true;
    }

    try {
      if (!Array.isArray(this.props.settings.uiLanguages)) {
        throw 'UI languages is not an array of object';
      }
      newErrorState.uiLanguages = false;
    } catch (e) {
      errors = true;
      newErrorState.uiLanguages = true;
    }

    if (!errors) {
      this.setState({
        formError: false,
      });
      this.props.onSaveChanges();
    } else {
      this.setState({
        formError: true,
        errorState: { ...newErrorState },
      });
    }
  }

  render() {
    return (
      this.props.settings.defaultUISessionId ?
      <Grid container>
        <ContentHeader
          title={messages.title}
          subtitle={messages.createSubtitle}
          inlineElement={
            <ActionButtons
              formError={this.state.formError}
              onFinishAction={this.submit}
            />
          }
        />
        <Form
          settings={this.props.settings}
          onChangeSettingsData={this.props.onChangeSettingsData}
          onAddFallbackResponse={this.props.onAddFallbackResponse}
          onDeleteFallbackResponse={this.props.onDeleteFallbackResponse}
          errorState={this.state.errorState}
        />
      </Grid> : 
      <CircularProgress style={{position: 'absolute', top: '40%', left: '49%'}}/>
    );
  }
}

SettingsPage.propTypes = {
  settings: PropTypes.object,
  onChangeSettingsData: PropTypes.func,
  onSaveChanges: PropTypes.func,
  onAddFallbackResponse: PropTypes.func.isRequired,
  onDeleteFallbackResponse: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  settings: makeSelectSettings(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadSettings: () => {
      dispatch(loadSettings());
    },
    onChangeSettingsData: (field, value) => {
      dispatch(changeSettingsData({ field, value }));
    },
    onSaveChanges: () => {
      dispatch(updateSettings());
    },
    onAddFallbackResponse: (newFallback) => {
      dispatch(addFallbackResponse(newFallback));
    },
    onDeleteFallbackResponse: (fallbackIndex) => {
      dispatch(deleteFallbackResponse(fallbackIndex));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga({ key: 'settings', saga });

export default compose(
  withSaga,
  withConnect,
)(SettingsPage);
