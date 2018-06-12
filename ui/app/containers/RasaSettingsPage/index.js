import React from 'react';
import Helmet from 'react-helmet';

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/json';
import 'brace/theme/terminal';

import {
  Col,
  Row,
  Icon,
  Input,
} from 'react-materialize';

import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Alert from 'react-s-alert';
import { createStructuredSelector } from 'reselect';

import ActionButton from '../../components/ActionButton';
import Content from '../../components/Content';
import ContentHeader from '../../components/ContentHeader';
import Form from '../../components/Form';

import FormTextInput from '../../components/FormTextInput';
import Header from '../../components/Header';
import Preloader from '../../components/Preloader';
import SliderInput from '../../components/SliderInput';
import Toggle from '../../components/Toggle';
import Tooltip from '../../components/Tooltip';
import Typeahead from '../../components/Typeahead';
import InputLabel from '../../components/InputLabel';
import Table from '../../components/Table';
import TableContainer from '../../components/TableContainer';
import Responses from './Components/Responses';

import {
  resetStatusFlags,
  updateSettings,
  loadSettings,
  changeSettingsData,
  resetSettingsData,
  removeSettingsFallback,
} from '../App/actions';
import {
  makeSelectError,
  makeSelectLoading,
  makeSelectSuccess,
  makeSelectSettingsData,
} from '../App/selectors';

import messages from './messages';

const returnFormattedOptions = (options) => {
  try {
    return options.map((option, index) => (
      <option key={index} value={option.value}>
        {option.text}
      </option>
    ));
  }
  catch (e){
    return [
      <option key={0} value={''}>
        {messages.errorParsingOptions.defaultMessage}
      </option>
    ]
  }
};

