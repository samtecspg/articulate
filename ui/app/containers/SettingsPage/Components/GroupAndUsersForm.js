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

/* eslint-disable react/prefer-stateless-function */
export class GroupAndUsersForm extends React.Component {
  render() {
    const {
      intl,
      settings,
      accessPolicyGroups,
      selectedAccessPolicyGroup,
      handleOnchangeAccessPolicyGroup,
      onUpdateAccessPolicyGroup
    } = this.props;
    return (
      <Grid container spacing={16}>
        <Grid container justify="space-between" spacing={24} item xs={12}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.allowNewUsersSignUps}
                  onChange={(evt, value) => {
                    this.props.onChangeSettingsData(
                      'allowNewUsersSignUps',
                      value,
                    );
                  }}
                  value="multiCategory"
                  color="primary"
                />
              }
              label={intl.formatMessage(messages.allowNewUsersSignUps)}
            />
            <GroupPolicyTabs
              accessPolicyGroups={accessPolicyGroups}
              selectedGroup={selectedAccessPolicyGroup}
              handleChange={handleOnchangeAccessPolicyGroup}
              onUpdateAccessPolicyGroup={onUpdateAccessPolicyGroup}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

GroupAndUsersForm.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  settings: PropTypes.object,
  onChangeSettingsData: PropTypes.func,
  errorState: PropTypes.object,
  accessPolicyGroups: PropTypes.array,
  selectedAccessPolicyGroup: PropTypes.object,
  handleOnchangeAccessPolicyGroup: PropTypes.func.isRequired,
  onUpdateAccessPolicyGroup: PropTypes.func.isRequired,
};

export default injectIntl(withStyles(styles)(GroupAndUsersForm));
