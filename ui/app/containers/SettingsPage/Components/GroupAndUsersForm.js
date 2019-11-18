import { FormControlLabel, Grid, Switch } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import messages from '../messages';
import GroupPolicyTabs from './GroupPolicyTabs';

const styles = {
  panelContent: {
    display: 'inline',
    fontSize: '14px',
    fontWeight: 300,
    color: '#4e4e4e',
    width: '95%',
  },
};

export function GroupAndUsersForm(props) {
  const {
    intl,
    settings,
    accessPolicyGroups,
    selectedAccessPolicyGroup,
    handleOnchangeAccessPolicyGroup,
    onUpdateAccessPolicyGroup,
    onAddAccessPolicyGroup,
    newAccessPolicyGroupName,
    onUpdateNewAccessPolicyGroupName,
    isReadOnly,
  } = props;
  return (
    <Grid container spacing={16}>
      <Grid container justify="space-between" spacing={24} item xs={12}>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.allowNewUsersSignUps}
                onChange={(evt, value) => {
                  props.onChangeSettingsData('allowNewUsersSignUps', value);
                }}
                value="multiCategory"
                color="primary"
              />
            }
            label={intl.formatMessage(messages.allowNewUsersSignUps)}
          />
          <GroupPolicyTabs
            isReadOnly={isReadOnly}
            accessPolicyGroups={accessPolicyGroups}
            selectedGroup={selectedAccessPolicyGroup}
            handleChange={handleOnchangeAccessPolicyGroup}
            onUpdateAccessPolicyGroup={onUpdateAccessPolicyGroup}
            onAddAccessPolicyGroup={onAddAccessPolicyGroup}
            newAccessPolicyGroupName={newAccessPolicyGroupName}
            onUpdateNewAccessPolicyGroupName={onUpdateNewAccessPolicyGroupName}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

GroupAndUsersForm.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  settings: PropTypes.object,
  onChangeSettingsData: PropTypes.func,
  errorState: PropTypes.object,
  accessPolicyGroups: PropTypes.array,
  selectedAccessPolicyGroup: PropTypes.string,
  handleOnchangeAccessPolicyGroup: PropTypes.func.isRequired,
  onUpdateAccessPolicyGroup: PropTypes.func.isRequired,
  onAddAccessPolicyGroup: PropTypes.func.isRequired,
  newAccessPolicyGroupName: PropTypes.string.isRequired,
  onUpdateNewAccessPolicyGroupName: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
};

export default injectIntl(withStyles(styles)(GroupAndUsersForm));
