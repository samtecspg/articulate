import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import PropTypes from 'prop-types';
import { Grid, Hidden, Tabs, Tab, Icon, Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import messages from '../messages';
import SaveButton from '../../../components/SaveButton';
import ExitModal from '../../../components/ExitModal';

const styles = {
  mainTabContainer: {
    marginTop: '45px',
  },
  tabs: {
    paddingLeft: '15px',
  },
  tab: {
    paddingLeft: '20px',
    paddingRight: '20px',
  },
  subtitle: {
    paddingLeft: '5px',
    color: '#4e4e4e',
    fontWeight: 'bold',
  },
  container: {
    display: 'inline',
    float: 'right',
  },
  buttonContainer: {
    position: 'relative',
    bottom: '10px',
    width: '100%',
  },
  buttonContainerSmall: {
    position: 'relative',
  },
  icon: {
    padding: '0px 10px',
    cursor: 'pointer',
  },
  link: {
    color: '#4e4e4e',
    textDecoration: 'none',
  },
  backArrow: {
    cursor: 'pointer',
    left: -15,
    fontSize: '14px',
    fontFamily: 'Montserrat',
    fontWeight: 400,
    position: 'relative',
  },
  backButton: {
    cursor: 'pointer',
    left: -15,
    fontSize: '14px',
    fontFamily: 'Montserrat',
    fontWeight: 400,
    position: 'relative',
    textDecoration: 'underline',
  },
  backButtonContainer: {
    display: 'inline',
  },
  notificationDot: {
    backgroundColor: '#Cb2121',
    height: '12px',
    width: '12px',
    borderRadius: '50%',
    position: 'absolute',
    top: '10px',
    left: '5px',
  },
  numOfErrorsLabel: {
    fontSize: '10px',
    color: 'white',
    position: 'relative',
    bottom: '4.5px',
    left: '0.5px',
  },
};

/* eslint-disable react/prefer-stateless-function */
export class MainTab extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  state = {
    openExitModal: false,
    openUpdateSayingsExitModal: false,
    exitAfterSave: false
  };

  handleChange = value => {
    this.props.onChangeTab(value);
  };

  render() {
    const { classes, intl, newKeyword } = this.props;
    return (
      <Grid container className={classes.mainTabContainer}>
        <ExitModal
          open={this.state.openExitModal}
          onExit={() => {
            this.props.goBack();
          }}
          onSaveAndExit={() => {
            if (this.props.keywordValuesTouched) {
              this.setState({
                openUpdateSayingsExitModal: true,
                exitAfterSave: true
              });
            }
            else {
              this.props.onSaveAndExit();
            }
          }}
          onClose={() => {
            this.setState({ openExitModal: false });
          }}
          type={intl.formatMessage(messages.instanceName)}
        />
        <ExitModal
          open={this.state.openUpdateSayingsExitModal}
          onExit={() => {
            if (this.state.exitAfterSave) {
              this.props.onSaveAndExit(false);
            } else {
              this.props.onFinishAction(false);
              this.setState({
                openUpdateSayingsExitModal: false
              });
            }
          }}
          onSaveAndExit={() => {
            if (this.state.exitAfterSave) {
              this.props.onSaveAndExit(true);
            } else {
              this.props.onFinishAction(true);
              this.setState({
                openUpdateSayingsExitModal: false
              });
            }
          }}
          onClose={() => {
            this.setState({ openUpdateSayingsExitModal: false });
          }}
          type={intl.formatMessage(messages.instanceName)}
          customMessage1={intl.formatMessage(messages.updateExistingSayingsKeywordsQuestion)}
          customMessage2={intl.formatMessage(messages.updateExistingSayingsKeywordsExplanation)}
          customMessageSaveAndExitButton={intl.formatMessage(messages.updateExistingSayingsKeywordsYes)}
          customMessageExitButton={intl.formatMessage(messages.updateExistingSayingsKeywordsNo)}
        />
        <Hidden only={['sm', 'xs']}>
          <Grid container justify="space-between">
            <Grid className={classes.tabsContainer}>
              <Tabs
                className={classes.tabs}
                value={this.props.selectedTab}
                indicatorColor="primary"
                textColor="secondary"
                scrollable
                scrollButtons="off"
                onChange={(evt, value) => {
                  this.handleChange(value);
                }}
              >
                <Tab
                  value="keyword"
                  className={classes.tab}
                  label={
                    <span>
                      <span>{intl.formatMessage(messages.keyword)}</span>
                      <span className={classes.subtitle}>
                        {newKeyword && this.props.keywordName === '' ? (
                          <FormattedMessage {...messages.createSubtitle} />
                        ) : this.props.keywordName ? (
                          this.props.keywordName
                        ) : (
                              intl.formatMessage(messages.noName)
                            )}
                      </span>
                    </span>
                  }
                  icon={
                    this.props.errorState.tabs.indexOf(0) > -1 ? (
                      <div
                        id="notificationDot"
                        className={classes.notificationDot}
                      >
                        <span className={classes.numOfErrorsLabel}>
                          {
                            this.props.errorState.tabs.filter(
                              element => element === 0,
                            ).length
                          }
                        </span>
                      </div>
                    ) : null
                  }
                />
                <Tab
                  value="values"
                  className={classes.tab}
                  label={intl.formatMessage(messages.values)}
                  icon={
                    this.props.errorState.tabs.indexOf(1) > -1 ? (
                      <div
                        id="notificationDot"
                        className={classes.notificationDot}
                      >
                        <span className={classes.numOfErrorsLabel}>
                          {
                            this.props.errorState.tabs.filter(
                              element => element === 1,
                            ).length
                          }
                        </span>
                      </div>
                    ) : null
                  }
                />
                <Tab
                  value="modifiers"
                  style={{
                    pointerEvents: 'all',
                  }}
                  className={classes.tab}
                  label={
                    newKeyword ? (
                      <Tooltip
                        title={intl.formatMessage(messages.modifiersTooltip)}
                        placement="top"
                      >
                        <span>{intl.formatMessage(messages.modifiers)}</span>
                      </Tooltip>
                    ) : (
                        intl.formatMessage(messages.modifiers)
                      )
                  }
                  icon={
                    this.props.errorState.tabs.indexOf(2) > -1 ? (
                      <div
                        id="notificationDot"
                        className={classes.notificationDot}
                      >
                        <span className={classes.numOfErrorsLabel}>
                          {
                            this.props.errorState.tabs.filter(
                              element => element === 2,
                            ).length
                          }
                        </span>
                      </div>
                    ) : null
                  }
                  disabled={newKeyword}
                />
              </Tabs>
            </Grid>
            <Grid className={classes.container}>
              <Hidden only={['sm', 'xs']}>
                <Grid className={classes.buttonContainer}>
                  <Grid className={classes.backButtonContainer}>
                    <span
                      className={classes.backArrow}
                      onClick={() => {
                        this.props.touched
                          ? this.setState({ openExitModal: true })
                          : this.props.goBack();
                      }}
                      key="backArrow"
                    >
                      {'< '}
                    </span>
                    <a
                      key="backLink"
                      className={classes.backButton}
                      onClick={() => {
                        this.props.touched
                          ? this.setState({ openExitModal: true })
                          : this.props.goBack();
                      }}
                    >
                      <FormattedMessage {...messages.backButton} />
                    </a>
                  </Grid>
                  <SaveButton
                    touched={this.props.touched}
                    formError={this.props.formError}
                    success={this.props.success}
                    loading={this.props.loading}
                    label={messages.finishButton}
                    onClick={this.props.keywordValuesTouched ? () => {
                      this.setState({
                        openUpdateSayingsExitModal: true,
                        exitAfterSave: false
                      })
                    }
                      : this.props.onFinishAction}
                  />
                </Grid>
              </Hidden>
            </Grid>
          </Grid>
          {this.props.selectedTab === 'keyword' ? this.props.keywordForm : null}
          {this.props.selectedTab === 'values' ? this.props.valuesForm : null}
          {this.props.selectedTab === 'modifiers'
            ? this.props.modifiersForm
            : null}
        </Hidden>
        <Hidden only={['xl', 'lg', 'md']}>
          <Grid container justify="space-between">
            <Grid>
              <Tabs
                className={classes.tabs}
                value={this.props.selectedTab}
                indicatorColor="primary"
                textColor="secondary"
                scrollable
                scrollButtons="off"
                onChange={(evt, value) => {
                  this.handleChange(value);
                }}
              >
                <Tab
                  value="keyword"
                  icon={<Icon>play_arrow</Icon>}
                  className={classes.tab}
                />
                <Tab
                  value="values"
                  icon={<Icon>list</Icon>}
                  className={classes.tab}
                />
                <Tab
                  style={{
                    pointerEvents: 'all',
                  }}
                  value="modifiers"
                  icon={
                    newKeyword ? (
                      <Tooltip
                        title={intl.formatMessage(messages.modifiersTooltip)}
                        placement="top"
                      >
                        <Icon>comment</Icon>
                      </Tooltip>
                    ) : (
                        <Icon>comment</Icon>
                      )
                  }
                  className={classes.tab}
                  disabled={newKeyword}
                />
              </Tabs>
            </Grid>
            <Grid className={classes.container}>
              <Hidden only={['xl', 'lg', 'md']}>
                <Grid className={classes.buttonContainerSmall}>
                  <Grid className={classes.backButtonContainer}>
                    <span
                      className={classes.backArrow}
                      onClick={() => {
                        this.props.touched
                          ? this.setState({ openExitModal: true })
                          : this.props.goBack();
                      }}
                      key="backArrow"
                    >
                      {'< '}
                    </span>
                    <a
                      key="backLink"
                      className={classes.backButton}
                      onClick={() => {
                        this.props.touched
                          ? this.setState({ openExitModal: true })
                          : this.props.goBack();
                      }}
                    >
                      <FormattedMessage {...messages.backButton} />
                    </a>
                  </Grid>
                  <a
                    style={{
                      color: this.props.formError ? '#f44336' : '',
                      position: 'relative',
                      top: '7px',
                    }}
                    onClick={this.props.onFinishAction}
                    className={`${classes.icon} ${classes.link}`}
                  >
                    <Icon>save</Icon>
                  </a>
                </Grid>
              </Hidden>
            </Grid>
          </Grid>
          {this.props.selectedTab === 'keyword' ? this.props.keywordForm : null}
          {this.props.selectedTab === 'values' ? this.props.valuesForm : null}
          {this.props.selectedTab === 'modifiers'
            ? this.props.modifiersForm
            : null}
        </Hidden>
      </Grid>
    );
  }
}

MainTab.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  selectedTab: PropTypes.string,
  keywordForm: PropTypes.node,
  valuesForm: PropTypes.node,
  modifiersForm: PropTypes.node,
  onChangeTab: PropTypes.func,
  onFinishAction: PropTypes.func.isRequired,
  onSaveAndExit: PropTypes.func.isRequired,
  onNextAction: PropTypes.func.isRequired,
  hideFinishButton: PropTypes.bool,
  isLastTab: PropTypes.bool,
  formError: PropTypes.bool,
  keywordName: PropTypes.string,
  goBack: PropTypes.func,
  newKeyword: PropTypes.bool,
  errorState: PropTypes.object,
  loading: PropTypes.bool,
  success: PropTypes.bool,
  touched: PropTypes.bool,
  keywordValuesTouched: PropTypes.bool
};

export default injectIntl(withStyles(styles)(MainTab));
