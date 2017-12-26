import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Dropdown,
  NavItem,
} from 'react-materialize';
import messages from '../messages';

export function SlotAgentEntities(props) {
  let items = [<NavItem style={{ color: '#4e4e4e' }} key="newEntity" href="#">{messages.emptyEntityList.defaultMessage}</NavItem>];
  if (props.agentEntities && props.agentEntities.length > 0) {
    items = props.agentEntities.map((agentEntity, agentIndex) => {
      let entityColor = props.dirOfColors[agentEntity.entityName];
      if (!entityColor) {
        props.dirOfColors[agentEntity.entityName] = agentEntity.uiColor;
      }
      return (
        <NavItem
          href={'#'}
          onClick={props.onClickFunction.bind(null, agentEntity.entityName)}
          key={agentIndex}
        >
          <span style={{ color: entityColor }}>
                        @{agentEntity.entityName}
          </span>
        </NavItem>
      );
    });
  }
  return (
    <td style={{ width: '15%', display: 'inline-block', borderBottom: '1px solid #9e9e9e' }}>
      <Dropdown
        className="dropdown-slot-entity-selector"
        trigger={
          <span
            style={{ fontWeight: 300, color: '#9e9e9e' }}
            id={`slotEntityDropdown_${props.index}`}
          >
            {props.slot.entity ?
              <span style={{ color: props.dirOfColors[props.slot.entity] }}>@{props.agentEntity.entityName}</span> :
              <FormattedMessage {...messages.slotEntityPlaceholder} />}
          </span>}
        options={{
          belowOrigin: true,
        }}
      >
        {items}
      </Dropdown>
    </td>
  );
}

SlotAgentEntities.propTypes = {
  slot: React.PropTypes.object,
  agentEntity: React.PropTypes.object,
  agentEntities: React.PropTypes.array,
  onClickFunction: React.PropTypes.func,
  dirOfColors: React.PropTypes.object,
  index: React.PropTypes.number,
};

export default SlotAgentEntities;
