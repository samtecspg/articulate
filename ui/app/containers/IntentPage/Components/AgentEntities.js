import React from 'react';
import {
  Dropdown,
  NavItem,
} from 'react-materialize';
import Immutable from 'seamless-immutable';
import messages from '../messages';
import SystemEntities from 'components/SystemEntities';

/**
 *
 * This component is the dropdown menu for the entities
 * Given that is present for user sayings and responses
 * it is necessary to use a differente onClick function
 */

export function AgentEntities(props) {
  const systemEntities = SystemEntities(props.userSays, props.onClickFunction);
  const newEntityDefault = <NavItem style={{ color: '#4e4e4e' }} key="newEntityDefault" href="#">{messages.emptyEntityList.defaultMessage}</NavItem>;
  const newEntity = <NavItem style={{ color: '#4e4e4e' }} key="newEntity" href="/entities/create">{messages.createEntity.defaultMessage}</NavItem>;
  let items = undefined;

  const entitiesItems = props.agentEntities.entities
    .map((agentEntity, agentIndex) => {
      if (agentEntity.type === 'regex'){
        return null;
      }
      return (
        <NavItem
          onClick={props.userSays ?
            props.onClickFunction.bind(null, props.userSays, agentEntity) :
            props.onClickFunction.bind(null, agentEntity)}
          key={agentIndex}
        >
          <span style={{ color: agentEntity.uiColor }}>
                        @{agentEntity.entityName}
          </span>
        </NavItem>
      );
    });
    items = Immutable([entitiesItems])
  // if (props.createEntity) {
  //   items = Immutable([entitiesItems])
  //     //.concat(<NavItem key="dividerSysEntities" divider />)
  //     //.concat(systemEntities);
  //     //.concat(<NavItem key="dividerNewEntity" divider />)
  //     //.concat(newEntity);
  // } else {
  //   items = Immutable([entitiesItems])
  //     .concat(<NavItem key="divider" divider />)
  //     .concat(systemEntities);;
  // }

  return (
    <Dropdown className="dropdown-entity-selector" trigger={<span id={`userSayingDropdown_${props.index}`}></span>} options={{ belowOrigin: true }}>
      {items}
    </Dropdown>
  );
}

AgentEntities.propTypes = {
  agentEntities: React.PropTypes.object,
  userSays: React.PropTypes.string,
  onClickFunction: React.PropTypes.func,
  index: React.PropTypes.number,
  createEntity: React.PropTypes.bool,
};

export default AgentEntities;
