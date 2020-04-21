import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import PropTypes from 'prop-types';
import { Grid, Typography, FormControlLabel, Switch, Tooltip, Icon, TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import messages from '../messages';

const styles = {
  panelContent: {
    display: 'inline',
    fontSize: '14px',
    fontWeight: 300,
    color: '#4e4e4e',
    width: '95%',
  },
  errorMessage: {
    color: '#f44336',
    display: 'inline',
    fontSize: '0.75rem',
    minHeight: '1em',
    fontWeight: 400,
    width: '95%',
  },
  spanLabelExamples: {
    position: 'relative',
    bottom: '2px',
  },
  infoIcon: {
    color: '#4e4e4e',
    position: 'relative',
    top: '4px',
    left: '2px',
    fontSize: '18px !important',
  }
};

/* eslint-disable react/prefer-stateless-function */
export class AgentVersionsSettings extends React.Component {

  render() {
    const { classes, intl, agent } = this.props;
    return (
      <Grid container spacing={16}>
        <Grid container item xs={12}>
          <Typography className={classes.panelContent}>
            <FormattedMessage {...messages.agentVersionsDescription} />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={this.props.settings.enableAgentVersions}
                onChange={() => {
                  this.props.onChangeAgentSettingsData('enableAgentVersions', !this.props.settings.enableAgentVersions);
                }}
                value="enableAgentVersions"
                color="primary"
              />
            }
            label={
              <span className={classes.spanLabelExamples}>
                {intl.formatMessage(messages.agentVersions)}
                <Tooltip placement="top" title={intl.formatMessage(messages.agentVersionsHelp)}>
                  <Icon className={classes.infoIcon}>info</Icon>
                </Tooltip>
              </span>
            }
          />
        </Grid>
      </Grid>
    );
  }
}

AgentVersionsSettings.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  agent: PropTypes.object,
  onChangeAgentSettingsData: PropTypes.func,
  errorState: PropTypes.object,
  settings: PropTypes.object,
};

export default injectIntl(withStyles(styles)(AgentVersionsSettings));
