import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Dropdown,
  NavItem,
} from 'react-materialize';
import messages from '../messages';
import systemEntities from 'systemEntities';
import Immutable from 'seamless-immutable';

export function SlotAgentEntities(props) {
  let items = undefined;
  let entitiesItems = undefined;
  let formattedSystemEntities = undefined;
  if (props.agentEntities && props.agentEntities && props.agentEntities.entities.length > 0) {
    entitiesItems = props.agentEntities.entities.map((agentEntity, agentEntityIndex) => {
      let entityColor = agentEntity.uiColor;
      return (
        <NavItem
          href={'#'}
          onClick={props.onChangeAgent.bind(null, props.slot.slotName, agentEntity.entityName)}
          key={agentEntityIndex}
        ><span style={{ color: entityColor }}>{agentEntity.entityName} {agentEntity.type === 'regex' ? '(Regex)' : ''}  </span>
        </NavItem>
      );
    });
  }
  formattedSystemEntities = systemEntities.map((systemEntity, systemEntityIndex) => {
    return (
      <NavItem
        onClick={props.onChangeAgent.bind(null, props.slot.slotName, systemEntity.entityName)}
        key={`sys.entity.${systemEntityIndex}`}
      >
        <span style={{ color: systemEntity.uiColor }}>
                      @{systemEntity.entityName}
        </span>
      </NavItem>
    );
  });
  items = Immutable([entitiesItems])
    .concat(<NavItem key="dividerSysEntities" divider />)
    .concat(formattedSystemEntities);
  return (
    <td style={{ width: '15%', display: 'inline-block', borderBottom: '1px solid #9e9e9e' }}>
      <Dropdown
        className="dropdown-slot-entity-selector"
        trigger={
          <span
            style={{ fontWeight: 300, color: '#9e9e9e' }}
            id={`slotEntityDropdown_${props.index}`}
          >
            { props.slot.entity ?
              props.agentEntity.type === 'regex' ?
              <span style={{ color: props.agentEntity.uiColor }}>{props.agentEntity.entityName} (Regex) </span> :
                <span style={{ color: props.agentEntity.uiColor }}>{props.agentEntity.entityName}</span>
              :
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
  onChangeAgent: React.PropTypes.func,
  index: React.PropTypes.number,
};

export default SlotAgentEntities;
