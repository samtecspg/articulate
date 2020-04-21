import PropTypes from 'prop-types';
import React from 'react';
import AC from '../../utils/accessControl';

function AccessControl({ userPolicies, requiredPolicies, children, fallback }) {
  const isValid = AC.validate({ userPolicies, requiredPolicies });
  if (isValid) {
    return (<React.Fragment>{children}</React.Fragment>);
  }
  return <React.Fragment>{fallback}</React.Fragment>;
}

AccessControl.propTypes = {
  userPolicies: PropTypes.object.isRequired,
  requiredPolicies: PropTypes.array.isRequired,
  children: PropTypes.node.isRequired,
  fallback: PropTypes.any,
};
AccessControl.defaultProps = {
  message: 'Access denied',
};

export default AccessControl;
