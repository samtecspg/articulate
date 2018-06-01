import React from 'react';
import Helmet from 'react-helmet';
import {
  Col,
  Input,
  Row,
  Icon,
} from 'react-materialize';

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/xml';
import 'brace/mode/json';
import 'brace/theme/terminal';

import { connect } from 'react-redux';
import Alert from 'react-s-alert';
import { createStructuredSelector } from 'reselect';
import ActionButton from '../../components/ActionButton';
import Content from '../../components/Content';
import ContentHeader from '../../components/ContentHeader';
import ContentSubHeader from '../../components/ContentSubHeader';
import Form from '../../components/Form';
import ConfirmationModal from '../../components/ConfirmationModal';
import InputLabel from '../../components/InputLabel';
import Typeahead from '../../components/Typeahead';

import FormTextInput from '../../components/FormTextInput';
import Header from '../../components/Header';
import Preloader from '../../components/Preloader';
import SliderInput from '../../components/SliderInput';
import Toggle from '../../components/Toggle';
import Tooltip from '../../components/Tooltip';

import Table from '../../components/Table';
import TableContainer from '../../components/TableContainer';

import Responses from './Components/Responses';

import {
  createAgent,
  resetStatusFlags,
  updateAgent,
} from '../App/actions';
import {
  makeSelectError,
  makeSelectInWizard,
  makeSelectLoading,
  makeSelectSuccess,
} from '../App/selectors';
import {
  changeAgentData,
  changeWebhookData,
  loadAgent,
  resetAgentData,
  removeAgentFallback,
  loadWebhook,
  changePostFormatData,
  loadPostFormat
} from './actions';

import messages from './messages';

import languages from 'languages';
import timezones from 'timezones';

import { makeSelectAgentData, makeSelectTouched, makeSelectWebhookData, makeSelectPostFormatData } from './selectors';

const sampleData = [
  {
    value: 'smallTalk',
    text: 'Small Talk Agent',
  },
  {
    value: 'customerService',
    text: 'Customer Service Agent',
  },
  {
    value: 'bookings',
    text: 'Bookings Agent',
  },
];

const verbs = [
  {
    value: 'GET',
    text: 'GET',
  },
  {
    value: 'PUT',
    text: 'PUT',
  },
  {
    value: 'POST',
    text: 'POST',
  },
  {
    value: 'DELETE',
    text: 'DELETE',
  },
  {
    value: 'PATCH',
    text: 'PATCH',
  },
];

const payloadTypes = [
  {
    value: 'None',
    text: 'None',
  },
  {
    value: 'JSON',
    text: 'JSON',
  },
  {
    value: 'XML',
    text: 'XML',
  },
  {
    value: 'URL Encoded',
    text: 'URL Encoded',
  },
];

const returnFormattedOptions = (options) => options.map((option, index) => (
  <option key={index} value={option.value}>
    {option.text}
  </option>
));

