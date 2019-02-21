import React from "react";
import { FormattedMessage, injectIntl, intlShape } from "react-intl";

import PropTypes from "prop-types";
import { Grid, Typography, Button, Modal, Tabs, Tab } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import messages from "../messages";

import agentIcon from "../../../images/agents-icon.svg";
import playHelpIcon from "../../../images/play-help-icon.svg";

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
    width: window.window.innerWidth < 675 ? 350 : 600,
    height: window.window.innerWidth < 675 ? 215 : 375,
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
            <SayingsDataForm
              agentId={this.props.agentId}
              sayings={this.props.sayings}
              sayingsPageSize={this.props.sayingsPageSize}
              agentKeywords={this.props.agentKeywords}
              agentActions={this.props.agentActions}
              agentCategories={this.props.agentCategories}
              agentFilteredCategories={this.props.agentFilteredCategories}
              onAddSaying={this.props.onAddSaying}
              onDeleteSaying={this.props.onDeleteSaying}
              onTagKeyword={this.props.onTagKeyword}
              onUntagKeyword={this.props.onUntagKeyword}
              onAddAction={this.props.onAddAction}
              onDeleteAction={this.props.onDeleteAction}
              onAddNewSayingAction={this.props.onAddNewSayingAction}
              onDeleteNewSayingAction={this.props.onDeleteNewSayingAction}
              onGoToUrl={this.props.onGoToUrl}
              onSendSayingToAction={this.props.onSendSayingToAction}
              currentSayingsPage={this.props.currentSayingsPage}
              numberOfSayingsPages={this.props.numberOfSayingsPages}
              changeSayingsPage={this.props.changeSayingsPage}
              moveSayingsPageBack={this.props.moveSayingsPageBack}
              moveSayingsPageForward={this.props.moveSayingsPageForward}
              changeSayingsPageSize={this.props.changeSayingsPageSize}
              onSelectCategory={this.props.onSelectCategory}
              category={this.props.category}
              userSays={this.props.userSays}
              onSearchCategory={this.props.onSearchCategory}
              newSayingActions={this.props.newSayingActions}
              onClearSayingToAction={this.props.onClearSayingToAction}
            />
          )}
          {this.state.selectedTab === 1 && (
            <KeywordsDataForm
              agentId={this.props.agentId}
              keywords={this.props.keywords}
              onCreateKeyword={this.props.onCreateKeyword}
              currentKeywordsPage={this.props.currentKeywordsPage}
              keywordsPageSize={this.props.keywordsPageSize}
              numberOfKeywordsPages={this.props.numberOfKeywordsPages}
              changeKeywordsPage={this.props.changeKeywordsPage}
              changeKeywordsPageSize={this.props.changeKeywordsPageSize}
              moveKeywordsPageBack={this.props.moveKeywordsPageBack}
              moveKeywordsPageForward={this.props.moveKeywordsPageForward}
              onGoToUrl={this.props.onGoToUrl}
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
  sayings: PropTypes.array,
  agentId: PropTypes.string,
  sayingsPageSize: PropTypes.number,
  agentKeywords: PropTypes.array,
  agentActions: PropTypes.array,
  agentCategories: PropTypes.array,
  agentFilteredCategories: PropTypes.array,
  onAddSaying: PropTypes.func,
  onDeleteSaying: PropTypes.func,
  onDeleteAction: PropTypes.func,
  onTagKeyword: PropTypes.func,
  onUntagKeyword: PropTypes.func,
  onSearchSaying: PropTypes.func,
  onSearchCategory: PropTypes.func,
  onAddAction: PropTypes.func,
  onGoToUrl: PropTypes.func,
  onSendSayingToAction: PropTypes.func,
  currentSayingsPage: PropTypes.number,
  sayingsNumberOfPages: PropTypes.number,
  changeSayingsPage: PropTypes.func,
  moveSayingsPageBack: PropTypes.func,
  moveSayingsPageForward: PropTypes.func,
  changeSayingsPageSize: PropTypes.func,
  onSelectCategory: PropTypes.func,
  category: PropTypes.string,
  userSays: PropTypes.string,
  newSayingActions: PropTypes.array,
  onAddNewSayingAction: PropTypes.func,
  onDeleteNewSayingAction: PropTypes.func,
  onClearSayingToAction: PropTypes.func,
  filter: PropTypes.string,
  onSearchKeyword: PropTypes.func,
  onCreateKeyword: PropTypes.func,
  keywords: PropTypes.array,
  currentKeywordsPage: PropTypes.number,
  keywordsPageSize: PropTypes.number,
  numberKeywordsOfPages: PropTypes.number,
  changeKeywordsPage: PropTypes.func,
  changeKeywordsPageSize: PropTypes.func,
  moveKeywordsPageBack: PropTypes.func,
  moveKeywordsPageForward: PropTypes.func,
};

export default injectIntl(withStyles(styles)(Form));
