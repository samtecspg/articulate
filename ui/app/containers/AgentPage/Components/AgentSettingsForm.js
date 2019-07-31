import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import PropTypes from 'prop-types';
import {
  Grid,
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  FormHelperText,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import WebhookSettings from 'components/WebhookSettings';
import ResponseSettings from 'components/ResponseSettings';
import RasaSettings from 'components/RasaSettings';
import DucklingSettings from 'components/DucklingSettings';
import TrainingSettings from './TrainingSettings';

import messages from '../messages';

import expandedNotEnabled from '../../../images/expand-not-enabled-icon.svg';
import expandedNotEnabledOpened from '../../../images/expand-not-enabled-opened-icon.svg';
import expandedEnabled from '../../../images/expand-enabled-icon.svg';
import expandedEnabledOpened from '../../../images/expand-enabled-opened-icon.svg';
import expandedSingle from '../../../images/expand-single-icon.svg';
import expandedSingleOpened from '../../../images/expand-single-opened-icon.svg';

const styles = {
  formContainer: {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #c5cbd8',
    borderBottomLeftRadius: '5px',
    borderBottomRightRadius: '5px',
  },
  formSubContainer: {
    padding: '40px 25px',
  },
  root: {
    width: '100%',
  },
  panelHeading: {
    fontSize: '15px',
    color: '#4e4e4e',
  },
};

/* eslint-disable react/prefer-stateless-function */
class AgentSettingsForm extends React.Component {
  state = {
    expanded: null,
    showSaveHint: false,
  };

  handleChange = (field, value) => {
    this.setState({
      [field]: this.state.expanded === value ? null : value,
    });
  };

  getExpandIcon = (withToggle, expanded, enabled) => {
    if (withToggle) {
      if (enabled) {
        if (expanded) {
          return <img src={expandedEnabledOpened} />;
        }
        return <img src={expandedEnabled} />;
      }
      if (expanded) {
        return <img src={expandedNotEnabledOpened} />;
      }
      return <img src={expandedNotEnabled} />;
    }
    if (expanded) {
      return <img src={expandedSingleOpened} />;
    }
    return <img src={expandedSingle} />;
  };

  render() {
    const { classes, agent, webhook, postFormat, agentSettings, intl } = this.props;
    const { expanded } = this.state;
    return (
      <Grid className={classes.formContainer} container item xs={12}>
        <Grid
          className={classes.formSubContainer}
          id="formContainer"
          container
          item
          xs={12}
        >
          <div className={classes.root}>
            <ExpansionPanel
              expanded={expanded === 'panelWebhook'}
              onChange={() => {
                this.handleChange('expanded', 'panelWebhook');
              }}
            >
              <ExpansionPanelSummary
                expandIcon={this.getExpandIcon(
                  true,
                  expanded === 'panelWebhook',
                  agent.useWebhook,
                )}
              >
                <Typography className={classes.panelHeading}>
                  <FormattedMessage {...messages.webhookSetting} />
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <WebhookSettings
                  useWebhook={agent.useWebhook}
                  webhook={webhook}
                  onChangeUseWebhook={this.props.onChangeAgentData}
                  onChangeWebhookData={this.props.onChangeWebhookData}
                  onChangeWebhookPayloadType={
                    this.props.onChangeWebhookPayloadType
                  }
                  webhookSettingDescription={messages.webhookSettingDescription}
                  onAddNewHeader={this.props.onAddNewHeader}
                  onDeleteHeader={this.props.onDeleteHeader}
                  onChangeHeaderName={this.props.onChangeHeaderName}
                  onChangeHeaderValue={this.props.onChangeHeaderValue}
                  errorState={this.props.errorState}
                />
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel
              expanded={expanded === 'panelResponse'}
              onChange={() => {
                this.handleChange('expanded', 'panelResponse');
              }}
            >
              <ExpansionPanelSummary
                expandIcon={this.getExpandIcon(
                  true,
                  expanded === 'panelResponse',
                  agent.usePostFormat,
                )}
              >
                <Typography className={classes.panelHeading}>
                  <FormattedMessage {...messages.responseSetting} />
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <ResponseSettings
                  postFormat={postFormat}
                  usePostFormat={agent.usePostFormat}
                  onChangeUsePostFormatData={this.props.onChangeAgentData}
                  onChangePostFormatData={this.props.onChangePostFormatData}
                  responseSettingDescription={
                    messages.responseSettingDescription
                  }
                  errorState={this.props.errorState}
                />
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel
              expanded={expanded === 'panelTraining'}
              onChange={() => {
                this.handleChange('expanded', 'panelTraining');
              }}
            >
              <ExpansionPanelSummary
                expandIcon={this.getExpandIcon(
                  true,
                  expanded === 'panelTraining',
                  agent.enableModelsPerCategory || agent.extraTrainingData,
                )}
              >
                <Typography className={classes.panelHeading}>
                  <FormattedMessage {...messages.trainingSetting} />
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <TrainingSettings
                  agent={agent}
                  onChangeAgentData={this.props.onChangeAgentData}
                  errorState={this.props.errorState}
                />
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel
              expanded={expanded === 'panelRasa'}
              onChange={() => {
                this.handleChange('expanded', 'panelRasa');
              }}
            >
              <ExpansionPanelSummary
                expandIcon={this.getExpandIcon(false, expanded === 'panelRasa')}
              >
                <Typography className={classes.panelHeading}>
                  <FormattedMessage {...messages.rasaSetting} />
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <RasaSettings
                  settings={agentSettings}
                  onChangeSettingsData={this.props.onChangeAgentSettingsData}
                  errorState={this.props.errorState}
                />
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel
              expanded={expanded === 'panelDuckling'}
              onChange={() => {
                this.handleChange('expanded', 'panelDuckling');
              }}
            >
              <ExpansionPanelSummary
                expandIcon={this.getExpandIcon(
                  false,
                  expanded === 'panelDuckling',
                )}
              >
                <Typography className={classes.panelHeading}>
                  <FormattedMessage {...messages.ducklingSetting} />
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <DucklingSettings
                  settings={agentSettings}
                  onChangeSettingsData={this.props.onChangeAgentSettingsData}
                  errorState={this.props.errorState}
                />
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel
              expanded={expanded === 'panelLogging'}
              onChange={() => {
                this.handleChange('expanded', 'panelLogging');
              }}
            >
              <ExpansionPanelSummary
                expandIcon={this.getExpandIcon(
                  false,
                  expanded === 'panelLogging',
                )}
              >
                <Typography className={classes.panelHeading}>
                  <FormattedMessage {...messages.loggingSetting} />
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Grid container spacing={16}>
                  <Grid item xs={12}>
                    <TextField
                      id="slackLoggingURL"
                      label={intl.formatMessage(messages.slackLoggingURL)}
                      value={agentSettings.slackLoggingURL ? agentSettings.slackLoggingURL : ''}
                      placeholder={intl.formatMessage(
                        messages.slackLoggingURLPlaceholder,
                      )}
                      onChange={evt => {
                        this.props.onChangeAgentSettingsData('slackLoggingURL', evt.target.value);
                      }}
                      margin="normal"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      helperText={intl.formatMessage(messages.requiredField)}
                      error={this.props.errorState.webhookUrl}
                    />
                  </Grid>
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel
              expanded={expanded === 'panelDiscovery'}
              onChange={() => {
                this.handleChange('expanded', 'panelDiscovery');
              }}
            >
              <ExpansionPanelSummary
                expandIcon={this.getExpandIcon(
                  false,
                  expanded === 'panelDiscovery',
                )}
              >
                <Typography className={classes.panelHeading}>
                  <FormattedMessage {...messages.discoverySetting} />
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Grid container spacing={16}>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={agent.enableDiscoverySheet}
                          onChange={(evt, value) => {
                            this.setState({
                              showSaveHint: true
                            })
                            this.props.onChangeAgentData('enableDiscoverySheet', value);
                          }}
                          value="enableDiscoverySheet"
                          color="primary"
                          inputProps={{
                            'aria-describedby': "helper-text"
                          }}
                        />
                      }
                      label={intl.formatMessage(messages.enableDiscoverySheet)}
                    />
                    {
                      this.state.showSaveHint ?
                      <FormHelperText  style={{marginTop: '0px', marginBottom: '10px'}} id='helper-text'>
                        *Save to apply changes
                      </FormHelperText>
                      : null
                    }
                  </Grid>
                  {
                    agent.enableDiscoverySheet ? 
                    <Grid item xs={12}>
                      <Typography>
                        <a style={{textDecoration: 'none'}} target='_blank' href={`${window.location.protocol}//${
                          window.location.hostname
                        }:${window.location.port}/agent/${
                          agent.id
                        }/discovery`}>
                        <Button variant='contained'>
                          {intl.formatMessage(messages.openDiscoverySheet)}
                        </Button>
                        </a>
                      </Typography>
                    </Grid>
                    : null
                  }
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </div>
        </Grid>
      </Grid>
    );
  }
}

AgentSettingsForm.propTypes = {
  intl: intlShape.isRequired,
  classes: PropTypes.object.isRequired,
  agent: PropTypes.object,
  webhook: PropTypes.object,
  postFormat: PropTypes.object,
  agentSettings: PropTypes.object,
  onChangeAgentData: PropTypes.func,
  onChangeWebhookData: PropTypes.func,
  onChangeWebhookPayloadType: PropTypes.func,
  onAddNewHeader: PropTypes.func,
  onDeleteHeader: PropTypes.func,
  onChangeHeaderName: PropTypes.func,
  onChangeHeaderValue: PropTypes.func,
  onChangePostFormatData: PropTypes.func,
  onChangeAgentSettingsData: PropTypes.func,
  errorState: PropTypes.object,
};

export default injectIntl(withStyles(styles)(AgentSettingsForm));
