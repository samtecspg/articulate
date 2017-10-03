import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import * as camel from 'to-camel-case';

import { createStructuredSelector } from 'reselect';

import TextInput from 'components/TextInput';
import DropdownInput from 'components/DropdownInput';
import Header from 'components/Header';
import ContentHeader from 'components/ContentHeader';
import InputWarning from 'components/InputWarning';
import Content from 'components/Content';
import Tooltip from 'components/Tooltip';
import Chip from 'components/Chip';

import { Input, Row, Icon, Dropdown, NavItem, Button } from 'react-materialize';

import messages from './messages';

import { createIntent, loadAgents, loadAgentDomains, loadAgentEntities } from 'containers/App/actions';
import { makeSelectCurrentAgent, makeSelectCurrentDomain, makeSelectAgentEntities, makeSelectAgentDomains, makeSelectAgents, makeSelectIntent, makeSelectScenario, makeSelectLoading, makeSelectError } from 'containers/App/selectors';

import { changeIntentData, tagEntity, untagEntity, toggleFlag, addTextPrompt, deleteTextPrompt } from './actions';
import { makeSelectIntentData, makeSelectScenarioData } from './selectors';

function compareEntities(a,b) {
  if (a.start < b.start)
    return -1;
  if (a.start > b.start)
    return 1;
  return 0;
}

const returnFormattedOptions = (options) => {
  return options.map( (option, index) => {
    return (
        <option key={index} value={option.value}>
          {option.text}
        </option>
      )
  });
};

const colorArray = ['#f44336','#E91E63','#9C27B0','#673AB7','#3F51B5','#2196F3','#03A9F4','#00BCD4','#009688','#4CAF50','#8BC34A'];
const dirOfColors = {};

const highlightEntity= (agentEntities, dropDownButtonId, e) => {
  if (agentEntities){
    const dropDownButton = document.getElementById(dropDownButtonId);
    dropDownButton.dispatchEvent(new Event('click'));
  }
};

const renderAgentEntities = (agentEntities, onClickFunction, userSays, createEntity) => {
  let items = [<NavItem style={{color: '#4e4e4e'}} key="newEntity" href="#">Please select an agent first</NavItem>];
  if (agentEntities && agentEntities.length > 0){
    items = agentEntities.map( (agentEntity, index) => {
      let entityColor = dirOfColors[agentEntity._id];
      if (!entityColor){
        const randomColorIndex = Math.floor(Math.random() * colorArray.length);
        entityColor = colorArray[randomColorIndex];
        dirOfColors[agentEntity._id] = entityColor;
        colorArray.splice(randomColorIndex, 1)
      }
      return(
        <NavItem onClick={userSays ? onClickFunction.bind(null, userSays, agentEntity._id, camel(agentEntity.entityName)) : onClickFunction.bind(null, camel(agentEntity.entityName))} key={index}><span style={{color: entityColor}}>@{camel(agentEntity.entityName)}</span></NavItem>
      )
    });
    items.push(
      <NavItem key="divider" divider />
    );
    if (createEntity){
      items.push(
        <NavItem style={{color: '#4e4e4e'}} key="newEntity" href="/entities/create">+ Create Entity</NavItem>
      );
    }
  }
  return items;
};

