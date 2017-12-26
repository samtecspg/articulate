import React from 'react';
import UserSayingsRows from './UserSayingsRows';

export function UserSayings(props) {

  return <UserSayingsRows
    examples={props.examples}
    onRemoveExample={props.onRemoveExample}
    onTagEntity={props.onTagEntity}
    agentEntities={props.agentEntities}
    dirOfColors={props.dirOfColors}
  />;
}

UserSayings.propTypes = {
  examples: React.PropTypes.array,
  onRemoveExample: React.PropTypes.func,
  onTagEntity: React.PropTypes.func,
  agentEntities: React.PropTypes.array,
  dirOfColors: React.PropTypes.object,
};

export default UserSayings;
