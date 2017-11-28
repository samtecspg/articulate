import React from 'react';
import { NavItem, Dropdown } from 'react-materialize';
import messages from '../messages';
import * as camel from 'to-camel-case';

/**
 * 
 * This component is the dropdown menu for the entities
 * Given that is present for user sayings and responses
 * it is necessary to use a differente onClick function
 */

export function AgentEntities(props) {

    let items = [<NavItem style={{color: '#4e4e4e'}} key="newEntity" href="#">{messages.emptyEntityList.defaultMessage}</NavItem>];
    if (props.agentEntities && props.agentEntities.length > 0){
        items = props.agentEntities.map( (agentEntity, agentIndex) => {
            let entityColor = props.dirOfColors[agentEntity.entityName];
            if (!entityColor){
                const randomColorIndex = Math.floor(Math.random() * props.colorArray.length);
                entityColor = props.colorArray[randomColorIndex];
                props.dirOfColors[agentEntity.entityName] = entityColor;
                props.colorArray.splice(randomColorIndex, 1)
            }
            return(
                <NavItem 
                    onClick={props.userSays ? 
                    props.onClickFunction.bind(null, props.userSays, agentEntity.entityName, camel(agentEntity.entityName)) : 
                    props.onClickFunction.bind(null, camel(agentEntity.entityName))} 
                    key={agentIndex}
                >
                    <span style={{color: entityColor}}>
                        @{camel(agentEntity.entityName)}
                    </span>
                </NavItem>
            )
        });
    }

    items.push(
        <NavItem key="divider" divider />
    );

    if (props.createEntity){
        items.push(
            <NavItem style={{color: '#4e4e4e'}} key="newEntity" href="/entities/create">{messages.createEntity.defaultMessage}</NavItem>
        );
    }

    return (
        <Dropdown className='dropdown-entity-selector' trigger={<span id={'userSayingDropdown_' + props.index}></span>} options={{belowOrigin: true}}>
            {items}
        </Dropdown>
    )
}

AgentEntities.propTypes = {
    agentEntities: React.PropTypes.array,
    userSays: React.PropTypes.string,
    onClickFunction: React.PropTypes.func,
    dirOfColors: React.PropTypes.object,
    colorArray: React.PropTypes.array,
    index: React.PropTypes.number,
    createEntity: React.PropTypes.bool,
};

export default AgentEntities;
