import { FormControlLabel, Switch, Typography } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { AGENT_ACCESS_POLICIES } from '../../../../common/constants';
import messages from '../messages';

const styles = {
  panelContent: {
    display: 'inline',
    fontSize: '14px',
    fontWeight: 300,
    color: '#4e4e4e',
    width: '95%',
  },
  label: {
    paddingBottom: '20px',
    fontSize: '12px',
    color: '#a2a7b1',
  },
};

/**
 * @return {null}
 */
export function AgentAccessControlSettings({ classes, users, accessPolicies, onUpdateAccessPolicy, selectedUser, onAccessControlUserChange, isReadOnly }) {
  if (users.length === 0) {
    return null;
  }
  const currentUser = !selectedUser ? users[0] : selectedUser;
  const currentIsAdmin = currentUser.groups.indexOf('admin') >= 0;
  const currentAccessPolicies = accessPolicies ? accessPolicies[currentUser.id] : false || AGENT_ACCESS_POLICIES;
  return (
    <div>
      <Typography className={classes.label} id="groupPoliciesLabel">
        <FormattedMessage {...messages.accessControlLabel} />
      </Typography>
      <div className={classes.label}>
        <Select
          value={currentUser.id}
          onChange={evt => {
            onAccessControlUserChange({
              user: _.find(users, {
                id: evt.target.value,
              }),
            });
          }}
          inputProps={{}}
        >
          {users.map(user => (
            <MenuItem key={user.id} value={user.id}>
              {user.name}
            </MenuItem>
          ))}
        </Select>
      </div>
      {_.map(currentAccessPolicies, (value, name) => (
        <FormControlLabel
          key={name}
          control={
            <Switch
              disabled={isReadOnly || currentIsAdmin}
              color="primary"
              checked={currentIsAdmin || value}
              onChange={(evt, newValue) => {
                const updatedAccessPolicies = {
                  ...accessPolicies,
                  ...{
                    [currentUser.id]: {
                      ...currentAccessPolicies,
                      ...{ [name]: newValue },
                    },
                  },
                };
                onUpdateAccessPolicy('accessPolicies', updatedAccessPolicies);
              }}
            />
          }
          label={name}
        />
      ))}
    </div>
  );
}

AgentAccessControlSettings.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  users: PropTypes.array,
  accessPolicies: PropTypes.object,
  onUpdateAccessPolicy: PropTypes.func.isRequired,
  selectedUser: PropTypes.object,
  onAccessControlUserChange: PropTypes.func,
  isReadOnly: PropTypes.bool,
};
AgentAccessControlSettings.defaultProps = {
  users: [],
  selectedUser: null,
  isReadOnly: false,
};
export default injectIntl(withStyles(styles)(AgentAccessControlSettings));
