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
import AgentParametersForm from './AgentParametersForm';
import AgentSettingsForm from "./AgentSettingsForm";
import DeleteFooter from "../../../components/DeleteFooter";

const styles = {
  headerContainer: {
    backgroundColor: "#f6f7f8",
    border: "1px solid #c5cbd8",
    borderRadius: "5px",
    marginBottom: "60px",
  },
  titleContainer: {
    padding: "25px",
  },
  agentIcon: {
    display: "inline",
    paddingRight: "10px",
    height: "30px",
  },
  titleTextHelpContainer: {
    display: "inline",
    position: "relative",
    bottom: "6px",
  },
  title: {
    display: "inline",
    paddingRight: "25px",
  },
  helpButton: {
    display: "inline",
    width: "50px",
    height: "20px",
  },
  playIcon: {
    height: "10px",
  },
  helpText: {
    fontSize: "9px",
    fontWeight: 300,
    position: "relative",
    bottom: "2px",
    paddingLeft: "2px",
  },
  agentTabs: {
    paddingLeft: "5px",
  },
  modalContent: {
    top: "50%",
    left: "50%",
    transform: `translate(-50%, -50%)`,
    position: "absolute",
    width: '80%',
    height: '80%',
    backgroundColor: "#fff",
    boxShadow:
      "0px 3px 5px -1px rgba(0, 0, 0, 0.2),0px 5px 8px 0px rgba(0, 0, 0, 0.14),0px 1px 14px 0px rgba(0, 0, 0, 0.12)",
  },
  settingsIcon: {
    height: "18px",
    paddingRight: "5px",
    position: 'absolute'
  },
  notificationDot: {
    backgroundColor: '#Cb2121',
    height: '12px',
    width: '12px',
    borderRadius: '50%',
    position: 'absolute',
    top: '10px',
    left: '5px'
  },
  numOfErrorsLabel: {
    fontSize: '10px',
    color: 'white',
    position: 'relative',
    bottom: '4.5px',
    left: '0.5px'
  },
  tabLabel: {
    padding: '0px 10px',
  },
  settingsTabLabel: {
    padding: '0px 20px',
  },
};

/* eslint-disable react/prefer-stateless-function */
class Form extends React.Component {
  state = {
    selectedTab: 0,
    openModal: false,
  };

  handleChange = (event, value) => {
    this.setState({
      selectedTab: value,
    });
  };

  handleOpen = () => {
    this.setState({
      openModal: true,
    });
  };

  handleClose = () => {
    this.setState({
      openModal: false,
    });
  };

