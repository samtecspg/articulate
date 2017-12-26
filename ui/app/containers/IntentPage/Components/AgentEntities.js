import React from 'react';
import {
  Dropdown,
  NavItem,
} from 'react-materialize';
import messages from '../messages';

/**
 *
 * This component is the dropdown menu for the entities
 * Given that is present for user sayings and responses
 * it is necessary to use a differente onClick function
 */

export function AgentEntities(props) {
  let items = [<NavItem style={{ color: '#4e4e4e' }} key="newEntity" href="#">{messages.emptyEntityList.defaultMessage}</NavItem>];
  if (props.agentEntities && props.agentEntities.length > 0) {
    items = props.agentEntities.map((agentEntity, agentIndex) => {
      let entityColor = props.dirOfColors[agentEntity.entityName];
      if (!entityColor) {
        props.dirOfColors[agentEntity.entityName] = agentEntity.uiColor;
      }
      return (
        <NavItem
          onClick={props.userSays ?
            props.onClickFunction.bind(null, props.userSays, agentEntity.entityName, agentEntity.entityName) :
            props.onClickFunction.bind(null, agentEntity.entityName)}
          key={agentIndex}
        >
          <span style={{ color: agentEntity.uiColor }}>
                        @{agentEntity.entityName}
          </span>
        </NavItem>
      );
    });
  }

  items.push(
    <NavItem key="divider" divider />,
  );

  if (props.createEntity) {
    items.push(
      <NavItem style={{ color: '#4e4e4e' }} key="newEntity" href="/entities/create">{messages.createEntity.defaultMessage}</NavItem>,
    );
  }

  return (
    <Dropdown className="dropdown-entity-selector" trigger={<span id={`userSayingDropdown_${props.index}`}></span>} options={{ belowOrigin: true }}>
      {items}
    </Dropdown>
  );
}

AgentEntities.propTypes = {
  agentEntities: React.PropTypes.array,
  userSays: React.PropTypes.string,
  onClickFunction: React.PropTypes.func,
  dirOfColors: React.PropTypes.object,
  index: React.PropTypes.number,
  createEntity: React.PropTypes.bool,
};

export default AgentEntities;
