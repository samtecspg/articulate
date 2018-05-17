import React from 'react';
import Helmet from 'react-helmet';

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/xml';
import 'brace/mode/json';
import 'brace/theme/terminal';

import {
  Col,
  Row,
} from 'react-materialize';
import { connect } from 'react-redux';
import Alert from 'react-s-alert';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import Content from '../../components/Content';
import DeleteModal from '../../components/DeleteModal';
import Form from '../../components/Form';
import FormTextInput from '../../components/FormTextInput';
import Header from '../../components/Header';

import ContentSubHeader from '../../components/ContentSubHeader';
import Preloader from '../../components/Preloader';
import SliderInput from '../../components/SliderInput';
import InputLabel from '../../components/InputLabel';
import EditDeleteButton from '../../components/EditDeleteButton';
import Toggle from '../../components/Toggle';

import Table from '../../components/Table';
import TableContainer from '../../components/TableContainer';

import {
  deleteAgent,
} from '../App/actions';
import {
  makeSelectError,
  makeSelectLoading,
  makeSelectCurrentAgent,
} from '../App/selectors';

import Responses from './Components/Responses';

import messages from './messages';
import { makeSelectAgentData, makeSelectWebhookData } from './selectors';
import { loadAgent, loadWebhook } from './actions';

import languages from 'languages';

const getLanguageFromCode = (languageCode) => {

  return _.filter(languages, (language) => {

    return language.value === languageCode;
  })[0].text;
};

