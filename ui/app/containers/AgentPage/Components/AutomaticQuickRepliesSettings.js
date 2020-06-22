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
  },
  justMaxLabel: {
    color: '#A2A7B1',
    fontSize: '12px',
    fontFamily: 'Montserrat',
    marginTop: '15px',
    display: 'inline-block',
  },
  justMaxInput: {
    color: '#4e4e4e !important',
    fontSize: '12pt',
    fontFamily: 'Montserrat',
    marginRight: '10px',
    marginTop: '-15px',
  },
  minMaxContainer: {
    border: '1px solid #a2a7b1',
    borderRadius: '5px',
  },
};

/* eslint-disable react/prefer-stateless-function */
export class AutomaticQuickRepliesSettings extends React.Component {
  handleCurrentSlotQuickResponsesMaxChange = async ev => {
    if (ev.target.value < 1 && ev.target.value != '') {
      this.props.onChangeAgentSettingsData('generateSlotsQuickResponsesMax', 1);
    } else {
      this.props.onChangeAgentSettingsData(
        'generateSlotsQuickResponsesMax',
        Number(ev.target.value) === 0 ? ev.target.value : ev.target.value.replace(/^0+/, ''),
      );
    }
  };

  handleCurrentSlotQuickResponsesMaxValidation = async () => {
    if (this.props.settings.generateSlotsQuickResponsesMax === '') {
      this.props.onChangeAgentSettingsData('generateSlotsQuickResponsesMax', 1);
    }
  };

  handleCurrentActionsQuickResponsesMaxChange = async ev => {
    if (ev.target.value < 1 && ev.target.value != '') {
      this.props.onChangeAgentSettingsData('generateActionsQuickResponsesMax', 1);
    } else {
      this.props.onChangeAgentSettingsData(
        'generateActionsQuickResponsesMax',
        Number(ev.target.value) === 0 ? ev.target.value : ev.target.value.replace(/^0+/, ''),
      );
    }
  };

  handleCurrentActionsQuickResponsesMaxValidation = async () => {
    if (this.props.settings.generateActionsQuickResponsesMax === '') {
      this.props.onChangeAgentSettingsData('generateActionsQuickResponsesMax', 1);
    }
  };

  render() {
    const { classes, intl, agent } = this.props;
    return (
      <Grid container spacing={16}>
        <Grid container item xs={12}>
          <Typography className={classes.panelContent}>
            <FormattedMessage {...messages.automaticQuickRepliesSettingsDescription} />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={this.props.settings.generateSlotsQuickResponses}
                onChange={() => {
                  this.props.onChangeAgentSettingsData('generateSlotsQuickResponses', !this.props.settings.generateSlotsQuickResponses);
                }}
                value="generateSlotsQuickResponses"
                color="primary"
              />
            }
            label={
              <span className={classes.spanLabelExamples}>
                {intl.formatMessage(messages.slotsQuickReplies)}
                <Tooltip placement="top" title={intl.formatMessage(messages.slotsQuickRepliesHelp)}>
                  <Icon className={classes.infoIcon}>info</Icon>
                </Tooltip>
              </span>
            }
          />

          {this.props.settings.generateSlotsQuickResponses && (
            <Grid container item xs={12} direction="row" alignItems="stretch" style={{ paddingLeft: '16px', marginBottom: '10px' }}>
              <Grid item xs={3}>
                <span className={classes.justMaxLabel}>{intl.formatMessage(messages.slotsQuickRepliesLabel)}</span>
                <TextField
                  id="standard-number-just-max"
                  type="number"
                  value={this.props.settings.generateSlotsQuickResponsesMax}
                  onChange={async ev => {
                    await this.handleCurrentSlotQuickResponsesMaxChange(ev);
                  }}
                  onKeyPress={async ev => {
                    if (ev.key === 'Enter' && ev.target.value.trim() !== '') {
                      ev.preventDefault();
                      await this.handleCurrentSlotQuickResponsesMaxValidation();
                    }
                  }}
                  onBlur={async () => {
                    await this.handleCurrentSlotQuickResponsesMaxValidation();
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    style: {
                      border: 'none',
                      paddingRight: '0px',
                      color: '#4e4e4e',
                    },
                  }}
                  InputProps={{
                    className: classes.minMaxContainer,
                  }}
                  className={classes.justMaxInput}
                />
              </Grid>
            </Grid>
          )}

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={this.props.settings.generateActionsQuickResponses}
                  onChange={() => {
                    this.props.onChangeAgentSettingsData('generateActionsQuickResponses', !this.props.settings.generateActionsQuickResponses);
                  }}
                  value="generateActionsQuickResponses"
                  color="primary"
                />
              }
              label={
                <span className={classes.spanLabelExamples}>
                  {intl.formatMessage(messages.actionsQuickReplies)}
                  <Tooltip placement="top" title={intl.formatMessage(messages.actionsQuickRepliesHelp)}>
                    <Icon className={classes.infoIcon}>info</Icon>
                  </Tooltip>
                </span>
              }
            />

            {this.props.settings.generateActionsQuickResponses && (
              <Grid container item xs={12} direction="row" alignItems="stretch" style={{ paddingLeft: '16px', marginBottom: '10px' }}>
                <Grid item xs={3}>
                  <span className={classes.justMaxLabel}>{intl.formatMessage(messages.actionsQuickRepliesLabel)}</span>
                  <TextField
                    id="standard-number-just-max"
                    type="number"
                    value={this.props.settings.generateActionsQuickResponsesMax}
                    onChange={async ev => {
                      await this.handleCurrentActionsQuickResponsesMaxChange(ev);
                    }}
                    onKeyPress={async ev => {
                      if (ev.key === 'Enter' && ev.target.value.trim() !== '') {
                        ev.preventDefault();
                        await this.handleCurrentActionsQuickResponsesMaxValidation();
                      }
                    }}
                    onBlur={async () => {
                      await this.handleCurrentActionsQuickResponsesMaxValidation();
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      style: {
                        border: 'none',
                        paddingRight: '0px',
                        color: '#4e4e4e',
                      },
                    }}
                    InputProps={{
                      className: classes.minMaxContainer,
                    }}
                    className={classes.justMaxInput}
                  />
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

AutomaticQuickRepliesSettings.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  agent: PropTypes.object,
  onChangeAgentSettingsData: PropTypes.func,
  errorState: PropTypes.object,
  settings: PropTypes.object,
};

export default injectIntl(withStyles(styles)(AutomaticQuickRepliesSettings));