const renderAvailableSlots = (slots, agentEntities, onClickFunction) => {
  let items = [<NavItem style={{color: '#4e4e4e'}} key="selectAgent" href="#">You haven't created slots</NavItem>];
  if (slots && slots.length > 0){
    items = slots.map( (slot, index) => {
      const agentEntity = agentEntities.filter( (agentEntity) => {
        return agentEntity._id === slot.entity;
      })[0];
      let entityColor = dirOfColors[slot.entity];
      if (!entityColor){
        const randomColorIndex = Math.floor(Math.random() * colorArray.length);
        entityColor = colorArray[randomColorIndex];
        dirOfColors[slot.entity] = entityColor;
        colorArray.splice(randomColorIndex, 1)
      }
      return(
        <NavItem onClick={onClickFunction.bind(null, camel(agentEntity.entityName))} key={index}><span style={{color: entityColor}}>${camel(agentEntity.entityName)}</span></NavItem>
      )
    });
  }
  return items;
};

const recursiveFormattingMethod = (sortedEntities, textValue, entityIndex, lastStart) => {
  const entity = sortedEntities.length > 0 ? sortedEntities.splice(0,1)[0] : null;
  let formattedElement = null;
  if (entity) {
    const beforeTaggedText = textValue.substring(0, entity.start - lastStart);
    const taggedText = textValue.substring(entity.start - lastStart, entity.end - lastStart);
    const afterTaggedText = textValue.substring(entity.end - lastStart, textValue.length);
    let highlightColor = dirOfColors[entity.entity];
    if (!highlightColor){
      const randomColorIndex = Math.floor(Math.random() * colorArray.length);
      highlightColor = colorArray[randomColorIndex];
      colorArray.splice(randomColorIndex, 1);
    }
    formattedElement = (
      <span key={'entityTag_' + entityIndex}>
        <span key={'beforeEntityTagText_' + entityIndex}>{beforeTaggedText}</span>
        <span key={'entityTagText_' + entityIndex} style={{ backgroundColor: highlightColor, color: 'white'}}>{taggedText}</span>
        {recursiveFormattingMethod(sortedEntities, afterTaggedText, entityIndex + 1, entity.end)}
      </span>
    );
  }
  else{
    formattedElement = (
      <span key={'entityTag_' + entityIndex}>
        {textValue}
      </span>
    );
  }
  return formattedElement;
};

const renderRows = (values, field, removeRowFunction, tagEntityFunction, agentEntities) => {
  const rows = values.map( (value, valueIndex) => {
    const textValue = field ? value[field] : value;
    let formattedText = null;
    if (field && value.entities.length > 0){
      const sortedEntities = value.entities.sort(compareEntities);
      formattedText = recursiveFormattingMethod(sortedEntities, textValue, 0, 0);
    }
    return (
      <tr style={{width: '100%'}} key={valueIndex} >
        <td style={{width: '100%', display: 'inline-block'}}>
          {
            field ?
            <div>
                <span id={'userSaying_' + valueIndex} onMouseUp={highlightEntity.bind(null, agentEntities, 'userSayingDropdown_' + valueIndex)}>{formattedText ? formattedText : textValue}</span>
                <Dropdown className='dropdown-entity-selector' trigger={<span id={'userSayingDropdown_' + valueIndex}></span>} options={{belowOrigin: true}}>
                  {renderAgentEntities(agentEntities, tagEntityFunction, textValue, true)}
                </Dropdown>
                <a onClick={removeRowFunction.bind(null, textValue)}>
                  <Icon className="table-delete-row">delete</Icon>
                </a>
            </div>
            : 
            <div>
                <span id={'intentResponse_' + valueIndex}>{textValue}</span>
                <a onClick={removeRowFunction.bind(null, textValue)}>
                  <Icon className="table-delete-row">delete</Icon>
                </a>
            </div>
          }
        </td>
      </tr>
    )
  });
  return rows;
};

const renderSlots = (slots, onCheckboxChange, onAddTextPrompt, onDeleteTextPrompt, onAddSlot, agentEntities) => {
  const rows = slots.map( (slot, slotIndex) => {
    const agentEntity = agentEntities.filter( (agentEntity) => {
      return agentEntity._id === slot.entity;
    })[0];
    const textPrompts = slot.textPrompts.map( (textPrompt, indexTextPrompt) => {
      return (
        <Chip onClose={onDeleteTextPrompt.bind(null, slot.slotName, textPrompt)} key={'slot_' + slotIndex + '_textPrompt_' + indexTextPrompt} close={true}>
          {textPrompt}
        </Chip>
      )
    });
    textPrompts.push(
      <TextInput
        style={{ marginBottom: '0px'}}
        key = {'newPrompt'}
        placeholder={messages.slotPromptPlaceholder.defaultMessage}
        inputId={'newPrompt'}
        onKeyPress={onAddTextPrompt.bind(null, slot.slotName)}
        disabled={!slot.isRequired}
      />
    )
    return (
      <tr style={{width: '100%'}} key={slotIndex} >
        <td style={{width: '20%', display: 'inline-block'}}>
          <span style={{color: dirOfColors[slot.entity]}}>${camel(slot.slotName)}</span>
        </td>
        <td style={{width: '15%', display: 'inline-block', borderBottom: '1px solid #9e9e9e'}}> 
          <Dropdown 
            className='dropdown-slot-entity-selector' 
            trigger={
                <span 
                  style={{ fontWeight: 300, color: '#9e9e9e' }} 
                  id={'slotEntityDropdown_'+slotIndex}>
                    {slot.entity ? <span style={{color: dirOfColors[slot.entity]}}>@{camel(agentEntity.entityName)}</span> : <FormattedMessage {...messages.slotEntityPlaceholder} />}
                </span>} 
            options={
              {
                belowOrigin: true,
              }
            }
            >
              {renderAgentEntities(agentEntities, () => {}, null, false)}
          </Dropdown>
        </td>
        <td style={{width: '10%', display: 'inline-block', paddingBottom: '0px'}}>
          <Input onChange={onCheckboxChange.bind(null, slot.slotName, 'isList')} name='isList' type='checkbox' value='isList' label=' ' className='filled-in' defaultChecked={ slot.isList ? 'required' : null }  />
        </td>
        <td style={{width: '15%', display: 'inline-block', paddingBottom: '0px'}}>
          <Input onChange={onCheckboxChange.bind(null, slot.slotName, 'isRequired')} name='isRequired' type='checkbox' label=' ' value='isRequired' className='filled-in' defaultChecked={ slot.isRequired ? 'required' : null }/>
        </td>
        <td style={{width: '35%', display: 'inline-block'}}>
            {
              textPrompts
            }
        </td>
      </tr>
    )
  });
  return rows;
};

export class IntentPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.onComponentMounting();
  }

  render() {
    const { loading, error, intent, scenario, agents, agentDomains, agentEntities, currentAgent, currentDomain } = this.props;
    const intentProps = {
      loading,
      error,
      intent,
      scenario,
    };

    let agentsSelect = [];
    if(agents !== false){
      agentsSelect = agents.map( (agent) => {
        return {
          value: agent._id,
          text: agent.agentName,
        }
      });
      agentsSelect.unshift({ value: 'default', text: 'Please choose an agent to place your intent', disabled: 'disabled'});
    }

    let domainsSelect = [];
    if(agentDomains !== false){
      domainsSelect = agentDomains.map( (domain) => {
        return {
          value: domain._id,
          text: domain.domainName,
        }
      });
      domainsSelect.unshift({ value: 'default', text: 'Please choose a domain to place your intent', disabled: 'disabled'});
    }

    return (

      <div>
      <Helmet
        title="Create Intent"
        meta={[
          { name: 'description', content: 'Create an intent' },
        ]}
      />
      <Header />
      <Content>
        <ContentHeader title={messages.createIntentTitle} subTitle={messages.createIntentDescription} />
        <div id="form-section">
          <Row>
            <Input s={12} 
              name='agent'
              type='select' 
              label={messages.agent.defaultMessage} 
              defaultValue={this.props.intentData.agent ? this.props.intentData.agent : 'default'}
              onChange={this.props.onChangeIntentData.bind(null, 'agent')}>
                  {returnFormattedOptions(agentsSelect)}
            </Input>
            <Input s={12} 
              name='domain'
              type='select' 
              label={messages.domain.defaultMessage} 
              defaultValue={this.props.intentData.domain ? this.props.intentData.domain : 'default'}
              onChange={this.props.onChangeIntentData.bind(null, 'domain')}>
                  {returnFormattedOptions(domainsSelect)}
            </Input>
            <div className="col input-field s12">
              <TextInput
                label={messages.intentName}
                placeholder={messages.intentNamePlaceholder.defaultMessage}
                inputId="intentName"
                value={this.props.intentData.intentName}
                onChange={this.props.onChangeIntentData.bind(null, 'intentName')}
                required={true}
                />
            </div>
            <div className="col input-field s8">
              <TextInput
                label={messages.userSaysTitle}
                placeholder={messages.userSaysInput.defaultMessage}
                inputId="userSays"
                onKeyPress={this.props.onChangeIntentData.bind(null, 'examples')}
                />
            </div>
            <div className="col input-field s4">
              <TextInput
                placeholder={messages.userSaysSearch.defaultMessage}
                inputId="userSays"
                />
            </div>
          </Row>
        </div>

        { this.props.intentData.examples.length > 0 ? 
          <div id="userSayingsTable" className="quotes table-container">
            <Row>
              <div className="col input-field s12 table-col">
                <div>
                  <div className="border-container ">
                    <table className="bordered highlight">
                      <tbody>
                        {renderRows(this.props.intentData.examples, 'userSays', this.props.onRemoveExample, this.props.onTagEntity, agentEntities)}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Row>
          </div>
          : null
        }

        <div style={{marginTop: '0px'}} id="form-section">
          <Row>
            <div className="col input-field s12">
                <label><FormattedMessage {...messages.slots} /></label>
            </div>
          </Row>
        </div>

        <div id="slotsTable" className="table-container">
          <Row>
            <div className="col input-field s12 table-col">
              <div>
                <div className="border-container ">
                  <table className="bordered highlight">
                    <thead>
                      <tr style={{width: '100%'}}>
                        <th style={{width: '20%', display: 'inline-block'}}>
                          <FormattedMessage {...messages.slotNameTitle} />
                          <Tooltip
                            tooltip={messages.slotNameTooltip.defaultMessage}
                            delay={50}
                            position="top"
                          >
                            <a>
                              <Icon>help_outline</Icon>
                            </a>
                          </Tooltip>
                        </th>
                        <th style={{width: '15%', display: 'inline-block'}}>
                          <FormattedMessage {...messages.slotEntityTitle} />
                          <Tooltip
                            tooltip={messages.slotEntityTooltip.defaultMessage}
                            delay={50}
                            position="top"
                          >
                            <a>
                              <Icon>help_outline</Icon>
                            </a>
                          </Tooltip>
                        </th>
                        <th style={{width: '10%', display: 'inline-block'}}>
                          <FormattedMessage {...messages.slotIsListTitle} />
                          <Tooltip
                            tooltip={messages.slotIsListTooltip.defaultMessage}
                            delay={50}
                            position="top"
                          >
                            <a>
                              <Icon>help_outline</Icon>
                            </a>
                          </Tooltip>
                        </th>
                        <th style={{width: '15%', display: 'inline-block'}}>
                          <FormattedMessage {...messages.slotIsRequiredTitle} />
                          <Tooltip
                            tooltip={messages.slotIsRequiredTooltip.defaultMessage}
                            delay={50}
                            position="top"
                          >
                            <a>
                              <Icon>help_outline</Icon>
                            </a>
                          </Tooltip>
                        </th>
                        <th style={{width: '40%', display: 'inline-block'}}>
                          <FormattedMessage {...messages.slotPromptTitle} />
                          <Tooltip
                            tooltip={messages.slotPromptTooltip.defaultMessage}
                            delay={50}
                            position="top"
                          >
                            <a>
                              <Icon>help_outline</Icon>
                            </a>
                          </Tooltip>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {renderSlots(this.props.scenarioData.slots, this.props.onCheckboxChange, this.props.onAddTextPrompt, this.props.onDeleteTextPrompt, this.props.onAddSlot, agentEntities)}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Row>
        </div>

        <div style={{marginTop: '0px'}} id="form-section">
          <Row>
            <div className="col input-field s12">
              <Dropdown className='dropdown-slot-entity-selector' trigger={<span id={'intentResponseEntityDropdown'}></span>}>
                {renderAvailableSlots(this.props.scenarioData.slots, agentEntities, this.props.onAutoCompleteEntityFunction)}
              </Dropdown>
              <TextInput
                label={messages.agentResponsesTitle}
                placeholder={messages.responsesInput.defaultMessage}
                id="responses"
                onKeyPress={this.props.onChangeIntentData.bind(null, 'responses')}
                />
            </div>
          </Row>
        </div>

        { this.props.scenarioData.intentResponses.length > 0 ? 
          <div id="intentResponsesTable" className="quotes table-container">
            <Row>
              <div className="col input-field s12 table-col">
                <div>
                  <div className="border-container ">
                    <table className="bordered highlight">
                      <tbody>
                        {renderRows(this.props.scenarioData.intentResponses, null, this.props.onRemoveExample, agentEntities, false)}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Row>
          </div>
          : null
        }

        <div className="fixed-action-btn">
          <a className="btn-floating btn-large" onClick={this.props.onSubmitForm}>
          + Create
          </a>
        </div>

        
        <Row>
          <p>
            {JSON.stringify(intentProps)}
          </p>
        </Row>
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
  onComponentMounting: React.PropTypes.func,
  onChangeIntentData: React.PropTypes.func,
  onSubmitForm: React.PropTypes.func,
  onTagEntity: React.PropTypes.func,
  onAutoCompleteEntityFunction: React.PropTypes.func,
  onSubmitForm: React.PropTypes.func,
  onCheckboxChange: React.PropTypes.func,
  onAddTextPrompt: React.PropTypes.func,
  onDeleteTextPrompt: React.PropTypes.func,
  onAddSlot: React.PropTypes.func,
  intentData: React.PropTypes.object,
  currentAgent: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  agents: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
  currentDomain: React.PropTypes.oneOfType([
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
};

export function mapDispatchToProps(dispatch) {
  return {
    onComponentMounting: (evt) => {
      dispatch(loadAgents());
    },
    onChangeIntentData: (field, evt) => {
      if (field === 'examples' || field === 'responses'){
        if (evt.charCode === 13){
          dispatch(changeIntentData({ value: evt.target.value, field }));
          evt.target.value = null;
        }
        if (field === 'responses'){
          if (evt.charCode === 36){
            const dropDownButton = document.getElementById('intentResponseEntityDropdown');
            dropDownButton.dispatchEvent(new Event('click'));
          }
        }
      }
      else {
        if (field === 'agent'){
          dispatch(loadAgentDomains(evt.target.value));
          dispatch(loadAgentEntities(evt.target.value));
          dispatch(changeIntentData({ value: evt.target.value, field }));
        }
        dispatch(changeIntentData({ value: evt.target.value, field }));
      }
    },
    onRemoveExample: (exampleIndex, evt) => {

    },
    onAddSlot: (evt) => {

    },
    onTagEntity: (userSays, entity, entityName, evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      const userSelection = window.getSelection();
      const selectedText = userSelection.toString();
      if (selectedText !== ''){
        const start = userSays.indexOf(selectedText);
        const end = start + selectedText.length;
        const value = userSays.substring(start, end);
        dispatch(tagEntity({ userSays, entity, entityName, value, end, start }));
      }
    },
    onCheckboxChange: (slotName, field, evt) => {
      dispatch(toggleFlag({ slotName, field, value: evt.target.checked }));
    },
    onAddTextPrompt: (slotName, evt) => {
      if (evt.charCode === 13){
        dispatch(addTextPrompt({ slotName, value: evt.target.value }));
        evt.target.value = null;
      }
    },
    onDeleteTextPrompt: (slotName, textPrompt, evt) => {
      dispatch(deleteTextPrompt({ slotName, textPrompt }));
    },
    onAutoCompleteEntityFunction: (entityName, evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      document.getElementById('responses').value += entityName;
    },
    onSubmitForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(createIntent());
    },
  };
}

const mapStateToProps = createStructuredSelector({
  intent: makeSelectIntent(),
  intent: makeSelectScenario(),
  intentData: makeSelectIntentData(),
  scenarioData: makeSelectScenarioData(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
  agents: makeSelectAgents(),
  agentDomains: makeSelectAgentDomains(),
  agentEntities: makeSelectAgentEntities(),
  currentAgent: makeSelectCurrentAgent(),
  currentDomain: makeSelectCurrentDomain(),
});

export default connect(mapStateToProps, mapDispatchToProps)(IntentPage);
