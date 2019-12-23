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
    color: '#979797',
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
  constructor(props) {
    super(props);

    this.initialState = {
      generateSlotsQuickResponsesSelected: this.props.settings.generateSlotsQuickResponses ? this.props.settings.generateSlotsQuickResponses : false,
      currentSlotQuickResponsesMax: this.props.settings.generateSlotsQuickResponsesMax ? this.props.settings.generateSlotsQuickResponsesMax : 1,
      generateActionsQuickResponsesSelected: this.props.settings.generateActionsQuickResponses ? this.props.settings.generateActionsQuickResponses : false,
      currentActionsQuickResponsesMax: this.props.settings.generateActionsQuickResponsesMax ? this.props.settings.generateActionsQuickResponsesMax : 1,
    };
    this.state = this.initialState;
    this.handleCurrentSlotQuickResponsesMaxValidation = this.handleCurrentSlotQuickResponsesMaxValidation.bind(this);
    this.handleCurrentSlotQuickResponsesMaxChange = this.handleCurrentSlotQuickResponsesMaxChange.bind(this);
  }

  handleCurrentSlotQuickResponsesMaxChange = async ev => {
    if (ev.target.value < 1 && ev.target.value != '') {
      await this.setState({ currentSlotQuickResponsesMax: 1 });
    } else {
      await this.setState({ currentSlotQuickResponsesMax: Number(ev.target.value) === 0 ? ev.target.value : ev.target.value.replace(/^0+/, '') });
    }
  };

  handleCurrentSlotQuickResponsesMaxValidation = async () => {
    if (this.state.currentSlotQuickResponsesMax === '') {
      await this.setState({ currentSlotQuickResponsesMax: 1 });
    }
  };

  handleCurrentActionsQuickResponsesMaxChange = async ev => {
    if (ev.target.value < 1 && ev.target.value != '') {
      await this.setState({ currentActionsQuickResponsesMax: 1 });
    } else {
      await this.setState({ currentActionsQuickResponsesMax: Number(ev.target.value) === 0 ? ev.target.value : ev.target.value.replace(/^0+/, '') });
    }
  };

  handleCurrentActionsQuickResponsesMaxValidation = async () => {
    if (this.state.currentActionsQuickResponsesMax === '') {
      await this.setState({ currentActionsQuickResponsesMax: 1 });
    }
  };

  render() {
    const { classes, intl, agent } = this.props;
    return (
      <Grid container spacing={16}>
        <Grid container item xs={12}>
          <Typography className={classes.panelContent}>
            <FormattedMessage {...messages.trainingSettingDescription} />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={this.state.generateSlotsQuickResponsesSelected}
                onChange={() => {
                  this.props.onChangeAgentSettingsData('generateSlotsQuickResponses', !this.state.generateSlotsQuickResponsesSelected);
                  this.setState({ generateSlotsQuickResponsesSelected: !this.state.generateSlotsQuickResponsesSelected });
                }}
                value="extraTrainingData"
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

          {this.state.generateSlotsQuickResponsesSelected && (
            <Grid container item xs={12} direction="row" alignItems="stretch" style={{ paddingLeft: '16px', marginBottom: '10px' }}>
              <Grid item xs={3}>
                <span className={classes.justMaxLabel}>{intl.formatMessage(messages.slotsQuickRepliesLabel)}</span>
                <TextField
                  id="standard-number-just-max"
                  type="number"
                  value={this.state.currentSlotQuickResponsesMax}
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
                    this.props.onChangeAgentSettingsData('generateSlotsQuickResponsesMax', this.state.currentSlotQuickResponsesMax);
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    style: {
                      border: 'none',
                      paddingRight: '0px',
                      color: '#C5CBD8',
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
                  checked={this.state.generateActionsQuickResponsesSelected}
                  onChange={() => {
                    this.props.onChangeAgentSettingsData('generateActionsQuickResponses', !this.state.generateActionsQuickResponsesSelected);
                    this.setState({ generateActionsQuickResponsesSelected: !this.state.generateActionsQuickResponsesSelected });
                  }}
                  value="extraTrainingData"
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

            {this.state.generateActionsQuickResponsesSelected && (
              <Grid container item xs={12} direction="row" alignItems="stretch" style={{ paddingLeft: '16px', marginBottom: '10px' }}>
                <Grid item xs={3}>
                  <span className={classes.justMaxLabel}>{intl.formatMessage(messages.actionsQuickRepliesLabel)}</span>
                  <TextField
                    id="standard-number-just-max"
                    type="number"
                    value={this.state.currentActionsQuickResponsesMax}
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
                      this.props.onChangeAgentSettingsData('generateActionsQuickResponsesMax', this.state.currentActionsQuickResponsesMax);
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      style: {
                        border: 'none',
                        paddingRight: '0px',
                        color: '#C5CBD8',
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
