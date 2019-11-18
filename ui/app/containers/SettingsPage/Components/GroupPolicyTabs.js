import { Button, FormControlLabel, Grid, Switch, TextField, Typography } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
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
  buttonContainer: {
    position: 'relative',
    bottom: '10px',
  },
};
const GroupPolicyTabs = ({
  accessPolicyGroups,
  selectedGroup,
  handleChange,
  onUpdateAccessPolicyGroup,
  onAddAccessPolicyGroup,
  classes,
  intl,
  onUpdateNewAccessPolicyGroupName,
  newAccessPolicyGroupName,
  isReadOnly
}) => {
  if (!accessPolicyGroups || (accessPolicyGroups && accessPolicyGroups.length === 0) || _.isNull(selectedGroup)) {
    return null;
  }

  const accessPolicyGroup = _.find(accessPolicyGroups, {
    id: selectedGroup,
  });
  return (
    <div>
      <Typography className={classes.label} id="groupPoliciesLabel">
        <FormattedMessage {...messages.groupPoliciesLabel} />
      </Typography>
      <div className={classes.label}>
        <Grid className={classes.buttonContainer}>
          <TextField
            id="groupName"
            label={intl.formatMessage(messages.groupNameTextField)}
            value={newAccessPolicyGroupName}
            placeholder={intl.formatMessage(messages.groupNameTextFieldPlaceholder)}
            onChange={evt => onUpdateNewAccessPolicyGroupName({ groupName: evt.target.value })}
            margin="normal"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            helperText={intl.formatMessage(messages.requiredField)}
          />
        </Grid>
        <Grid className={classes.buttonContainer}>
          <Button
            key="btnFinish"
            variant="contained"
            onClick={() => {
              onAddAccessPolicyGroup({ groupName: newAccessPolicyGroupName, rules: {} });
              onUpdateNewAccessPolicyGroupName({ groupName: '' });
            }}
          >
            <FormattedMessage {...messages.saveButton} />
          </Button>
        </Grid>
        <Select
          value={accessPolicyGroup ? accessPolicyGroup.id : null}
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

      {_.map(accessPolicyGroup.rules, (value, name) => (
        <FormControlLabel
          key={name}
          control={
            <Switch
              disabled={isReadOnly || accessPolicyGroup.isAdmin}
              color="primary"
              checked={value}
              onChange={(evt, newValue) => {
                const updatedRules = {
                  ...accessPolicyGroup.rules,
                  ...{ [name]: newValue },
                };
                onUpdateAccessPolicyGroup({
                  groupName: accessPolicyGroup.name,
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
  selectedGroup: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  onUpdateAccessPolicyGroup: PropTypes.func.isRequired,
  onAddAccessPolicyGroup: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  newAccessPolicyGroupName: PropTypes.string.isRequired,
  onUpdateNewAccessPolicyGroupName: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
};

GroupPolicyTabs.defaultProps = {
  accessPolicyGroups: [],
  selectedGroup: null,
};

export default injectIntl(withStyles(styles)(GroupPolicyTabs));
