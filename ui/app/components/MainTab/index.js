import { Grid, Hidden, Icon, Tab, Tabs, Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import TrainButton from '../TrainButton';
import agentIcon from '../../images/agents-icon.svg';
import reviewIcon from '../../images/icon-review.svg';
import dialogueIcon from '../../images/sayings-icon.svg';
import vDivider from '../../images/v-divider.svg';
import messages from './messages';
import gravatars from '../Gravatar';

import SaveButton from '../SaveButton';

const styles = {
  mainTabContainer: {
    marginTop: '45px',
  },
  tabs: {
    paddingLeft: '5px',
  },
  tab: {
    paddingLeft: '10px',
    paddingRight: '10px',
  },
  agentTab: {
    paddingLeft: '0px',
    paddingRight: '10px',
    minWidth: 'fit-content',
  },
  icon: {
    height: '18px',
    paddingRight: '5px',
  },
  vDividerIconTab: {
    minWidth: '25px',
  },
  vDividerIcon: {
    height: '12px',
  },
  subtitle: {
    paddingLeft: '5px',
    color: '#4e4e4e',
    fontWeight: 'bold',
  },
  actionsContainer: {
    display: 'inline',
  },
  actionContainer: {
    marginLeft: '5px',
    display: 'inline',
    float: 'right',
  },
  buttonContainer: {
    position: 'relative',
    bottom: '5px',
  },
  icon: {
    padding: '0px 10px',
    cursor: 'pointer',
  },
  agentIcon: {
    height: '20px',
    padding: '0px 5px',
    cursor: 'pointer',
  },
  button: {
    display: 'inline',
  },
};

/* eslint-disable react/prefer-stateless-function */
export class MainTab extends React.Component {
  state = {
    selectedTab: this.props.selectedTab,
  };

  handleChange = value => {
    if (!this.props.touched || this.props.success) {
      this.setState({
        selectedTab: value,
      });
    }
  };

  render() {
    const {
      classes,
      intl,
      enableTabs,
      agentStatus,
      serverStatus,
      lastTraining,
      onTrain,
      newAgent,
      disableSave,
      locale,
    } = this.props;
    return (
      <Grid container className={classes.mainTabContainer}>
        <Hidden only={['sm', 'xs', 'md']}>
          <Grid container justify="space-between">
            <Grid>
              <Tabs
                fullWidth
                className={classes.tabs}
                value={this.state.selectedTab}
                indicatorColor="primary"
                textColor="secondary"
                scrollButtons="off"
                onChange={(evt, value) => {
                  this.handleChange(value);
                }}
              >
                {this.props.agentURL ? (
                  <Tab
                    value="agents"
                    className={classes.agentTab}
                    icon={gravatars[this.props.agentGravatar - 1]({
                      color: this.props.agentUIColor,
                      className: classes.agentIcon,
                    })}
                    label={
                      <span>
                        <span>{intl.formatMessage(messages.agent)}</span>
                        <span className={classes.subtitle}>
                          {newAgent && this.props.agentName === '' ? (
                            <FormattedMessage {...messages.createSubtitle} />
                          ) : this.props.agentName.length > 15 ? (
                            <Tooltip
                              title={this.props.agentName}
                              placement="top"
                            >
                              <span>{`${this.props.agentName.substring(
                                0,
                                15,
                              )}...`}</span>
                            </Tooltip>
                          ) : (
                            this.props.agentName
                          )}
                        </span>
                      </span>
                    }
                    component={this.props.agentForm}
                    to={this.props.agentURL}
                  />
                ) : (
                  <Tab
                    value="agents"
                    className={classes.agentTab}
                    icon={gravatars[this.props.agentGravatar - 1]({
                      color: this.props.agentUIColor,
                      className: classes.agentIcon,
                    })}
                    label={
                      <span>
                        <span>{intl.formatMessage(messages.agent)}</span>
                        <span className={classes.subtitle}>
                          {newAgent && this.props.agentName === '' ? (
                            <FormattedMessage {...messages.createSubtitle} />
                          ) : this.props.agentName.length > 15 ? (
                            <Tooltip
                              title={this.props.agentName}
                              placement="top"
                            >
                              <span>{`${this.props.agentName.substring(
                                0,
                                15,
                              )}...`}</span>
                            </Tooltip>
                          ) : (
                            this.props.agentName
                          )}
                        </span>
                      </span>
                    }
                  />
                )}
                <Tab
                  className={classes.vDividerIconTab}
                  icon={<img className={classes.vDividerIcon} src={vDivider} />}
                  disabled
                />
                {this.props.dialogueURL ? (
                  <Tab
                    value="dialogue"
                    className={classes.tab}
                    icon={<img className={classes.icon} src={dialogueIcon} />}
                    label={intl.formatMessage(messages.dialogue)}
                    component={this.props.dialogueForm}
                    to={this.props.dialogueURL}
                    disabled={!enableTabs}
                  />
                ) : (
                  <Tab
                    value="dialogue"
                    className={classes.tab}
                    icon={<img className={classes.icon} src={dialogueIcon} />}
                    label={intl.formatMessage(messages.dialogue)}
                    disabled={!enableTabs}
                  />
                )}
                {this.props.reviewURL ? (
                  <Tab
                    value="review"
                    className={classes.tab}
                    icon={<img className={classes.icon} src={reviewIcon} />}
                    label={intl.formatMessage(messages.review)}
                    component={this.props.reviewForm}
                    to={this.props.reviewURL}
                    disabled={!enableTabs}
                  />
                ) : (
                  <Tab
                    value="review"
                    className={classes.tab}
                    icon={<img className={classes.icon} src={reviewIcon} />}
                    label={intl.formatMessage(messages.review)}
                    disabled={!enableTabs}
                  />
                )}
              </Tabs>
            </Grid>
            <Grid className={classes.actionsContainer}>
              {newAgent ? null : (
                <TrainButton
                  locale={locale}
                  agentStatus={agentStatus}
                  serverStatus={serverStatus}
                  lastTraining={lastTraining}
                  onTrain={onTrain}
                />
              )}
              {disableSave ||
              (!this.props.success && !this.props.touched) ? null : (
                <Grid item className={classes.actionContainer}>
                  <Grid className={classes.buttonContainer}>
                    <SaveButton
                      touched={this.props.touched}
                      formError={this.props.formError}
                      success={this.props.success}
                      loading={this.props.loading}
                      label={messages.finishButton}
                      onClick={this.props.onFinishAction}
                    />
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
          {!this.props.agentURL
            ? this.state.selectedTab === 'agents'
              ? this.props.agentForm
              : null
            : null}
          {!this.props.dialogueURL
            ? this.state.selectedTab === 'dialogue'
              ? this.props.dialogueForm
              : null
            : null}
          {!this.props.reviewURL
            ? this.state.selectedTab === 'review'
              ? this.props.reviewForm
              : null
            : null}
        </Hidden>
        <Hidden only={['xl', 'lg']}>
          <Grid container justify="space-between">
            <Grid>
              <Tabs
                className={classes.tabs}
                value={this.state.selectedTab}
                indicatorColor="primary"
                textColor="secondary"
                scrollButtons="off"
                onChange={(evt, value) => {
                  this.handleChange(value);
                }}
              >
                {this.props.agentURL ? (
                  <Tab
                    value="agents"
                    className={classes.tab}
                    icon={<img className={classes.icon} src={agentIcon} />}
                    component={this.props.agentForm}
                    to={this.props.agentURL}
                  />
                ) : (
                  <Tab
                    value="agents"
                    className={classes.tab}
                    icon={<img className={classes.icon} src={agentIcon} />}
                  />
                )}
                <Tab
                  className={classes.vDividerIconTab}
                  icon={<img className={classes.vDividerIcon} src={vDivider} />}
                  disabled
                />
                {this.props.dialogueURL ? (
                  <Tab
                    value="dialogue"
                    className={classes.tab}
                    icon={<img className={classes.icon} src={dialogueIcon} />}
                    component={this.props.dialogueForm}
                    to={this.props.dialogueURL}
                    disabled={!enableTabs}
                  />
                ) : (
                  <Tab
                    value="dialogue"
                    className={classes.tab}
                    icon={<img className={classes.icon} src={dialogueIcon} />}
                    disabled={!enableTabs}
                  />
                )}
                {this.props.reviewURL ? (
                  <Tab
                    value="review"
                    className={classes.tab}
                    icon={<img className={classes.icon} src={reviewIcon} />}
                    label={intl.formatMessage(messages.review)}
                    component={this.props.reviewForm}
                    to={this.props.reviewURL}
                    disabled={!enableTabs}
                  />
                ) : (
                  <Tab
                    value="review"
                    className={classes.tab}
                    icon={<img className={classes.icon} src={reviewIcon} />}
                    label={intl.formatMessage(messages.review)}
                    disabled={!enableTabs}
                  />
                )}
              </Tabs>
            </Grid>
            <Grid className={classes.actionsContainer}>
              {newAgent ? null : (
                <TrainButton
                  locale={locale}
                  agentStatus={agentStatus}
                  serverStatus={serverStatus}
                  lastTraining={lastTraining}
                  onTrain={onTrain}
                />
              )}
              {disableSave ||
              (!this.props.success && !this.props.touched) ? null : (
                <Grid item className={classes.actionContainer}>
                  <Hidden only={['xl', 'lg']}>
                    <a
                      onClick={this.props.onFinishAction}
                      className={`${classes.icon} ${classes.link}`}
                    >
                      <Icon>save</Icon>
                    </a>
                  </Hidden>
                  <Hidden only={['sm', 'xs', 'md']}>
                    <Grid className={classes.buttonContainer}>
                      <SaveButton
                        touched={this.props.touched}
                        formError={this.props.formError}
                        success={this.props.success}
                        loading={this.props.loading}
                        label={messages.finishButton}
                        onClick={this.props.onFinishAction}
                      />
                    </Grid>
                  </Hidden>
                </Grid>
              )}
            </Grid>
          </Grid>
          {!this.props.agentURL
            ? this.state.selectedTab === 'agents'
              ? this.props.agentForm
              : null
            : null}
          {!this.props.dialogueURL
            ? this.state.selectedTab === 'dialogue'
              ? this.props.dialogueForm
              : null
            : null}
          {!this.props.reviewURL
            ? this.state.selectedTab === 'review'
              ? this.props.reviewForm
              : null
            : null}
        </Hidden>
      </Grid>
    );
  }
}

MainTab.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  enableTabs: PropTypes.bool,
  selectedTab: PropTypes.string,
  agentForm: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  agentURL: PropTypes.string,
  dialogueForm: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  dialogueURL: PropTypes.string,
  keywordsURL: PropTypes.string,
  reviewForm: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  reviewURL: PropTypes.string,
  agentName: PropTypes.string,
  onFinishAction: PropTypes.func,
  onTrain: PropTypes.func,
  agentStatus: PropTypes.string,
  lastTraining: PropTypes.string,
  formError: PropTypes.bool,
  newAgent: PropTypes.bool,
  disableSave: PropTypes.bool,
  touched: PropTypes.bool,
  locale: PropTypes.string,
  serverStatus: PropTypes.string,
};

export default injectIntl(withStyles(styles)(MainTab));
