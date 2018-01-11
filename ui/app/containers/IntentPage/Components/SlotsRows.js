import TextInput from 'components/TextInput';
import React from 'react';
import { Icon, Input, } from 'react-materialize';
import SlotAgentEntities from './SlotAgentEntities';
import TextPrompts from './TextPrompts';

export function SlotsRows(props) {
  const rows = props.slots.map((slot, slotIndex) => {
    const agentEntity = props.agentEntities.filter((agentEntity) => agentEntity.entityName === slot.entity)[0];
    return (
      <tr style={{ width: '100%' }} key={slotIndex}>
        <td style={{ width: '15%', display: 'inline-block' }}>
          <TextInput
            style={{ marginBottom: '0px', color: props.dirOfColors[slot.entity] }}
            placeholder=""
            value={`${slot.slotName}`}
            inputId={`slotName_${slotIndex}`}
            onChange={props.onSlotNameChange.bind(null, slot.slotName)}
          />
        </td>
        <SlotAgentEntities
          slot={slot}
          agentEntity={agentEntity}
          index={slotIndex}
          agentEntities={props.agentEntities}
          onClickFunction={() => {
          }}
          dirOfColors={props.dirOfColors}
        />
        <td style={{ width: '10%', display: 'inline-block', paddingBottom: '0px' }}>
          <Input onChange={props.onCheckboxChange.bind(null, slot.slotName, 'isList')} name="isList" type="checkbox" value="isList" label=" " className="filled-in" checked={slot.isList ? true : false} />
        </td>
        <td style={{ width: '15%', display: 'inline-block', paddingBottom: '0px' }}>
          <Input onChange={props.onCheckboxChange.bind(null, slot.slotName, 'isRequired')} name="isRequired" type="checkbox" label=" " value="isRequired" className="filled-in" checked={slot.isRequired ? true : false} />
        </td>
        <TextPrompts slot={slot} onDeleteTextPrompt={props.onDeleteTextPrompt} onAddTextPrompt={props.onAddTextPrompt} />
        <td style={{ width: '5%', display: 'inline-block', paddingBottom: '0px' }}>
          <a onClick={props.onRemoveSlot.bind(null, slotIndex)}>
            <Icon className="table-delete-row">delete</Icon>
          </a>
        </td>
      </tr>
    );
  });

  return (
    <tbody>
    {rows}
    </tbody>
  );
}

SlotsRows.propTypes = {
  slots: React.PropTypes.array,
  onCheckboxChange: React.PropTypes.func,
  onAddTextPrompt: React.PropTypes.func,
  onSlotNameChange: React.PropTypes.func,
  onDeleteTextPrompt: React.PropTypes.func,
  onRemoveSlot: React.PropTypes.func,
  agentEntities: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
  dirOfColors: React.PropTypes.object,
};

export default SlotsRows;
