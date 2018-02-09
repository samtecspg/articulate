import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { Icon } from 'react-materialize';

export function EditDeleteButton(props) { // eslint-disable-line react/prefer-stateless-function
  return (
    <div>
      <a style={{cursor: 'pointer'}} onClick={props.onClick}>
        <Icon className="edit-delete-icon">{props.iconName}</Icon>
        <FormattedMessage {...props.label} />
      </a>
    </div>
  );
}

EditDeleteButton.propTypes = {
  label: PropTypes.object,
  onClick: PropTypes.func,
  iconName: PropTypes.string
};

export default EditDeleteButton;
