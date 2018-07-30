import React from "react";
import { FormattedMessage, injectIntl, intlShape } from "react-intl";

import PropTypes from "prop-types";
import { Grid, Typography, Button, Modal, Tabs, Tab } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import messages from "../messages";

import agentIcon from "../../../images/agents-icon.svg";
import playHelpIcon from "../../../images/play-help-icon.svg";
import settingsIcon from "../../../images/settings-icon.svg";

import AgentDataForm from "./AgentDataForm";
import AgentSettingsForm from "./AgentSettingsForm";

const styles = {
  headerContainer: {
    backgroundColor: "#f6f7f8",
    border: "1px solid #c5cbd8",
    borderRadius: "5px",
    marginBottom: "60px"
  },
  titleContainer: {
    padding: "25px"
  },
  agentIcon: {
    display: "inline",
    paddingRight: "10px",
    height: "30px"
  },
  titleTextHelpContainer: {
    display: "inline",
    position: "relative",
    bottom: "6px"
  },
  title: {
    display: "inline",
    paddingRight: "25px"
  },
  helpButton: {
    display: "inline",
    width: "50px",
    height: "20px"
  },
  playIcon: {
    height: "10px"
  },
  helpText: {
    fontSize: "9px",
    fontWeight: 300,
    position: "relative",
    bottom: "2px",
    paddingLeft: "2px"
  },
  agentTabs: {
    paddingLeft: "5px"
  },
  modalContent: {
    top: "50%",
    left: "50%",
    transform: `translate(-50%, -50%)`,
    position: "absolute",
    width: window.window.innerWidth < 675 ? 350 : 600,
    height: window.window.innerWidth < 675 ? 215 : 375,
    backgroundColor: "#fff",
    boxShadow:
      "0px 3px 5px -1px rgba(0, 0, 0, 0.2),0px 5px 8px 0px rgba(0, 0, 0, 0.14),0px 1px 14px 0px rgba(0, 0, 0, 0.12)"
  },
  settingsIcon: {
    height: "18px",
    paddingRight: "5px"
  }
};

/* eslint-disable react/prefer-stateless-function */
class Form extends React.Component {
  state = {
    selectedTab: 0,
    openModal: false
  };

  handleChange = (event, value) => {
    this.setState({
      selectedTab: value
    });
  };

  handleOpen = () => {
    this.setState({
      openModal: true
    });
  };

  handleClose = () => {
    this.setState({
      openModal: false
    });
  };

  render() {
    const { classes, intl } = this.props;
    return (
      <Grid className={classes.headerContainer} container item xs={12}>
        <Grid className={classes.titleContainer} item xs={12}>
          <img className={classes.agentIcon} src={agentIcon} />
          <Grid className={classes.titleTextHelpContainer} container>
            <Typography className={classes.title} variant="display3">
              <FormattedMessage {...messages.title} />
            </Typography>
            <Button
              className={classes.helpButton}
              variant="outlined"
              onClick={this.handleOpen}
            >
              <img
                className={classes.playIcon}
                src={playHelpIcon}
                alt={intl.formatMessage(messages.playHelpAlt)}
              />
              <span className={classes.helpText}>
                <FormattedMessage {...messages.help} />
              </span>
            </Button>
            <Modal open={this.state.openModal} onClose={this.handleClose}>
              <Grid className={classes.modalContent} container>
                <iframe
                  width={styles.modalContent.width}
                  height={styles.modalContent.height}
                  src="https://www.youtube.com/embed/o807YDeK6Vg"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </Grid>
            </Modal>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Tabs
            className={classes.agentTabs}
            value={this.state.selectedTab}
            indicatorColor="primary"
            textColor="secondary"
            scrollable
            scrollButtons="off"
            onChange={(evt, value) => {
              this.handleChange(evt, value);
            }}
          >
            <Tab label={intl.formatMessage(messages.main)} />
            <Tab
              icon={<img className={classes.settingsIcon} src={settingsIcon} />}
              label={intl.formatMessage(messages.settings)}
            />
          </Tabs>
          {this.state.selectedTab === 0 && (
            <AgentDataForm
              agent={this.props.agent}
              onChangeAgentData={this.props.onChangeAgentData}
              onChangeAgentName={this.props.onChangeAgentName}
              onChangeDomainClassifierThreshold={
                this.props.onChangeDomainClassifierThreshold
              }
              onAddFallbackResponse={this.props.onAddFallbackResponse}
              onDeleteFallbackResponse={this.props.onDeleteFallbackResponse}
            />
          )}
          {this.state.selectedTab === 1 && (
            <AgentSettingsForm
              agent={this.props.agent}
              webhook={this.props.webhook}
              postFormat={this.props.postFormat}
              settings={this.props.settings}
              onChangeAgentData={this.props.onChangeAgentData}
              onChangeWebhookData={this.props.onChangeWebhookData}
              onChangeWebhookPayloadType={this.props.onChangeWebhookPayloadType}
              onChangePostFormatData={this.props.onChangePostFormatData}
              onChangeSettingsData={this.props.onChangeSettingsData}
            />
          )}
        </Grid>
      </Grid>
    );
  }
}

Form.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  agent: PropTypes.object,
  webhook: PropTypes.object,
  postFormat: PropTypes.object,
  settings: PropTypes.object,
  onChangeAgentData: PropTypes.func,
  onChangeAgentName: PropTypes.func,
  onChangeWebhookData: PropTypes.func,
  onChangeWebhookPayloadType: PropTypes.func,
  onChangePostFormatData: PropTypes.func,
  onChangeSettingsData: PropTypes.func,
  onChangeDomainClassifierThreshold: PropTypes.func,
  onAddFallbackResponse: PropTypes.func,
  onDeleteFallbackResponse: PropTypes.func
};

export default injectIntl(withStyles(styles)(Form));