export class AgentPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.setEditMode = this.setEditMode.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.routerWillLeave = this.routerWillLeave.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onLeave = this.onLeave.bind(this);
  }

  state = {
    editMode: false,
    displayModal: false,
    clickedSave: false,
    waitingForConfirm: false,
    nextRoute: null,
  };

  componentWillMount() {
    sampleData.unshift({ value: 'none', text: messages.sampleDataPlaceholder.defaultMessage, disabled: 'disabled' });
  }

  componentDidMount() {
    this.setEditMode(this.props.route.name === 'agentEdit');
    this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave);

    document.getElementById('agentName').focus();
  }

  componentDidUpdate(prevProps, prevState, prevContext) {
    if (this.props.route !== prevProps.route) {
      this.setEditMode(this.props.route.name === 'agentEdit');
    }
    if (this.props.success) {
      Alert.success(this.state.editMode ? messages.successMessageEdit.defaultMessage : messages.successMessage.defaultMessage, {
        position: 'bottom'
      });
      this.props.onSuccess.bind(null, this.props.inWizard)();
    }

    if (this.props.error) {
      Alert.error(this.props.error.message, {
        position: 'bottom'
      });
    }
  }

  setEditMode(isEditMode) {
    if (isEditMode) {
      this.setState({ editMode: true });
      this.props.onEditMode(this.props);
    } else {
      this.setState({ editMode: false });
      this.props.resetForm();
    }
  }

  submitForm(evt) {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    this.state.clickedSave = true;
    if (this.props.agent.useWebhook && this.props.webhook.webhookUrl === '') {
      Alert.warning(messages.missingWebhookUrl.defaultMessage, {
        position: 'bottom'
      });
    }
    else if (this.props.agent.usePostFormat && this.props.postFormat.postFormatPayload === '') {
      this.props.onChangePostFormatData("postFormatPayloadDefault", messages.defaultPostFormat);
      Alert.warning(messages.missingPostFormatPayload.defaultMessage, {
        position: 'bottom'
      });
    }
    else {
      if (timezones.indexOf(this.props.agent.timezone) === -1) {
        Alert.error(messages.invalidTimezone.defaultMessage, {
          position: 'bottom'
        });
      }
      else {
        if (this.state.editMode) {
          this.props.onUpdate();
        } else {
          this.props.onCreate();
        }


      }
    }
  }

  onChangeInput(evt, field) {
    let value;
    if (evt) {
      value = evt.target.value;
    } else {
      value = null;
    }
    if (field === 'fallbackResponses') {
      if (evt.keyCode === 13 && !_.isEmpty(value)) { // If user hits enter add response
        if (field === 'fallbackResponses') {
          this.lastAgentResponse.scrollIntoView(true);
        }
        this.props.onChangeAgentData(field, evt);
        evt.target.value = null;
      }
    }
  }

  routerWillLeave(route) {
    if (!this.state.waitingForConfirm && this.props.touched && !this.state.clickedSave) {
      this.state.nextRoute = route;
      this.state.displayModal = true;
      this.state.waitingForConfirm = true;
      this.forceUpdate();
      return false;
    }
  }

  onLeave() {
    this.props.resetForm();
    this.props.router.push(this.state.nextRoute.pathname);
  }

  onDismiss() {
    this.setState({
      displayModal: false,
      waitingForConfirm: false,
    });
  }

  render() {
    const { loading, error, success, agent, match, webhook, postFormat } = this.props;
    const agentProps = {
      loading,
      error,
      success,
      agent,
      match
    };

    const breadcrumbs = [{ label: 'Agent' },];
    if (this.state.editMode) {
      breadcrumbs.push({ label: 'Edit' })
    } else {
      breadcrumbs.push({ label: '+ Create' })
    }

    return (
      <div>
        <Col style={{ zIndex: 2, position: 'fixed', top: '50%', left: '45%' }} s={12}>
          {agentProps.loading ? <Preloader color='#00ca9f' size='big' /> : null}
        </Col>
        <Helmet
          title="Create Agent"
          meta={[
            { name: 'description', content: 'Create your NLU agent' },
          ]}
        />
        <Header breadcrumbs={breadcrumbs} actionButtons={<ActionButton label={this.state.editMode ? messages.editButton : messages.createButton} onClick={this.submitForm} />} />
        <Content>
          <ContentHeader title={messages.createAgentTitle} subTitle={messages.createDescription} />
          <Form>
            <Row>
              <FormTextInput
                id='agentName'
                label={messages.agentName}
                placeholder={messages.agentNamePlaceholder.defaultMessage}
                inputId="agentName"
                onChange={this.props.onChangeAgentData.bind(null, 'agentName')}
                value={agent.agentName}
                required
              />
              <FormTextInput
                label={messages.description}
                placeholder={messages.descriptionPlaceholder.defaultMessage}
                inputId="description"
                onChange={this.props.onChangeAgentData.bind(null, 'description')}
                value={agent.description}
              />
              {/*<Input
                s={12}
                name="sampleData"
                type="select"
                label={messages.sampleData.defaultMessage}
                onChange={this.props.onChangeAgentData.bind(null, 'sampleData')}
              >
                {returnFormattedOptions(sampleData)}
              </Input>*/}
              <Input
                s={6}
                name="language"
                type="select"
                label={messages.language.defaultMessage}
                value={agent.language}
                onChange={this.props.onChangeAgentData.bind(null, 'language')}
              >
                {returnFormattedOptions(languages)}
              </Input>
              <Typeahead
                id='timezone'
                name='timezone'
                maxSearchResults={10}
                callback={this.props.onChangeAgentData}
                label={messages.timezone.defaultMessage}
                value={agent.timezone}
                s={6}
              />
            </Row>
          </Form>

          <Row>
            <br />
            <SliderInput
              label={messages.domainClassifierThreshold}
              tooltip={messages.domainClassifierThresholdDescription.defaultMessage}
              id="domainClassifierThreshold"
              min="0"
              max="100"
              onChange={this.props.onChangeAgentData.bind(null, 'domainClassifierThreshold')}
              value={agent.domainClassifierThreshold.toString()}
            />
          </Row>

          <Form style={{ marginTop: '0px' }}>
            <Row>
              <FormTextInput
                id='fallbacks'
                label={messages.agentFallbackTitle}
                placeholder={messages.fallbackInput.defaultMessage}
                onKeyDown={(evt) => this.onChangeInput(evt, 'fallbackResponses')}
              />
            </Row>
          </Form>

          {agent.fallbackResponses.length > 0 ?
            <TableContainer id="fallbackResponsesTable" quotes>
              <Table>
                <Responses
                  fallbackResponses={agent.fallbackResponses}
                  onRemoveResponse={this.props.onRemoveFallback}
                />
              </Table>
            </TableContainer>
            : null
          }

          <div style={{ float: 'left', clear: 'both' }} ref={(el) => { this.lastAgentResponse = el; }}>
          </div>

          <Form style={{ marginTop: '30px' }}>
            <Row>
              <Toggle
                inline
                strongLabel={false}
                label={messages.expandedTrainingData.defaultMessage}
                onChange={this.props.onChangeAgentData.bind(null, 'extraTrainingData')}
                checked={agent.extraTrainingData}
              />
              &nbsp;
              <Tooltip
                tooltip={messages.expandedTrainingDataTooltip.defaultMessage}
                delay={50}
                position="top"
              >
                <a>
                  <Icon>help_outline</Icon>
                </a>
              </Tooltip>
            </Row>
          </Form>


          <Row style={{ marginTop: '15px', float: 'left', clear : 'both'}}>
            <Toggle
              label={messages.useWebhook.defaultMessage}
              right
              onChange={this.props.onChangeAgentData.bind(null, 'useWebhook')}
              checked={agent.useWebhook}
            />
          </Row>


          {
            agent.useWebhook ?
              <Form style={{ marginTop: '70px' }}>
                <Row>
                  <Input
                    s={2}
                    name="webhookVerb"
                    type="select"
                    label={messages.webhookVerb.defaultMessage}
                    value={webhook.webhookVerb}
                    onChange={this.props.onChangeWebhookData.bind(null, 'webhookVerb')}
                  >
                    {returnFormattedOptions(verbs)}
                  </Input>
                  <FormTextInput
                    label={messages.webhookUrl}
                    placeholder={messages.webhookUrlPlaceholder.defaultMessage}
                    inputId="description"
                    onChange={this.props.onChangeWebhookData.bind(null, 'webhookUrl')}
                    value={webhook.webhookUrl}
                    s={8}
                  />
                  <Input
                    s={2}
                    name="webhookPayloadType"
                    type="select"
                    label={messages.webhookPayloadType.defaultMessage}
                    value={webhook.webhookPayloadType}
                    onChange={this.props.onChangeWebhookData.bind(null, 'webhookPayloadType')}
                  >
                    {returnFormattedOptions(payloadTypes)}
                  </Input>
                  {webhook.webhookPayloadType !== 'None' ?
                    (<AceEditor
                      width="100%"
                      height="250px"
                      mode={webhook.webhookPayloadType === 'JSON' ? 'json' : 'xml'}
                      theme="terminal"
                      name="webhookPayload"
                      readOnly={false}
                      onLoad={this.onLoad}
                      onChange={this.props.onChangeWebhookData.bind(null, 'webhookPayload')}
                      fontSize={14}
                      showPrintMargin={true}
                      showGutter={true}
                      highlightActiveLine={true}
                      value={webhook.webhookPayload}
                      setOptions={{
                        useWorker: false,
                        showLineNumbers: true,
                        tabSize: 2,
                      }} />) : null}
                </Row>
              </Form>
              : null
          }
          <Row style={{ marginTop: '15px', float: 'left', clear: 'both'}}>
            <Toggle
              label={messages.usePostformat.defaultMessage}
              right
              onChange={this.props.onChangeAgentData.bind(null, 'usePostFormat')}
              checked={agent.usePostFormat}
            />
          </Row>

          {
            agent.usePostFormat ?
              <Form style={{ marginTop: '100px' }}>
                <Row>
                  <AceEditor
                    width="100%"
                    height="250px"
                    mode={'json'}
                    theme="terminal"
                    name="webhookPayload"
                    readOnly={false}
                    onLoad={this.onLoad}
                    onChange={this.props.onChangePostFormatData.bind(null, 'postFormatPayload')}
                    fontSize={14}
                    showPrintMargin={true}
                    showGutter={true}
                    highlightActiveLine={true}
                    value={postFormat.postFormatPayload}
                    setOptions={{
                      useWorker: false,
                      showLineNumbers: true,
                      tabSize: 2,
                    }} />
                </Row>
              </Form>
              : null
          }



          <br />
        </Content>
        <ConfirmationModal
          isOpen={this.state.displayModal}
          onLeave={this.onLeave}
          onDismiss={this.onDismiss}
          contentBody='You have not saved your edits to this agent. If you leave you will lose your current work.'
        />
      </div>
    );
  }
}

