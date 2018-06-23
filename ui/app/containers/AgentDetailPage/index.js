import React from 'react';
import Helmet from 'react-helmet';

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/xml';
import 'brace/mode/json';
import 'brace/theme/terminal';

import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody,
} from 'react-accessible-accordion';

import 'react-accessible-accordion/dist/fancy-example.css';

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
  makeSelectSettingsData,
} from '../App/selectors';

import Responses from './Components/Responses';

import messages from './messages';
import { makeSelectAgentData, makeSelectWebhookData, makeSelectPostFormatData, makeSelectAgentSettingsData } from './selectors';
import { loadAgent, loadWebhook, loadPostFormat, loadAgentSettings } from './actions';

const getLanguageFromCode = (languages, languageCode) => {

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
      this.props.onComponentWillMount(nextProps);
    }
    if ((currentAgent && !this.props.currentAgent)) {
      if (!this.state.webhookLoaded){
        const justWebhook = true;
        this.props.onComponentWillMount(nextProps, justWebhook);
      }
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
    const { loading, error, currentAgent, webhook, postFormat, globalSettings, agentSettings } = this.props;

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
              <FormTextInput
                s={6}
                label={messages.language}
                value={getLanguageFromCode(globalSettings.agentLanguages, currentAgent.language)}
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
              tooltip={messages.domainClassifierThresholdDescription.defaultMessage}
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

          <Form>
            <Row>
              <Accordion>
                <AccordionItem>
                  <AccordionItemTitle>
                    {messages.webhookSettingsTitle.defaultMessage}
                    <div className='accordion_arrow_inverted'></div>
                  </AccordionItemTitle>
                  <AccordionItemBody>
                    <p style={{marginLeft: '-10px'}}>{messages.webhookSettingsDescription.defaultMessage}</p>
                    <Form style={{ marginTop: '30px' }}>
                      {
                        <Row style={{ marginTop: '15px'}}>
                          <Toggle
                            strongLabel={false}
                            label={messages.useWebhook.defaultMessage}
                            checked={currentAgent.useWebhook}
                            disabled
                          />
                        </Row>
                      }
                      {
                        currentAgent.useWebhook && webhook.agent !== '' ?
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
                        : null
                      }
                    </Form>
                  </AccordionItemBody>
                </AccordionItem>
                <AccordionItem>
                  <AccordionItemTitle>
                    {messages.responseDefinitionTitle.defaultMessage}
                    <div className='accordion_arrow_inverted'></div>
                  </AccordionItemTitle>
                  <AccordionItemBody>
                    <p style={{marginLeft: '-10px'}}>{messages.responseDefinitionDescription.defaultMessage}</p>
                    <Form>
                      <Row style={{ marginTop: '15px'}}>
                        <Toggle
                          strongLabel={false}
                          label={messages.usePostformat.defaultMessage}
                          checked={currentAgent.usePostFormat}
                          disabled
                        />
                      </Row>
                      {
                        currentAgent.usePostFormat && postFormat.agent !== '' ?
                            <Row>
                              <AceEditor
                                width="100%"
                                height="250px"
                                mode={'json'}
                                theme="terminal"
                                name="webhookPayload"
                                readOnly={true}
                                onLoad={this.onLoad}
                                fontSize={14}
                                showPrintMargin={true}
                                showGutter={true}
                                highlightActiveLine={true}
                                value={postFormat.postFormatPayload}
                                setOptions={{
                                useWorker: false,
                                showLineNumbers: true,
                                tabSize: 2,
                              }}/>
                            </Row>
                        : null
                      }
                    </Form>
                  </AccordionItemBody>
                </AccordionItem>
                <AccordionItem>
                  <AccordionItemTitle>
                    {messages.agentTrainingSettingsTitle.defaultMessage}
                    <div className='accordion_arrow_inverted'></div>
                  </AccordionItemTitle>
                  <AccordionItemBody>
                    <p style={{marginLeft: '-10px'}}>{messages.agentTrainingSettingsDescription.defaultMessage}</p>
                    <Form style={{marginTop: '30px'}}>
                      <Row>
                        <Toggle
                          disabled
                          inline
                          strongLabel={false}
                          label={messages.expandedTrainingData.defaultMessage}
                          checked={currentAgent.extraTrainingData}
                          onChange={() => {}}
                        />
                      </Row>
                      <Row style={{ marginTop: '15px' }}>
                        <Toggle
                          disabled
                          inline
                          strongLabel={false}
                          label={messages.enableModelsPerDomain.defaultMessage}
                          checked={currentAgent.enableModelsPerDomain}
                          onChange={() => {}}
                        />
                      </Row>
                    </Form>
                  </AccordionItemBody>
                </AccordionItem><AccordionItem>
                  <AccordionItemTitle>
                    {messages.rasaSettingsTitle.defaultMessage}
                    <div className='accordion_arrow_inverted'></div>
                  </AccordionItemTitle>
                  <AccordionItemBody>
                    <p style={{marginLeft: '-10px'}}>{messages.rasaSettingsDescription.defaultMessage}</p>
                    <Form>
                      <Row>
                        <FormTextInput
                          id='rasaURL'
                          label={messages.rasaURL}
                          placeholder={messages.rasaURLPlaceholder.defaultMessage}
                          value={agentSettings.rasaURL}
                          disabled
                        />
                        <InputLabel tooltip={messages.domainClassifierPipelineTooltip.defaultMessage} text={messages.domainClassifierPipeline} />
                        <AceEditor
                          style={{marginBottom: '20px'}}
                          width="100%"
                          height="300px"
                          mode="json"
                          theme="terminal"
                          name="domainClassifierPipeline"
                          readOnly={true}
                          onChange={(value) => this.onChangeInput(value, 'domainClassifierPipeline')}
                          fontSize={14}
                          showPrintMargin={true}
                          showGutter={true}
                          highlightActiveLine={true}
                          value={typeof agentSettings.domainClassifierPipeline === 'string' ?
                                  agentSettings.domainClassifierPipeline :
                                  JSON.stringify(agentSettings.domainClassifierPipeline, null, 2)}
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
                          readOnly={true}
                          onChange={(value) => this.onChangeInput(value, 'intentClassifierPipeline')}
                          fontSize={14}
                          showPrintMargin={true}
                          showGutter={true}
                          highlightActiveLine={true}
                          value={typeof agentSettings.intentClassifierPipeline === 'string' ?
                                  agentSettings.intentClassifierPipeline :
                                  JSON.stringify(agentSettings.intentClassifierPipeline, null, 2)}
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
                            readOnly={true}
                            onChange={(value) => this.onChangeInput(value, 'entityClassifierPipeline')}
                            fontSize={14}
                            showPrintMargin={true}
                            showGutter={true}
                            highlightActiveLine={true}
                            value={typeof agentSettings.entityClassifierPipeline === 'string' ?
                                    agentSettings.entityClassifierPipeline :
                                    JSON.stringify(agentSettings.entityClassifierPipeline, null, 2)}
                            setOptions={{
                              useWorker: true,
                              showLineNumbers: true,
                              tabSize: 2,
                            }} />
                            <InputLabel tooltip={messages.spacyEntitiesTooltip.defaultMessage} text={messages.spacyEntities} />
                            <AceEditor
                              width="100%"
                              height="300px"
                              style={{marginBottom: '20px'}}
                              mode="json"
                              theme="terminal"
                              name="spacyPretrainedEntities"
                              readOnly={true}
                              onChange={(value) => this.onChangeInput(value, 'spacyPretrainedEntities')}
                              fontSize={14}
                              showPrintMargin={true}
                              showGutter={true}
                              highlightActiveLine={true}
                              value={typeof agentSettings.spacyPretrainedEntities === 'string' ?
                                      agentSettings.spacyPretrainedEntities :
                                      JSON.stringify(agentSettings.spacyPretrainedEntities, null, 2)}
                              setOptions={{
                                useWorker: true,
                                showLineNumbers: true,
                                tabSize: 2,
                              }} />
                      </Row>
                    </Form>
                  </AccordionItemBody>
                </AccordionItem>
                <AccordionItem>
                  <AccordionItemTitle>
                    {messages.ducklingSettingsTitle.defaultMessage}
                    <div className='accordion_arrow_inverted'></div>
                  </AccordionItemTitle>
                  <AccordionItemBody>
                    <p style={{marginLeft: '-10px'}}>{messages.ducklingSettingsDescription.defaultMessage}</p>
                    <Form>
                      <Row>
                        <FormTextInput
                          id='ducklingURL'
                          label={messages.ducklingURL}
                          placeholder={messages.ducklingURLPlaceholder.defaultMessage}
                          value={agentSettings.ducklingURL}
                          disabled
                        />
                        <InputLabel tooltip={messages.ducklingDimensionTooltip.defaultMessage} text={messages.ducklingDimension} />
                        <AceEditor
                          style={{marginBottom: '20px'}}
                          width="100%"
                          height="300px"
                          mode="json"
                          theme="terminal"
                          name="ducklingDimension"
                          readOnly={true}
                          onChange={(value) => this.onChangeInput(value, 'ducklingDimension')}
                          fontSize={14}
                          showPrintMargin={true}
                          showGutter={true}
                          highlightActiveLine={true}
                          value={typeof agentSettings.ducklingDimension === 'string' ?
                                  agentSettings.ducklingDimension :
                                  JSON.stringify(agentSettings.ducklingDimension, null, 2)}
                          setOptions={{
                            useWorker: true,
                            showLineNumbers: true,
                            tabSize: 2,
                          }} />
                      </Row>
                    </Form>
                  </AccordionItemBody>
                </AccordionItem>
              </Accordion>
            </Row>
          </Form>
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
        dispatch(loadAgentSettings(props.params.id));
      }
      if (props.currentAgent && props.currentAgent.useWebhook) {
        dispatch(loadWebhook(props.params.id));
      }
      if (props.currentAgent && props.currentAgent.usePostFormat) {
        dispatch(loadPostFormat(props.params.id));
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
  postFormat: makeSelectPostFormatData(),
  globalSettings: makeSelectSettingsData(),
  agentSettings: makeSelectAgentSettingsData(),
});

export default connect(mapStateToProps, mapDispatchToProps)(AgentDetailPage);
