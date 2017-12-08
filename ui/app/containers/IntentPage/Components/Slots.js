import React from 'react';
import SlotsRows from './SlotsRows';

export function Slots(props) {
  return (
    <SlotsRows
      slots={props.slots}
      onCheckboxChange={props.onCheckboxChange}
      onAddTextPrompt={props.onAddTextPrompt}
      onDeleteTextPrompt={props.onDeleteTextPrompt}
      onSlotNameChange={props.onSlotNameChange}
      agentEntities={props.agentEntities}
      colorArray={props.colorArray}
      dirOfColors={props.dirOfColors}
    />);
}

Slots.propTypes = {
  slots: React.PropTypes.array,
  onCheckboxChange: React.PropTypes.func,
  onAddTextPrompt: React.PropTypes.func,
  onDeleteTextPrompt: React.PropTypes.func,
  onSlotNameChange: React.PropTypes.func,
  agentEntities: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
  dirOfColors: React.PropTypes.object,
  colorArray: React.PropTypes.array,
};

export default Slots;
