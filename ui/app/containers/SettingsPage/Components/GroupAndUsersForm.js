import React from 'react';
import {
  Grid,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';
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
};

/* eslint-disable react/prefer-stateless-function */
export class GroupAndUsersForm extends React.Component {

  render() {
    const { classes, intl, settings } = this.props;
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
};

export default injectIntl(withStyles(styles)(GroupAndUsersForm));
