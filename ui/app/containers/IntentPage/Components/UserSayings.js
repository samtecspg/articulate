import React from 'react';
import UserSayingsRows from './UserSayingsRows';

export function UserSayings(props) {
  return <UserSayingsRows
    examples={props.examples}
    onRemoveExample={props.onRemoveExample}
    onTagEntity={props.onTagEntity}
    setWindowSelection={props.setWindowSelection}
    agentEntities={props.agentEntities}
  />;
}

UserSayings.propTypes = {
  examples: React.PropTypes.array,
  onRemoveExample: React.PropTypes.func,
  onTagEntity: React.PropTypes.func,
  setWindowSelection: React.PropTypes.func,
  agentEntities: React.PropTypes.array,
};

export default UserSayings;