AgentPage.propTypes = {
  loading: React.PropTypes.bool,
  error: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  agent: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  onCreate: React.PropTypes.func,
  onUpdate: React.PropTypes.func,
  onChangeAgentData: React.PropTypes.func,
  onChangeWebhookData: React.PropTypes.func,
  onChangePostFormatData: React.PropTypes.func,
  resetForm: React.PropTypes.func,
  onSuccess: React.PropTypes.func,
  onEditMode: React.PropTypes.func,
  onRemoveFallback: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onChangeAgentData: (field, evt) => {
      dispatch(resetStatusFlags());
      if (field === 'useWebhook' || field === 'extraTrainingData' || field === 'usePostFormat') {
        evt.target.value = evt.target.checked;
      }
      dispatch(changeAgentData({ value: evt.target.value, field }));
    },
    onChangeWebhookData: (field, evt) => {
      dispatch(resetStatusFlags());
      if (field === 'webhookPayload') {
        const value = evt;
        dispatch(changeWebhookData({ value, field }));
      }
      else {
        dispatch(changeWebhookData({ value: evt.target.value, field }));
      }
    },
    onChangePostFormatData: (field, evt) => {
      if (field === 'postFormatPayloadDefault') {
        let field = 'postFormatPayload'
        dispatch(changePostFormatData({ value: messages.defaultPostFormat.defaultMessage, field }))
      }
      if (field === 'postFormatPayload') {
        const value = evt;
        dispatch(changePostFormatData({ value, field }));
      }

    },
    onCreate: () => {
      dispatch(createAgent());
    },
    onUpdate: () => {
      dispatch(updateAgent());
    },
    resetForm: () => {
      dispatch(resetAgentData());
    },
    onSuccess: (inWizard) => {

    },
    onEditMode: (props) => {
      dispatch(resetStatusFlags());
      dispatch(resetAgentData());
      dispatch(loadAgent(props.params.id));
      if (props.agent.useWebhook) {
        dispatch(loadWebhook(props.params.id));
      }
      if (props.agent.usePostFormat) {
        dispatch(loadPostFormat(props.params.id));
      }

    },
    onRemoveFallback: (fallbackIndex) => {
      dispatch(removeAgentFallback(fallbackIndex));
    }
  };
}

const mapStateToProps = createStructuredSelector({
  agent: makeSelectAgentData(),
  webhook: makeSelectWebhookData(),
  loading: makeSelectLoading(),
  touched: makeSelectTouched(),
  success: makeSelectSuccess(),
  inWizard: makeSelectInWizard(),
  error: makeSelectError(),
  postFormat: makeSelectPostFormatData()
});

export default connect(mapStateToProps, mapDispatchToProps)(AgentPage);
