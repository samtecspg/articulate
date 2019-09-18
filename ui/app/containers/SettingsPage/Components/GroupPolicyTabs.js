import { FormControlLabel, Switch, Typography } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
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
const GroupPolicyTabs = ({
  accessPolicyGroups,
  selectedGroup,
  handleChange,
  onUpdateAccessPolicyGroup,
  classes,
}) => {
  if (
    !accessPolicyGroups ||
    (accessPolicyGroups && accessPolicyGroups.length === 0)
  ) {
    return null;
  }
  const currentGroup = !selectedGroup ? accessPolicyGroups[0] : selectedGroup;
  return (
    <div>
      <Typography className={classes.label} id="groupPoliciesLabel">
        <FormattedMessage {...messages.groupPoliciesLabel} />
      </Typography>
      <div className={classes.label}>
        <Select
          value={currentGroup.id}
          onChange={evt => {
            handleChange({
              accessPolicyGroup: _.find(accessPolicyGroups, {
                id: evt.target.value,
              }),
            });
          }}
          inputProps={{}}
        >
          {accessPolicyGroups.map(group => (
            <MenuItem key={group.id} value={group.id}>
              {group.name}
            </MenuItem>
          ))}
        </Select>
      </div>

      {_.map(currentGroup.rules, (value, name) => (
        <FormControlLabel
          key={name}
          control={
            <Switch
              color="primary"
              checked={value}
              onChange={(evt, newValue) => {
                const updatedRules = {
                  ...currentGroup.rules,
                  ...{ [name]: newValue },
                };
                onUpdateAccessPolicyGroup({
                  groupName: currentGroup.name,
                  rules: updatedRules,
                });
              }}
            />
          }
          label={name}
        />
      ))}
    </div>
  );
};
GroupPolicyTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  accessPolicyGroups: PropTypes.array,
  selectedGroup: PropTypes.object,
  handleChange: PropTypes.func.isRequired,
  onUpdateAccessPolicyGroup: PropTypes.func.isRequired,
};

GroupPolicyTabs.defaultProps = {
  accessPolicyGroups: [],
  selectedGroup: null,
};

export default injectIntl(withStyles(styles)(GroupPolicyTabs));
