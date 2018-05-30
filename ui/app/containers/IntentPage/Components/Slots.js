import React from 'react';
import SlotsRows from './SlotsRows';
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

export function Slots(props) {
  return (
    props.agentEntities ? 
      <SlotsRows
      slots={props.slots}
      onCheckboxChange={props.onCheckboxChange}
      onAddTextPrompt={props.onAddTextPrompt}
      onDeleteTextPrompt={props.onDeleteTextPrompt}
      onRemoveSlot={props.onRemoveSlot}
      onSlotNameChange={props.onSlotNameChange}
      onSortSlots={props.onSortSlots}
      agentEntities={props.agentEntities}
    />
      : null
  );
}

Slots.propTypes = {
  slots: React.PropTypes.array,
  onCheckboxChange: React.PropTypes.func,
  onAddTextPrompt: React.PropTypes.func,
  onDeleteTextPrompt: React.PropTypes.func,
  onRemoveSlot: React.PropTypes.func,
  onSlotNameChange: React.PropTypes.func,
  onSortSlots: React.PropTypes.func,
  agentEntities: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
};

export default DragDropContext(HTML5Backend)(Slots);