export class AgentDetailPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor() {
    super();
    this.onDeletePrompt = this.onDeletePrompt.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onDeleteDismiss = this.onDeleteDismiss.bind(this);
  }

  state = {
    deleteModalOpen: false,
    webhookLoaded: false,
  };

  componentWillMount() {
    const { currentAgent, agent } = this.props;
    if (!currentAgent) {
      this.props.onComponentWillMount(this.props);
    }
    else {
      if (currentAgent.id !== agent.id){
        this.props.onComponentWillMount(this.props);
      }
      else{
        if (!this.state.webhookLoaded){
          const justWebhook = true;
          this.props.onComponentWillMount(this.props, justWebhook);
        }
      }
    }
  }

  componentWillUpdate(nextProps) {
    const { currentAgent } = nextProps;
    if ((currentAgent && this.props.currentAgent) && (currentAgent.id !== this.props.currentAgent.id)) {
      this.props.onComponentWillMount(currentAgent.id);
    }
  }

  componentDidUpdate(){

    if (this.props.error) {
      Alert.error(this.props.error.message, {
        position: 'bottom'
      });
    }
  }

  onDeletePrompt() {
    this.setState({
      deleteModalOpen: true,
    });
  }

  onDelete() {
    const { currentAgent } = this.props;
    this.props.onDeleteAgent(currentAgent);
    this.onDeleteDismiss();
  }

  onDeleteDismiss() {
    this.setState({
      deleteModalOpen: false,
    });
  }

  render() {
    const { loading, error, currentAgent, webhook } = this.props;

    const agentProps = {
      loading,
      error,
      currentAgent,
    };

    let breadcrumbs = [];

    if (!currentAgent) {
      return (<div>&nbsp;</div>);
    }
    else {
      breadcrumbs = [
        { label: 'Agent' },
        { label: `${currentAgent.agentName}` },
      ];
    }

    return (
      <div>
        <Col style={{ zIndex: 2, position: 'fixed', top: '50%', left: '45%' }} s={12}>
          {agentProps.loading ? <Preloader color='#00ca9f' size='big' /> : null}
        </Col>
        <Helmet
          title={`Agent: ${currentAgent.agentName}`}
          meta={[
            { name: 'description', content: `Details for NLU Agent ${currentAgent.agentName}` },
          ]}
        />
        <Header
          breadcrumbs={breadcrumbs} actionButtons={
          <div className="btn-edit-delete">
            <EditDeleteButton
              label={messages.editButton} iconName="edit" onClick={() => {
              this.props.onChangeUrl(`/agent/${this.props.currentAgent.id}/edit`);
            }}
            />
            <EditDeleteButton label={messages.deleteButton} iconName="delete" onClick={this.onDeletePrompt} />
          </div>
        }
        />
        <Content>
          <Row>
            <header className="main-title">
              <h1>
                <span>{messages.detailTitle.defaultMessage}{currentAgent.agentName}</span>
              </h1>
              <p>
                <span>{currentAgent.description}</span>
              </p>
            </header>
          </Row>
          <Row>
            <Form>
              <FormTextInput
                label={messages.agentName}
                value={currentAgent.agentName}
                disabled
              />
              <FormTextInput
                label={messages.description}
                placeholder={messages.descriptionPlaceholder.defaultMessage}
                value={currentAgent.description}
                disabled
              />
              {/*<FormTextInput
                label={messages.sampleData}
                defaultValue={currentAgent.sampleData}
                disabled
              />*/}
              <FormTextInput
                s={6}
                label={messages.language}
                value={getLanguageFromCode(currentAgent.language)}
                disabled
              />
              <FormTextInput
                s={6}
                label={messages.timezone}
                value={currentAgent.timezone}
                disabled
              />
            </Form>
          </Row>

          <Row>
            <br />
            <SliderInput
              label={messages.domainClassifierThreshold}
              min="0"
              max="100"
              value={(currentAgent.domainClassifierThreshold * 100).toString()}
              onChange={() => {
              }}
              disabled
            />
          </Row>

          <Row>
            <Form style={{ marginTop: '0px' }}>
              <InputLabel s={12} text={messages.agentFallbackTitle} />
            </Form>
          </Row>

          {currentAgent.fallbackResponses.length > 0 ?
            <TableContainer id="fallbackResponsesTable" quotes>
              <Table>
                <Responses
                  fallbackResponses={currentAgent.fallbackResponses}
                />
              </Table>
            </TableContainer>
            : null
          }

          {
            currentAgent.useWebhook && webhook.agent !== '' ? <ContentSubHeader title={messages.webhook} /> : null
          }
          {
            currentAgent.useWebhook && webhook.agent !== '' ?
              <Form style={{marginTop: '0px'}}>
                <Row>
                  <FormTextInput
                    s={2}
                    label={messages.webhookVerb}
                    value={webhook.webhookVerb}
                    disabled
                  />
                  <FormTextInput
                    label={messages.webhookUrl}
                    value={webhook.webhookUrl}
                    s={8}
                    disabled
                  />
                  <FormTextInput
                    s={2}
                    label={messages.webhookPayloadType}
                    value={webhook.webhookPayloadType}
                    disabled
                  />
                  {webhook.webhookPayloadType !== 'None' ?
                  (<AceEditor
                    width="100%"
                    height="250px"
                    mode={webhook.webhookPayloadType === 'JSON' ? 'json' : 'xml'}
                    theme="terminal"
                    name="webhookPayload"
                    readOnly={true}
                    onLoad={this.onLoad}
                    fontSize={14}
                    showPrintMargin={true}
                    showGutter={true}
                    highlightActiveLine={true}
                    value={webhook.webhookPayload}
                    setOptions={{
                    useWorker: false,
                    showLineNumbers: true,
                    tabSize: 2,
                    }}/>) : null}
                </Row>
              </Form>
            : null
          }
        </Content>
        <DeleteModal
          isOpen={this.state.deleteModalOpen}
          onDelete={this.onDelete}
          onDismiss={this.onDeleteDismiss}
        />
      </div>
    );
  }
}

AgentDetailPage.propTypes = {
  loading: React.PropTypes.bool,
  error: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  currentAgent: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  onComponentWillMount: React.PropTypes.func,
  onDeleteAgent: React.PropTypes.func,
  onChangeUrl: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onComponentWillMount: (props, justWebhook) => {
      if (!justWebhook){
        dispatch(loadAgent(props.params.id));
      }
      if (props.agent.useWebhook) {
        dispatch(loadWebhook(props.params.id));
      }
    },
    onDeleteAgent: (agent) => dispatch(deleteAgent(agent.id)),
    onChangeUrl: (url) => dispatch(push(url)),
  };
}

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  error: makeSelectError(),
  currentAgent: makeSelectCurrentAgent(),
  agent: makeSelectAgentData(),
  webhook: makeSelectWebhookData(),
});

export default connect(mapStateToProps, mapDispatchToProps)(AgentDetailPage);
