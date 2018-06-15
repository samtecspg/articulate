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
import Alert from 'react-s-alert';
import { createStructuredSelector } from 'reselect';

import ActionButton from '../../components/ActionButton';
import Content from '../../components/Content';
import ContentHeader from '../../components/ContentHeader';
import Form from '../../components/Form';

import FormTextInput from '../../components/FormTextInput';
import Header from '../../components/Header';
import Preloader from '../../components/Preloader';
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

export class GlobalSettingsPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.onChangeInput = this.onChangeInput.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  onChangeInput(evt, field) {
    if (['agentLanguages', 'timezones'].indexOf(field) > -1){
      try {
        const value = JSON.parse(evt); //Ace editor send the value directly to the method as an string
        this.props.onChangeGlobalSettingsData({ value, field });
      } catch(e) {
        const value = evt; //Given the parse of the json failed store the value in the state as a string
        this.props.onChangeGlobalSettingsData({ value, field });
      }
    }
    else{
      if (field === 'defaultAgentFallbackResponses'){
        if (evt.keyCode === 13 && !_.isEmpty(evt.target.value)) { // If user hits enter add response
          this.lastFallbackResponse.scrollIntoView(true);
          const value = this.props.globalSettings.defaultAgentFallbackResponses.concat(evt.target.value);
          this.props.onChangeGlobalSettingsData({ value , field });
          evt.target.value = null;
        }
      }
      else {
        const value = evt.target.value;
        this.props.onChangeGlobalSettingsData({ value , field });
      }
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
    if(Array.isArray(this.props.globalSettings.timezones)){
      if(Array.isArray(this.props.globalSettings.agentLanguages)){
        if(this.props.globalSettings.timezones.indexOf(this.props.globalSettings.defaultTimezone) > -1){
          this.props.onUpdate();
        }
        else {
          Alert.warning(messages.timezoneNotInTimezonesWarningMessage.defaultMessage, {
            position: 'bottom'
          });
        }
      }
      else {
        Alert.warning(messages.agentLanguagesWarningMessage.defaultMessage, {
          position: 'bottom'
        });
      }
    }
    else {
      Alert.warning(messages.timezonesWarningMessage.defaultMessage, {
        position: 'bottom'
      });
    }
  }

