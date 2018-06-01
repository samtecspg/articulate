import React from 'react';
import SlotsRows from './SlotsRows';
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

export class Slots extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillReceiveProps(){
    this.forceUpdate();
  }

  render() {
    return (
      this.props.agentEntities ? 
        <SlotsRows
        slots={this.props.slots}
        onCheckboxChange={this.props.onCheckboxChange}
        onAddTextPrompt={this.props.onAddTextPrompt}
        onDeleteTextPrompt={this.props.onDeleteTextPrompt}
        onRemoveSlot={this.props.onRemoveSlot}
        onSlotNameChange={this.props.onSlotNameChange}
        onSortSlots={this.props.onSortSlots}
        agentEntities={this.props.agentEntities}
        enableSlotOrder={this.props.enableSlotOrder}
        onAddSlot={this.props.onAddSlot}
        onChangeAgent={this.props.onChangeAgent}
      />
        : null
    );
  }
}

Slots.propTypes = {
  slots: React.PropTypes.array,
  onCheckboxChange: React.PropTypes.func,
  onAddTextPrompt: React.PropTypes.func,
  onDeleteTextPrompt: React.PropTypes.func,
  onRemoveSlot: React.PropTypes.func,
  onSlotNameChange: React.PropTypes.func,
  onSortSlots: React.PropTypes.func,
  onAddSlot: React.PropTypes.func,
  agentEntities: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  enableSlotOrder: React.PropTypes.bool,
  onChangeAgent: React.PropTypes.func,
};

export default DragDropContext(HTML5Backend)(Slots);
