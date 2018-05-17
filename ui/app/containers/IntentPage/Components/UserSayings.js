import React from 'react';
import UserSayingsRows from './UserSayingsRows';

export function UserSayings(props) {
  return <UserSayingsRows
    examples={props.examples}
    page={props.page}
    defaultPageSize={props.defaultPageSize}
    onRemoveExample={props.onRemoveExample}
    onTagEntity={props.onTagEntity}
    setWindowSelection={props.setWindowSelection}
    agentEntities={props.agentEntities}
  />;
}

UserSayings.propTypes = {
  examples: React.PropTypes.array,
  page: React.PropTypes.number,
  defaultPageSize: React.PropTypes.number,
  onRemoveExample: React.PropTypes.func,
  onTagEntity: React.PropTypes.func,
  setWindowSelection: React.PropTypes.func,
  agentEntities: React.PropTypes.object,
};

export default UserSayings;
