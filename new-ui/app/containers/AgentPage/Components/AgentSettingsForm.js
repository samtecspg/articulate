import React from "react";
import { FormattedMessage } from "react-intl";

import PropTypes from "prop-types";
import {
  Grid,
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import WebhookSettings from 'components/WebhookSettings';
import ResponseSettings from 'components/ResponseSettings';
import RasaSettings from 'components/RasaSettings';
import DucklingSettings from 'components/DucklingSettings';
import TrainingSettings from './TrainingSettings';

import messages from "../messages";

import expandedNotEnabled from "../../../images/expand-not-enabled-icon.svg";
import expandedNotEnabledOpened from "../../../images/expand-not-enabled-opened-icon.svg";
import expandedEnabled from "../../../images/expand-enabled-icon.svg";
import expandedEnabledOpened from "../../../images/expand-enabled-opened-icon.svg";
import expandedSingle from "../../../images/expand-single-icon.svg";
import expandedSingleOpened from "../../../images/expand-single-opened-icon.svg";

const styles = {
  formContainer: {
    backgroundColor: "#ffffff",
    borderTop: "1px solid #c5cbd8",
    borderBottomLeftRadius: "5px",
    borderBottomRightRadius: "5px",
  },
  formSubContainer: {
    padding: "40px 25px",
  },
  root: {
    width: "100%",
  },
  panelHeading: {
    fontSize: "15px",
    color: "#4e4e4e",
  },
};

/* eslint-disable react/prefer-stateless-function */
class AgentSettingsForm extends React.Component {
  state = {
    expanded: null,
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
    const { classes, agent, webhook, postFormat, agentSettings } = this.props;
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
              expanded={expanded === "panelWebhook"}
              onChange={() => {
                this.handleChange("expanded", "panelWebhook");
              }}
            >
              <ExpansionPanelSummary
                expandIcon={this.getExpandIcon(
                  true,
                  expanded === "panelWebhook",
                  agent.useWebhook
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
                  onChangeWebhookPayloadType={this.props.onChangeWebhookPayloadType}
                  webhookSettingDescription={messages.webhookSettingDescription}
                  errorState={this.props.errorState}
                />
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel
              expanded={expanded === "panelResponse"}
              onChange={() => {
                this.handleChange("expanded", "panelResponse");
              }}
            >
              <ExpansionPanelSummary
                expandIcon={this.getExpandIcon(
                  true,
                  expanded === "panelResponse",
                  agent.usePostFormat
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
                  responseSettingDescription={messages.responseSettingDescription}
                  errorState={this.props.errorState}
                />
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel
              expanded={expanded === "panelTraining"}
              onChange={() => {
                this.handleChange("expanded", "panelTraining");
              }}
            >
              <ExpansionPanelSummary
                expandIcon={this.getExpandIcon(
                  true,
                  expanded === "panelTraining",
                  agent.enableModelsPerCategory || agent.extraTrainingData
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
                />
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel
              expanded={expanded === "panelRasa"}
              onChange={() => {
                this.handleChange("expanded", "panelRasa");
              }}
            >
              <ExpansionPanelSummary
                expandIcon={this.getExpandIcon(false, expanded === "panelRasa")}
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
              expanded={expanded === "panelDuckling"}
              onChange={() => {
                this.handleChange("expanded", "panelDuckling");
              }}
            >
              <ExpansionPanelSummary
                expandIcon={this.getExpandIcon(
                  false,
                  expanded === "panelDuckling"
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
          </div>
        </Grid>
      </Grid>
    );
  }
}

AgentSettingsForm.propTypes = {
  classes: PropTypes.object.isRequired,
  agent: PropTypes.object,
  webhook: PropTypes.object,
  postFormat: PropTypes.object,
  agentSettings: PropTypes.object,
  onChangeAgentData: PropTypes.func,
  onChangeWebhookData: PropTypes.func,
  onChangeWebhookPayloadType: PropTypes.func,
  onChangePostFormatData: PropTypes.func,
  onChangeAgentSettingsData: PropTypes.func,
  errorState: PropTypes.object,
};

export default withStyles(styles)(AgentSettingsForm);
