import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Dropdown,
  NavItem,
} from 'react-materialize';
import messages from '../messages';

export function SlotAgentEntities(props) {
  let items = [<NavItem style={{ color: '#4e4e4e' }} key="newEntity" href="#">{messages.emptyEntityList.defaultMessage}</NavItem>];
  if (props.agentEntities && props.agentEntities && props.agentEntities.entities.length > 0) {
    items = props.agentEntities.entities.map((agentEntity, agentIndex) => {
      let entityColor = agentEntity.uiColor;
      return (
        <NavItem
          href={'#'}
          onClick={props.onClickFunction.bind(null, agentEntity.entityName)}
          key={agentIndex}
        ><span style={{ color: entityColor }}>{agentEntity.entityName}</span>
        </NavItem>
      );
    });
  }
  return (
    <td style={{ width: `${14 + (props.enableSlotOrder ? 0 : 1)}%`, display: 'inline-block', borderBottom: '1px solid #9e9e9e' }}>
      <Dropdown
        className="dropdown-slot-entity-selector"
        trigger={
          <span
            style={{ fontWeight: 300, color: '#9e9e9e' }}
            id={`slotEntityDropdown_${props.index}`}
          >
            {props.slot.entity ?
              <span style={{ color: props.agentEntity.uiColor }}>{props.agentEntity.entityName}</span> :
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
  agentEntities: React.PropTypes.object,
  onClickFunction: React.PropTypes.func,
  index: React.PropTypes.number,
  enableSlotOrder: React.PropTypes.bool,
};

export default SlotAgentEntities;