  render() {
    const { classes, intl } = this.props;
    return (
      <Grid className={classes.headerContainer} container item xs={12}>
        <Grid className={classes.titleContainer} item xs={12}>
          <img className={classes.agentIcon} src={agentIcon} />
          <Grid className={classes.titleTextHelpContainer} container>
            <Typography className={classes.title} variant="h2">
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
                  width='100%'
                  height='100%'
                  src="https://www.youtube.com/embed/Xc1j2F1Em9M"
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
            <Tab 
              label={
                <span className={classes.tabLabel}>
                  <span>{intl.formatMessage(messages.main)}</span>
                </span>
              }	
              icon={
                this.props.errorState.tabs.indexOf(0) > -1 ? 
                  <div id='notificationDot' className={classes.notificationDot}>
                    <span className={classes.numOfErrorsLabel}>
                      {(this.props.errorState.tabs.filter((element) => { return element === 0 })).length}
                    </span>
                  </div> : 
                  null
              }
            />
            <Tab 
              label={
                <span className={classes.tabLabel}>
                  <span>{intl.formatMessage(messages.parameters)}</span>
                </span>
              }
              icon={
                this.props.errorState.tabs.indexOf(1) > -1 ? 
                  <div id='notificationDot' className={classes.notificationDot}>
                    <span className={classes.numOfErrorsLabel}>
                      {(this.props.errorState.tabs.filter((element) => { return element === 1 })).length}
                    </span>
                  </div> : 
                  null
              }
            />
            <Tab
              icon={[
                this.props.errorState.tabs.indexOf(2) > -1 ? 
                  <div style={{left: '0px'}} key='notification_settings' id='notificationDot' className={classes.notificationDot}>
                    <span className={classes.numOfErrorsLabel}>
                      {(this.props.errorState.tabs.filter((element) => { return element === 2 })).length}
                    </span>
                  </div> : 
                  null
              ]}
              label={
                <span className={classes.tabLabel}>
                  <span>{intl.formatMessage(messages.settings)}</span>
                </span>
              }
            />
          </Tabs>
          {this.state.selectedTab === 0 && (
            <AgentDataForm
              agent={this.props.agent}
              settings={this.props.settings}
              onChangeAgentData={this.props.onChangeAgentData}
              onChangeAgentName={this.props.onChangeAgentName}
              onChangeCategoryClassifierThreshold={
                this.props.onChangeCategoryClassifierThreshold
              }
              onAddFallbackResponse={this.props.onAddFallbackResponse}
              onDeleteFallbackResponse={this.props.onDeleteFallbackResponse}
              errorState={this.props.errorState}
              agentActions={this.props.agentActions}
              newAgent={this.props.newAgent}
              onGoToUrl={this.props.onGoToUrl}
              defaultaFallbackActionName={this.props.defaultaFallbackActionName}
            />
          )}
          {this.state.selectedTab === 1 && (
            <AgentParametersForm
              agent={this.props.agent}
              errorState={this.props.errorState}
              onAddNewParameter={this.props.onAddNewParameter}
              onDeleteParameter={this.props.onDeleteParameter}
              onChangeParameterName={this.props.onChangeParameterName}
              onChangeParameterValue={this.props.onChangeParameterValue}
            />
          )}
          {this.state.selectedTab === 2 && (
            <AgentSettingsForm
              agent={this.props.agent}
              webhook={this.props.webhook}
              postFormat={this.props.postFormat}
              agentSettings={this.props.agentSettings}
              onChangeAgentData={this.props.onChangeAgentData}
              onChangeWebhookData={this.props.onChangeWebhookData}
              onChangeWebhookPayloadType={this.props.onChangeWebhookPayloadType}
              onAddNewHeader={this.props.onAddNewHeader}
              onDeleteHeader={this.props.onDeleteHeader}
              onChangeHeaderName={this.props.onChangeHeaderName}
              onChangeHeaderValue={this.props.onChangeHeaderValue}
              onChangePostFormatData={this.props.onChangePostFormatData}
              onChangeAgentSettingsData={this.props.onChangeAgentSettingsData}
              errorState={this.props.errorState}
            />
          )}
        </Grid>
        {this.props.newAgent ? null : 
        <DeleteFooter
          onDelete={this.props.onDelete}
          type={intl.formatMessage(messages.instanceName)}
        />}
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
  agentSettings: PropTypes.object,
  errorState: PropTypes.object,
  onChangeAgentData: PropTypes.func,
  onChangeAgentName: PropTypes.func,
  onChangeWebhookData: PropTypes.func,
  onChangeWebhookPayloadType: PropTypes.func,
  onAddNewHeader: PropTypes.func,
  onDeleteHeader: PropTypes.func,
  onChangeHeaderName: PropTypes.func,
  onChangeHeaderValue: PropTypes.func,
  onChangePostFormatData: PropTypes.func,
  onChangeAgentSettingsData: PropTypes.func,
  onChangeCategoryClassifierThreshold: PropTypes.func,
  onAddFallbackResponse: PropTypes.func,
  onDeleteFallbackResponse: PropTypes.func,
  onDelete: PropTypes.func,
  newAgent: PropTypes.bool,
  agentActions: PropTypes.array,
  onGoToUrl: PropTypes.func,
  defaultaFallbackActionName: PropTypes.string,
  onAddNewParameter: PropTypes.func,
  onDeleteParameter: PropTypes.func,
  onChangeParameterName: PropTypes.func,
  onChangeParameterValue: PropTypes.func,
};

export default injectIntl(withStyles(styles)(Form));
