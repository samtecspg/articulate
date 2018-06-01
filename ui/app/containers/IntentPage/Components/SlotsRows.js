import TextInput from 'components/TextInput';
import React from 'react';
import { Icon, Input, } from 'react-materialize';
import SlotAgentEntities from './SlotAgentEntities';
import TextPrompts from './TextPrompts';
import systemEntities from 'systemEntities';
import SortableSlotsRows from './SortableSlotsRows'

export function SlotsRows(props) {
  const rows = props.slots.map((slot, slotIndex) => {
    let agentEntity = props.agentEntities.entities.filter((agentEntity) => agentEntity.entityName === slot.entity)[0];
    if (!agentEntity){
      agentEntity = systemEntities.filter((sysEntity) => sysEntity.entityName === slot.entity)[0];
    }
    return (
      <tr style={{ width: '100%' }} key={slotIndex}>
        <td style={{ width: `${14 + (props.enableSlotOrder ? 0 : 1)}%`, display: 'inline-block' }}>
          <TextInput
            style={{ marginBottom: '0px', color: agentEntity ? agentEntity.uiColor : '' }}
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
          enableSlotOrder= {props.enableSlotOrder}
        />
        <td style={{ width: `${9 + (props.enableSlotOrder ? 0 : 1)}%`, display: 'inline-block', paddingBottom: '0px' }}>
          <Input onChange={props.onCheckboxChange.bind(null, slot.slotName, 'isList')} name="isList" type="checkbox" value="isList" label=" " className="filled-in" checked={slot.isList ? true : false} />
        </td>
        <td style={{ width: `${14 + (props.enableSlotOrder ? 0 : 1)}%`, display: 'inline-block', paddingBottom: '0px' }}>
          <Input onChange={props.onCheckboxChange.bind(null, slot.slotName, 'isRequired')} name="isRequired" type="checkbox" label=" " value="isRequired" className="filled-in" checked={slot.isRequired ? true : false} />
        </td>
        <TextPrompts
          slot={slot}
          onDeleteTextPrompt={props.onDeleteTextPrompt}
          onAddTextPrompt={props.onAddTextPrompt}
          enableSlotOrder= {props.enableSlotOrder}
        />
        <td style={{ width: '5%', display: 'inline-block', paddingBottom: '0px' }}>
          <a onClick={props.onRemoveSlot.bind(null, slotIndex)}>
            <Icon className="table-delete-row">delete</Icon>
          </a>
        </td>
        {props.enableSlotOrder ?
        <td style={{ width: '5%', display: 'inline-block', paddingBottom: '0px' }}>
            <Icon className="table-delete-row">drag_indicator</Icon>
        </td> : null}
      </tr>
    );
  });

  return (
      <SortableSlotsRows
        onSortSlots={props.onSortSlots}
        slotRows={rows}
      />
  );
}

SlotsRows.propTypes = {
  slots: React.PropTypes.array,
  onCheckboxChange: React.PropTypes.func,
  onAddTextPrompt: React.PropTypes.func,
  onSlotNameChange: React.PropTypes.func,
  onDeleteTextPrompt: React.PropTypes.func,
  onRemoveSlot: React.PropTypes.func,
  onSortSlots: React.PropTypes.func,
  agentEntities: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  enableSlotOrder: React.PropTypes.bool,
};

export default SlotsRows;
