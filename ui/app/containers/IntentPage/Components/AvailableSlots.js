import React from 'react';
import {
  Dropdown,
  NavItem,
} from 'react-materialize';
import messages from '../messages';
import systemEntities from 'systemEntities';

export function AvailableSlots(props) {
  let items = [<NavItem style={{ color: '#4e4e4e' }} key="addSlots" href="#">{messages.emptySlotList.defaultMessage}</NavItem>];
  if (props.slots && props.slots.length > 0) {
    items = props.slots.map((slot, index) => {
      let agentEntity = props.agentEntities.entities.filter((agentEntity) => agentEntity.entityName === slot.entity)[0];
      if (!agentEntity){
        agentEntity = systemEntities.filter((sysEntity) => sysEntity.entityName === slot.entity)[0];
      }
      return (
        <NavItem onClick={props.onClickFunction.bind(null, slot.slotName)} key={index}><span style={agentEntity ? { color: agentEntity.uiColor } : {}}>{`{${slot.slotName}}`}</span></NavItem>
      );
    });
  }
  return (
    <Dropdown className="dropdown-slot-entity-selector" trigger={<span id={'intentResponseEntityDropdown'}></span>}>
      {items}
    </Dropdown>
  );
}

AvailableSlots.propTypes = {
  slots: React.PropTypes.array,
  agentEntities: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  onClickFunction: React.PropTypes.func,
};

export default AvailableSlots;
