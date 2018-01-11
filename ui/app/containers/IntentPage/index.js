import _ from 'lodash';
/* eslint-disable consistent-return */
import React from 'react';
import Helmet from 'react-helmet';
import {
  Input,
  Row,
  Col,
} from 'react-materialize';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Alert from 'react-s-alert';
import ActionButton from '../../components/ActionButton';
import Content from '../../components/Content';
import ContentHeader from '../../components/ContentHeader';
import Form from '../../components/Form';
import FormTextInput from '../../components/FormTextInput';
import Header from '../../components/Header';
import InputLabel from '../../components/InputLabel';
import Table from '../../components/Table';
import TableContainer from '../../components/TableContainer';
import TableHeader from '../../components/TableHeader';
import Preloader from '../../components/Preloader';
import Toggle from '../../components/Toggle';

import {
  createIntent,
  loadAgentDomains,
  loadAgentEntities,
  resetStatusFlags,
} from '../../containers/App/actions';
import {
  makeSelectAgentDomains,
  makeSelectAgentEntities,
  makeSelectCurrentAgent,
  makeSelectError,
  makeSelectSuccess,
  makeSelectIntent,
  makeSelectLoading,
  makeSelectScenario,
} from '../../containers/App/selectors';

import {
  addTextPrompt,
  changeIntentData,
  changeSlotName,
  deleteTextPrompt,
  tagEntity,
  toggleFlag,
  resetIntentData,
  removeUserSaying,
  removeAgentResponse,
  removeSlot,
} from './actions';
import AvailableSlots from './Components/AvailableSlots';
import Responses from './Components/Responses';
import Slots from './Components/Slots';
import UserSayings from './Components/UserSayings';

import messages from './messages';
import {
  makeSelectIntentData,
  makeSelectScenarioData,
} from './selectors';

const returnFormattedOptions = (options) => options.map((option, index) => (
  <option key={index} value={option.value}>
    {option.text}
  </option>
));

const dirOfColors = {};

