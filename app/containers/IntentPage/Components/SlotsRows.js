import React from 'react';
import { Icon, Dropdown } from 'react-materialize';
import AgentEntities from './AgentEntities'
import FormattedText from './FormattedText'

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

export function SlotsRows(props) {

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
        );
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
  
    return (
        <tbody>
            {rows}
        </tbody>      
    );
}

SlotsRows.propTypes = {
    examples: React.PropTypes.array,
    onRemoveExample: React.PropTypes.func,
    onTagEntity: React.PropTypes.func,
    agentEntities: React.PropTypes.array,
    dirOfColors: React.PropTypes.object,
    colorArray: React.PropTypes.array
};

export default SlotsRows;