  render() {
    const { loading, error, success, globalSettings } = this.props;
    const globalSettingsProps = {
      loading,
      success,
      error,
      globalSettings,
    };

    let breadcrumbs = [
      { label: 'Settings' },
      { label: 'Global' },
    ];
    const contentHeaderTitle = messages.globalSettingsTitle;
    const contentHeaderSubTitle = messages.globalSettingsDescription;
    return (
      <div>
        <Col style={{ zIndex: 2, position: 'fixed', top: '50%', left: '45%' }} s={12}>
          {globalSettingsProps.loading ? <Preloader color='#00ca9f' size='big' /> : null}
        </Col>
        <Helmet
          title={'Global Setttings'}
          meta={[
            { name: 'description', content: 'View/Edit your global settings' },
          ]}
        />
        <Header breadcrumbs={breadcrumbs} actionButtons={
          <ActionButton label={messages.updateSettingsButton} onClick={this.submitForm} />} />
        <Content>
          <ContentHeader title={contentHeaderTitle} subTitle={contentHeaderSubTitle} />
          <Form>
            <Row>
              <Input
                s={12}
                name="uiLanguage"
                type="select"
                label={messages.uiLanguage.defaultMessage}
                value={globalSettings.uiLanguage}
                onChange={(evt) => this.onChangeInput(evt, 'uiLanguage')}
              >
                {returnFormattedOptions(globalSettings.uiLanguages)}
              </Input>
              <Typeahead
                style={{marginBottom: '20px'}}
                id='defaultTimezone'
                name='defaultTimezone'
                maxSearchResults={10}
                callback={(field, evt) => this.onChangeInput(evt, field)}
                label={messages.defaultTimezone.defaultMessage}
                menuClassName={'timezones'}
                dataSource={typeof globalSettings.timezones === 'string' ?
                          [messages.errorParsingOptions.defaultMessage] :
                          globalSettings.timezones}
                value={globalSettings.defaultTimezone}
                tooltip={messages.timezonesTooltip.defaultMessage}
                s={12}
              />
              <Tooltip
                tooltip={messages.agentLanguageTooltip.defaultMessage}
                delay={50}
                position="top"
              >
                <a style={{
                    'top': '29px',
                    'position': 'relative',
                    'left': '209px'
                }}>
                  <Icon tiny>help_outline</Icon>
                </a>
              </Tooltip>
              <Input
                s={12}
                name="defaultAgentLanguage"
                type="select"
                label={messages.defaultAgentLanguage.defaultMessage}
                value={globalSettings.defaultAgentLanguage}
                onChange={(evt) => this.onChangeInput(evt, 'defaultAgentLanguage')}
              >
                {returnFormattedOptions(globalSettings.agentLanguages)}
              </Input>
              {/*<FormTextInput
                id='rasaURL'
                label={messages.rasaURL}
                placeholder={messages.rasaURLPlaceholder.defaultMessage}
                value={globalSettings.rasaURL}
                onChange={(evt) => this.onChangeInput(evt, 'rasaURL')}
                required
              />
              <FormTextInput
                id='ducklingURL'
                label={messages.ducklingURL}
                placeholder={messages.ducklingURLPlaceholder.defaultMessage}
                value={globalSettings.ducklingURL}
                onChange={(evt) => this.onChangeInput(evt, 'ducklingURL')}
                required
              />*/}
              <InputLabel text={messages.timezones} />
              <AceEditor
                style={{marginBottom: '20px'}}
                width="100%"
                height="250px"
                mode="json"
                theme="terminal"
                name="timezones"
                readOnly={false}
                onChange={(value) => this.onChangeInput(value, 'timezones')}
                fontSize={14}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                value={typeof globalSettings.timezones === 'string' ?
                        globalSettings.timezones :
                        JSON.stringify(globalSettings.timezones, null, 2)}
                setOptions={{
                  useWorker: true,
                  showLineNumbers: true,
                  tabSize: 2,
                }} />
              <InputLabel text={messages.agentLanguages} />
              <AceEditor
                width="100%"
                height="250px"
                style={{marginBottom: '20px'}}
                mode="json"
                theme="terminal"
                name="agentLanguages"
                readOnly={false}
                onChange={(value) => this.onChangeInput(value, 'agentLanguages')}
                fontSize={14}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                value={typeof globalSettings.agentLanguages === 'string' ?
                        globalSettings.agentLanguages :
                        JSON.stringify(globalSettings.agentLanguages, null, 2)}
                setOptions={{
                  useWorker: true,
                  showLineNumbers: true,
                  tabSize: 2,
                }} />
            </Row>
          </Form>

          <Form style={{ marginTop: '0px' }}>
            <Row>
              <FormTextInput
                id='fallbacks'
                label={messages.defaultFallback}
                placeholder={messages.defaultFallbackPlaceholder.defaultMessage}
                onKeyDown={(evt) => this.onChangeInput(evt, 'defaultAgentFallbackResponses')}
              />
            </Row>
          </Form>

          {globalSettings.defaultAgentFallbackResponses.length > 0 ?
            <TableContainer id="fallbackResponsesTable" quotes>
              <Table>
                <Responses
                  fallbackResponses={globalSettings.defaultAgentFallbackResponses}
                  onRemoveResponse={this.props.onRemoveFallback}
                />
              </Table>
            </TableContainer>
            : null
          }
          <div style={{ float: 'left', clear: 'both' }} ref={(el) => { this.lastFallbackResponse = el; }}>
          </div>
        </Content>
      </div>
    );
  }
}

GlobalSettingsPage.propTypes = {
  loading: React.PropTypes.bool,
  error: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  globalSettings: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  onChangeGlobalSettingsData: React.PropTypes.func,
  onUpdate: React.PropTypes.func,
  currentAgent: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  onSuccess: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {

    onChangeGlobalSettingsData: (data, evt) => {
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
  globalSettings: makeSelectSettingsData(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
  success: makeSelectSuccess(),
});

export default connect(mapStateToProps, mapDispatchToProps)(GlobalSettingsPage);