export class IntentPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.onChangeInput = this.onChangeInput.bind(this);
  }

  componentWillMount() {
    this.props.resetForm();
    const { currentAgent } = this.props;
    if (currentAgent) {
      this.props.onChangeIntentData('agent', `${currentAgent.id}~${currentAgent.agentName}`); // TODO: Remove this format and pass the entire object
    }
  }

  componentWillUpdate(nextProps) {
    const { currentAgent } = nextProps;
    if (currentAgent !== this.props.currentAgent) {
      this.props.onChangeIntentData('agent', `${currentAgent.id}~${currentAgent.agentName}`); // TODO: Remove this format and pass the entire object
    }
  }

  onChangeInput(evt, field) {
    let value;
    if (evt) {
      value = evt.target.type === 'checkbox' ? evt.target.checked : evt.target.value;
    } else {
      value = null;
    }
    if (field === 'examples' || field === 'responses') {
      if (evt.charCode === 13 && !_.isEmpty(value)) { // If user hits enter add response
        if (field === 'responses'){
          this.lastAgentResponse.scrollIntoView(true);
        }
        this.props.onChangeIntentData(field, value);
        evt.target.value = null;
      }
      if (field === 'responses') {
        if (evt.charCode === 123) { // If user hits '{' display a menu with current slots
          const dropDownButton = document.getElementById('intentResponseEntityDropdown');
          dropDownButton.dispatchEvent(new Event('click'));
        }
      }
    } else {
      this.props.onChangeIntentData(field, value);
    }
  }

  componentDidUpdate() {
    if (this.props.success){
      Alert.success(messages.successMessage.defaultMessage, {
          position: 'bottom'
      });
      this.props.onSuccess();
    }

    if (this.props.error){
      Alert.error(this.props.error.message, {
          position: 'bottom'
      });
    }
  }

  render() {
    const { loading, error, success, intent, scenario, agentDomains, agentEntities, currentAgent } = this.props;
    const intentProps = {
      loading,
      error,
      success,
      intent,
    };

    let domainsSelect = [];
    if (agentDomains !== false) {
      domainsSelect = agentDomains.map((domain) => ({
        value: `${domain.id}~${domain.domainName}`,
        text: domain.domainName,
      }));
      domainsSelect.unshift({ value: 'default', text: 'Please choose a domain to place your intent', disabled: 'disabled' });
    }

    let breadcrumbs = [];
    if (currentAgent){
      breadcrumbs = [{ link: `/agent/${currentAgent.id}`, label: `Agent: ${currentAgent.agentName}`}, { label: '+ Creating intents'},];
    }
    else {
      breadcrumbs = [{ label: '+ Creating intents'}, ];
    }

    return (

      <div>
        <Col style={{ zIndex: 2, position: 'fixed', top: '50%', left: '45%' }} s={12}>
          { intentProps.loading ? <Preloader color='#00ca9f' size='big' /> : null }
        </Col>
        <Helmet
          title="Create Intent"
          meta={[
            { name: 'description', content: 'Create an intent' },
          ]}
        />
        <Header breadcrumbs={breadcrumbs} />
        <Content>
          <ContentHeader title={messages.createIntentTitle} subTitle={messages.createIntentDescription} />
          <Form>
            <Row>
              <Toggle
                label="Webhook"
                right
                onChange={(evt) => this.onChangeInput(evt, 'useWebhook')}
              />
            </Row>
            <Row>

              <Input
                s={12}
                type="select"
                label={messages.domain.defaultMessage}
                defaultValue={this.props.intentData.domain ? this.props.intentData.domain : 'default'}
                onChange={(evt) => this.onChangeInput(evt, 'domain')}
              >
                {returnFormattedOptions(domainsSelect)}
              </Input>
              <FormTextInput
                label={messages.intentName}
                placeholder={messages.intentNamePlaceholder.defaultMessage}
                value={this.props.intentData.intentName}
                onChange={(evt) => this.onChangeInput(evt, 'intentName')}
                required
              />
              <FormTextInput
                label={messages.userSaysTitle}
                placeholder={messages.userSaysInput.defaultMessage}
                onKeyPress={(evt) => this.onChangeInput(evt, 'examples')}
                s={8}
              />
              <FormTextInput
                placeholder={messages.userSaysSearch.defaultMessage}
                s={4}
              />
            </Row>
          </Form>

          {this.props.intentData.examples.length > 0 ?
            <TableContainer id="userSayingsTable" quotes>
              <Table>
                <UserSayings
                  examples={this.props.intentData.examples}
                  onRemoveExample={this.props.onRemoveExample}
                  onTagEntity={this.props.onTagEntity}
                  agentEntities={agentEntities}
                  dirOfColors={dirOfColors}
                />
              </Table>
            </TableContainer>
            : null
          }

          <Form style={{ marginTop: '0px' }}>
            <Row>
              <InputLabel text={messages.slots} />
            </Row>
          </Form>

          <TableContainer id="slotsTable">
            <Table>
              <TableHeader
                columns={[
                  {
                    width: '15%',
                    label: messages.slotNameTitle.defaultMessage,
                    tooltip: messages.slotNameTooltip.defaultMessage,
                  },
                  {
                    width: '15%',
                    label: messages.slotEntityTitle.defaultMessage,
                    tooltip: messages.slotEntityTitle.defaultMessage,
                  },
                  {
                    width: '10%',
                    label: messages.slotIsListTitle.defaultMessage,
                    tooltip: messages.slotIsListTitle.defaultMessage,
                  },
                  {
                    width: '15%',
                    label: messages.slotIsRequiredTitle.defaultMessage,
                    tooltip: messages.slotIsRequiredTitle.defaultMessage,
                  },
                  {
                    width: '45%',
                    label: messages.slotPromptTitle.defaultMessage,
                    tooltip: messages.slotPromptTitle.defaultMessage,
                  },
                ]}
              />
              <Slots
                slots={this.props.scenarioData.slots}
                onCheckboxChange={this.props.onCheckboxChange}
                onAddTextPrompt={this.props.onAddTextPrompt}
                onDeleteTextPrompt={this.props.onDeleteTextPrompt}
                onRemoveSlot={this.props.onRemoveSlot}
                onSlotNameChange={this.props.onSlotNameChange}
                onAddSlot={this.props.onAddSlot}
                agentEntities={agentEntities}
                dirOfColors={dirOfColors}
              />
            </Table>
          </TableContainer>

          <Form>
            <Row>
              <AvailableSlots
                slots={this.props.scenarioData.slots}
                agentEntities={agentEntities}
                onClickFunction={this.props.onAutoCompleteEntityFunction}
                dirOfColors={dirOfColors}
              />
              <FormTextInput
                label={messages.agentResponsesTitle}
                placeholder={messages.responsesInput.defaultMessage}
                onKeyPress={(evt) => this.onChangeInput(evt, 'responses')}
              />
            </Row>
          </Form>

          {this.props.scenarioData.intentResponses.length > 0 ?
            <TableContainer id="intentResponsesTable" quotes>
              <Table>
                <Responses
                  intentResponses={this.props.scenarioData.intentResponses}
                  onRemoveResponse={this.props.onRemoveResponse}
                />
              </Table>
            </TableContainer>
            : null
          }
          <div
            style={{ float: 'left', clear: 'both' }}
            ref={(el) => {
              this.lastAgentResponse = el;
            }}
          >
          </div>
          {
            this.props.scenarioData.useWebhook ?
              <Form style={{ marginTop: '0px' }}>
                <Row>
                  <FormTextInput
                    label={messages.webhook}
                    placeholder={messages.webhookPlaceholder.defaultMessage}
                    value={this.props.scenarioData.webhookUrl}
                    onChange={(evt) => this.onChangeInput(evt, 'webhookUrl')}
                    required
                  />
                </Row>
              </Form>
              : null
          }

          <ActionButton label={messages.actionButton} onClick={this.props.onSubmitForm} />

        </Content>
      </div>
    );
  }
}