export class RasaSettingsPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.onChangeInput = this.onChangeInput.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  onChangeInput(evt, field) {
    if (['entityClassifierPipeline', 'intentClassifierPipeline', 'domainClassifierPipeline'].indexOf(field) > -1){
      try {
        const value = JSON.parse(evt); //Ace editor send the value directly to the method as an string
        this.props.onChangeRasaSettingsData({ value, field });
      } catch(e) {
        const value = evt; //Given the parse of the json failed store the value in the state as a string
        this.props.onChangeRasaSettingsData({ value, field });
      }
    }
    else{
      const value = evt.target.value;
      this.props.onChangeRasaSettingsData({ value , field });
    }
  }

  componentWillMount(){
    this.props.onComponentWillMount();
  }

  componentDidUpdate(prevProps, prevState, prevContext) {
    if (this.props.success) {
      Alert.success(messages.successMessageEdit.defaultMessage, {
        position: 'bottom'
      });
      this.props.onSuccess();
    }

    if (this.props.error) {
      Alert.error(this.props.error.message, {
        position: 'bottom'
      });
    }
  }

  submitForm(evt) {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    if(Array.isArray(this.props.rasaSettings.domainClassifierPipeline)){
      if(Array.isArray(this.props.rasaSettings.intentClassifierPipeline)){
        if(Array.isArray(this.props.rasaSettings.entityClassifierPipeline)){
          this.props.onUpdate();
        }
        else {
          Alert.warning(messages.entityClassifierPipelineWarningMessage.defaultMessage, {
            position: 'bottom'
          });
        }
      }
      else {
        Alert.warning(messages.intentClassifierPipelineWarningMessage.defaultMessage, {
          position: 'bottom'
        });
      }
    }
    else {
      Alert.warning(messages.domainClassifierPipelineWarningMessage.defaultMessage, {
        position: 'bottom'
      });
    }
  }

  render() {
    const { loading, error, success, rasaSettings } = this.props;
    const rasaSettingsProps = {
      loading,
      success,
      error,
      rasaSettings,
    };

    let breadcrumbs = [
      { label: 'Settings' },
      { label: 'Rasa' },
    ];
    const contentHeaderTitle = messages.rasaSettingsTitle;
    const contentHeaderSubTitle = messages.rasaSettingsDescription;
    return (
      <div>
        <Col style={{ zIndex: 2, position: 'fixed', top: '50%', left: '45%' }} s={12}>
          {rasaSettingsProps.loading ? <Preloader color='#00ca9f' size='big' /> : null}
        </Col>
        <Helmet
          title={'Rasa Setttings'}
          meta={[
            { name: 'description', content: 'View/Edit your rasa settings' },
          ]}
        />
        <Header breadcrumbs={breadcrumbs} actionButtons={
          <ActionButton label={messages.updateSettingsButton} onClick={this.submitForm} />} />
        <Content>
          <ContentHeader title={contentHeaderTitle} subTitle={contentHeaderSubTitle} />
          <Form>
            <Row>
              <FormTextInput
                id='rasaURL'
                label={messages.rasaURL}
                placeholder={messages.rasaURLPlaceholder.defaultMessage}
                value={rasaSettings.rasaURL}
                onChange={(evt) => this.onChangeInput(evt, 'rasaURL')}
                required
              />{/*
              <FormTextInput
                id='ducklingURL'
                label={messages.ducklingURL}
                placeholder={messages.ducklingURLPlaceholder.defaultMessage}
                value={rasaSettings.ducklingURL}
                onChange={(evt) => this.onChangeInput(evt, 'ducklingURL')}
                required
              />*/}
              <InputLabel tooltip={messages.domainClassifierPipelineTooltip.defaultMessage} text={messages.domainClassifierPipeline} />
              <AceEditor
                style={{marginBottom: '20px'}}
                width="100%"
                height="300px"
                mode="json"
                theme="terminal"
                name="domainClassifierPipeline"
                readOnly={false}
                onChange={(value) => this.onChangeInput(value, 'domainClassifierPipeline')}
                fontSize={14}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                value={typeof rasaSettings.domainClassifierPipeline === 'string' ?
                        rasaSettings.domainClassifierPipeline :
                        JSON.stringify(rasaSettings.domainClassifierPipeline, null, 2)}
                setOptions={{
                  useWorker: true,
                  showLineNumbers: true,
                  tabSize: 2,
                }} />
              <InputLabel tooltip={messages.intentClassifierPipelineTooltip.defaultMessage} text={messages.intentClassifierPipeline} />
              <AceEditor
                width="100%"
                height="300px"
                style={{marginBottom: '20px'}}
                mode="json"
                theme="terminal"
                name="intentClassifierPipeline"
                readOnly={false}
                onChange={(value) => this.onChangeInput(value, 'intentClassifierPipeline')}
                fontSize={14}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                value={typeof rasaSettings.intentClassifierPipeline === 'string' ?
                        rasaSettings.intentClassifierPipeline :
                        JSON.stringify(rasaSettings.intentClassifierPipeline, null, 2)}
                setOptions={{
                  useWorker: true,
                  showLineNumbers: true,
                  tabSize: 2,
                }} />
                <InputLabel tooltip={messages.entityClassifierPipelineTooltip.defaultMessage} text={messages.entityClassifierPipeline} />
                <AceEditor
                  width="100%"
                  height="300px"
                  style={{marginBottom: '20px'}}
                  mode="json"
                  theme="terminal"
                  name="entityClassifierPipeline"
                  readOnly={false}
                  onChange={(value) => this.onChangeInput(value, 'entityClassifierPipeline')}
                  fontSize={14}
                  showPrintMargin={true}
                  showGutter={true}
                  highlightActiveLine={true}
                  value={typeof rasaSettings.entityClassifierPipeline === 'string' ?
                          rasaSettings.entityClassifierPipeline :
                          JSON.stringify(rasaSettings.entityClassifierPipeline, null, 2)}
                  setOptions={{
                    useWorker: true,
                    showLineNumbers: true,
                    tabSize: 2,
                  }} />
            </Row>
          </Form>
        </Content>
      </div>
    );
  }
}

RasaSettingsPage.propTypes = {
  loading: React.PropTypes.bool,
  error: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  rasaSettings: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  onChangeRasaSettingsData: React.PropTypes.func,
  onUpdate: React.PropTypes.func,
  currentAgent: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  onSuccess: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {

    onChangeRasaSettingsData: (data, evt) => {
      dispatch(resetStatusFlags());
      dispatch(changeSettingsData(data));
    },
    onUpdate: () => {
      dispatch(updateSettings());
    },
    onSuccess: () => {
      dispatch(resetStatusFlags());
    },
    onComponentWillMount: () => {
      dispatch(resetSettingsData());
      dispatch(loadSettings());
    },
    onRemoveFallback: (fallbackIndex) => {
      dispatch(removeSettingsFallback(fallbackIndex));
    }
  };
}

const mapStateToProps = createStructuredSelector({
  rasaSettings: makeSelectSettingsData(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
  success: makeSelectSuccess(),
});

export default connect(mapStateToProps, mapDispatchToProps)(RasaSettingsPage);