IntentPage.propTypes = {
  loading: React.PropTypes.bool,
  error: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  intent: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  scenario: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  onChangeIntentData: React.PropTypes.func,
  onSubmitForm: React.PropTypes.func,
  onTagEntity: React.PropTypes.func,
  onAutoCompleteEntityFunction: React.PropTypes.func,
  onCheckboxChange: React.PropTypes.func,
  onSlotNameChange: React.PropTypes.func,
  onAddTextPrompt: React.PropTypes.func,
  onDeleteTextPrompt: React.PropTypes.func,
  onRemoveSlot: React.PropTypes.func,
  onAddSlot: React.PropTypes.func,
  intentData: React.PropTypes.object,
  currentAgent: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  agentDomains: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
  agentEntities: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
  onSuccess: React.PropTypes.func,
  resetForm: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onChangeIntentData: (field, value) => {
      dispatch(dispatch(resetStatusFlags()));
      if (field === 'agent') {
        dispatch(loadAgentDomains(value));
        dispatch(loadAgentEntities(value));
      }
      dispatch(changeIntentData({ value, field }));
    },
    onRemoveExample: (exampleIndex, evt) => {
      dispatch(removeUserSaying(exampleIndex));
    },
    onRemoveResponse: (responseIndex, evt) => {
      dispatch(removeAgentResponse(responseIndex));
    },
    onRemoveSlot: (slotIndex, evt) => {
      dispatch(removeSlot(slotIndex));
    },
    onAddSlot: (evt) => {

    },
    onTagEntity: (userSays, entity, entityName, evt) => {
      dispatch(dispatch(resetStatusFlags()));
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      const userSelection = window.getSelection();
      const selectedText = userSelection.toString();
      if (selectedText !== '') {
        const start = userSays.indexOf(selectedText);
        const end = start + selectedText.length;
        const value = userSays.substring(start, end);
        dispatch(tagEntity({ userSays, entity, entityName, value, end, start }));
      }
    },
    onCheckboxChange: (slotName, field, evt) => {
      dispatch(dispatch(resetStatusFlags()));
      dispatch(toggleFlag({ slotName, field, value: evt.target.checked }));
    },
    onSlotNameChange: (slotName, evt) => {
      dispatch(dispatch(resetStatusFlags()));
      dispatch(changeSlotName({ slotName, value: evt.target.value }));
    },
    onAddTextPrompt: (slotName, evt) => {
      dispatch(dispatch(resetStatusFlags()));
      if (evt.charCode === 13) {
        dispatch(addTextPrompt({ slotName, value: evt.target.value }));
        evt.target.value = null;
      }
    },
    onDeleteTextPrompt: (slotName, textPrompt, evt) => {
      dispatch(dispatch(resetStatusFlags()));
      dispatch(deleteTextPrompt({ slotName, textPrompt }));
    },
    onAutoCompleteEntityFunction: (entityName, evt) => {
      dispatch(dispatch(resetStatusFlags()));
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      document.getElementById('responses').value += `${entityName}}`;
    },
    onSubmitForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(createIntent());
    },
    onSuccess: () => {
      dispatch(resetStatusFlags());
    },
    resetForm: () => {
      dispatch(resetIntentData());
    },
  };
}

const mapStateToProps = createStructuredSelector({
  intent: makeSelectIntent(),
  scenario: makeSelectScenario(),
  intentData: makeSelectIntentData(),
  scenarioData: makeSelectScenarioData(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
  success: makeSelectSuccess(),
  agentDomains: makeSelectAgentDomains(),
  agentEntities: makeSelectAgentEntities(),
  currentAgent: makeSelectCurrentAgent(),
});

export default connect(mapStateToProps, mapDispatchToProps)(IntentPage);
