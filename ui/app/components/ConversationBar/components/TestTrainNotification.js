import React from 'react';

import PropTypes from 'prop-types';
import { Grid, Typography, Button, Tabs, Tab, Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { injectIntl, intlShape } from 'react-intl';
import messages from '../messages';
import { Fragment } from 'react';
import checkIcon from '../../../images/check-save-icon.svg';

const styles = {
  notificationsContainer: {
    marginTop: '0px',
  },
  notificationContainer: {
    backgroundColor: '#f6f7f8',
    border: '1px solid #4e4e4e',
    margin: '10px 35px 0px 20px',
    borderRadius: '3px',
    maxWidth: '278px',
    overflow: 'scroll',
  },
  notification: {
    fontSize: '12px',
    fontWeight: 300,
    width: '95%',
    marginBottom: '8px'
  },
  notificationDot: {
    height: '12px',
    width: '12px',
    borderRadius: '50%',
    position: 'absolute',
    top: 6,
    left: 6,
  },
  closeNotification: {
    position: 'absolute',
    top: 18,
    right: 32,
    cursor: 'pointer',
    webkitTouchCallout: 'none',
    webkitUserSelect: 'none',
    khtmlUserSelect: 'none',
    mozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
  },
  tabLabel: {
    padding: '0px 10px',
    position: 'relative',
    top: '5px',
  },
  settingsTabLabel: {
    padding: '0px 20px',
  },
  selected: {
    color: '#4e4e4e',
    border: '1px solid',
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
    borderBottomColor: '#f6f7f8',
  },
  keywordRow: {
    cursor: 'pointer',
  },
  dot: {
    marginRight: 5,
    height: 10,
    width: 10,
    borderRadius: '50%',
    display: 'inline-block',
  },
  button: {
    display: 'inline',
    borderRadius: '4px 4px 4px 4px',
    width: '97%',
    marginTop: '5px',
    marginBottom: '5px',
    '&:disabled': {
      backgroundColor: '#f6f7f8 !important;',
      border: '2px solid #E6E4E4 !important',
    },
  },
  profileMainLoader: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
  },
  loader: {
    position: 'relative',
    justifyContent: 'center',
    flexDirection: 'column',
    textAlign: 'center',
    width: '20px',
    height: '20px',
  },
  circularLoader: {
    WebkitAnimation: 'rotate 2s linear infinite',
    animation: 'rotate 2s linear infinite',
    height: '100%',
    WebkitTransformOrigin: 'center center',
    msTransformOrigin: 'center center',
    transformOrigin: 'center center',
    width: '100%',
    position: 'absolute',
    left: 0,
    margin: 'auto',
  },
  loaderPath: {
    strokeDasharray: '150,200',
    strokeDashoffset: -10,
    WebkitAnimation:
      'dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite',
    animation: 'dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite',
    strokeLinecap: 'round',
  },
  keywordsActionsContainer: {
    border: '1px solid #4e4e4e',
    width: 'calc(100% + 16px)',
    marginLeft: '-8px',
    borderLeft: 'none',
    borderRight: 'none',
    borderBottom: 'none',
    zIndex: '-1',
    marginTop: '-1px'
  },
  badNumber: {
    marginLeft: '6px',
    backgroundColor: '#C10007',
    padding: '1px 6px',
    borderRadius: '4px',
    color: 'white'
  },
  viewFullSummary: {
    color: '#4e4e4e',
    fontSize: '12px',
    textDecoration: 'underline',
    display: 'inline-block',
    cursor: 'pointer',
    opacity: '60%'
  },
  results: {
    color: '#A2A7B1',
    fontSize: '12px'
  },
  indicator: {
    //backgroundColor: '#f6f7f8',
    backgroundColor: '#ffffff',
    width: '0px !important',
  }
};

/* eslint-disable react/prefer-stateless-function */
export class TestTrainNotification extends React.Component {
  state = {
    currentTab: 'keywords',
    currentTabNo: 0
  }

  renderKeywordsTable = (classes, intl) => {
    return (<Table
      style={{
        border: 'none'
      }}
    >
      <TableBody>
        {this.props.testTrain ? (this.props.testTrain.keywords.slice(0, 3).map((keyword, index) => (
          keyword.bad > 0 && (
            <TableRow
              className={classes.keywordRow}
              onClick={async () => {
                await this.props.onResetDialoguePageFilter();
                await this.props.onChangeDialoguePageFilterKeywordIssues();
                await this.props.onChangeDialoguePageFilterKeywords([keyword.keywordName]);
                await this.props.onChangeDialoguePageNumberOfFiltersApplied(2);
                await this.props.onChangeDialoguePageFilterString('keywords:"' + keyword.keywordName + '" keywordIssues:"true"');
                await this.props.onSearchSaying();
                await this.props.onGoToUrl(
                  `/agent/${this.props.agent.id}/dialogue`,
                );
              }}
              key={`${keyword}_${index}`}
            >
              <TableCell>
                <span
                  style={{ backgroundColor: keyword.uiColor }}
                  className={classes.dot}
                />
                <span>{keyword.keywordName}</span>
                <span
                  align="center"
                  className={classes.badNumber}
                >{keyword.bad}</span>
              </TableCell>
              <TableCell style={{
                fontWeight: 'bold',
                textAlign: "right"
              }}>
                {keyword.accuracy.toFixed(2) * 100}%
              </TableCell>
            </TableRow>
          )
        ))) : null}
      </TableBody>
    </Table>)
  }

  getMultiactionArray = (multiAction) => {
    return multiAction.split('+__+');
  }

  renderActionsTable = (classes, intl) => {
    return (<Table
      style={{
        border: 'none'
      }}
    >
      <TableBody>
        {this.props.testTrain ? (this.props.testTrain.actions.slice(0, 3).map((action, index) => (
          action.bad > 0 &&
          (<TableRow
            className={classes.keywordRow}
            onClick={async () => {
              let actionArray = [];
              let actionFilter = "";
              if (action.actionName.includes('+__+')) {
                actionArray = this.getMultiactionArray(action.actionName);
                actionFilter = actionFilter + ' actions:"'
                actionFilter = actionFilter + actionArray.join('" actions:"')
                actionFilter = actionFilter + '" actionIssues:"true"';
              } else {
                actionFilter = 'actions:"' + action.actionName + '" actionIssues:"true"'
                actionArray.push(action.actionName)
              }

              await this.props.onResetDialoguePageFilter();
              await this.props.onChangeDialoguePageFilterActionIssues();
              await this.props.onChangeDialoguePageFilterActions(actionArray);
              await this.props.onChangeDialoguePageNumberOfFiltersApplied(1 + actionArray.length);
              await this.props.onChangeDialoguePageFilterString(actionFilter);
              await this.props.onSearchSaying();
              await this.props.onGoToUrl(
                `/agent/${this.props.agent.id}/dialogue`,
              );
            }}
            key={`${action}_${index}`}
          >
            <TableCell>
              <span>{action.actionName}</span>
              <span
                align="center"
                className={classes.badNumber}
              >{action.bad}</span>
            </TableCell>
            <TableCell style={{
              fontWeight: 'bold',
              textAlign: "right"
            }}>
              {action.accuracy.toFixed(2) * 100}%
              </TableCell>
          </TableRow>)
        ))) : null}
      </TableBody>
    </Table>)
  }

  renderNotificationDot = (classes, intl) => {
    return <div
      className={classes.notificationDot}
      style={{
        backgroundColor:
          '#358fec',
      }}
    />
  }

  renderFinishTrainingNotification = (classes, intl, messages) => {
    return (
      <Fragment>
        <Typography className={classes.notification}>
          <span
            dangerouslySetInnerHTML={{
              __html: `${
                intl.formatMessage(messages.agentTestTrainTemplateTitle, { agentName: this.props.agent.agentName })
                }`,
            }}
          />
        </Typography>
        <Typography className={classes.notification}>
          <span
            dangerouslySetInnerHTML={{
              __html: `${
                intl.formatMessage(messages.agentTestTrainTemplateBody)
                }`,
            }}
          />
        </Typography>
      </Fragment>
    )
  }

  renderButton = (classes, intl, messages) => {
    return (<Button
      className={classes.button}
      variant="contained"
      onClick={this.props.onTestAgentTrain}
      disabled={this.props.testTrain ? true : false || this.props.testTrainLoading}
    >
      {this.props.testTrainLoading && (
        <div className={classes.profileMainLoader}>
          <div className={classes.loader}>
            <svg className={classes.circularLoader} viewBox="25 25 50 50">
              <circle
                className={classes.loaderPath}
                cx="50"
                cy="50"
                r="20"
                fill="none"
                stroke="#4e4e4e"
                strokeWidth="4"
              />
            </svg>
          </div>
          <Typography>{intl.formatMessage(messages.testing)} ({this.props.agent.agentName})</Typography>
        </div>)}
      {!this.props.testTrain && !this.props.testTrainLoading && <Typography>{intl.formatMessage(messages.test)}</Typography>}
      {this.props.testTrain && !this.props.testTrainLoading && (<Typography><img style={{ height: '10px', marginRight: '10px' }} src={checkIcon} />{intl.formatMessage(messages.testingFinished)}</Typography>)}
    </Button>)
  }

  renderTabs = (classes, intl, messages) => {
    return (
      <Tabs
        style={{ marginTop: '40px' }}
        classes={{
          indicator: classes.indicator
        }}
        value={this.state.currentTabNo}
        onChange={(evt, value) => {
          let tabs = ['keywords', 'actions'];
          this.setState({
            currentTabNo: value,
            currentTab: tabs[value]
          });
        }}
        indicatorColor="primary"
        textColor="secondary"
        centered
      >
        <Tab label={<Typography style={{ fontSize: '10px' }}>{intl.formatMessage(messages.keywords)} <span style={{ color: '#C10007', fontSize: '12px' }}>{this.props.testTrain.keywords.length}</span></Typography>}
          className={this.state.currentTab === 'keywords' ? classes.selected : null}
        />
        <Tab label={<Typography style={{ fontSize: '10px' }}>{intl.formatMessage(messages.actions)} <span style={{ color: '#C10007', fontSize: '12px' }}>{this.props.testTrain.actions.length}</span></Typography>}
          className={this.state.currentTab === 'actions' ? classes.selected : null}
        />
      </Tabs>)
  }

  renderViewFullSummary(classes, intl, messages) {
    return <div style={{
      textAlign: 'center',
      width: '100%'
    }}>
      <a
        style={{
          display: 'inline-block'
        }}
        onClick={async () => {
          await this.props.onCloseTestTrainNotification();
          await this.props.onGoToUrl(
            `/agent/${this.props.agent.id}/trainingTestSummary`,
          )
        }}
      >
        <Typography
          className={classes.viewFullSummary}
        >
          {intl.formatMessage(messages.viewFullSummary)}
        </Typography>
      </a>
    </div>
  }

  renderCloseNotification(classes, intl, messages) {
    return (<div
      onClick={() => {
        this.props.onCloseTestTrainNotification();
      }}
      className={classes.closeNotification}
    >
      <Typography>x</Typography>
    </div>)
  }

  renderFinishTestingNotification(classes, intl, messages) {
    return (
      <Fragment>
        <Typography className={classes.notification}>
          <span
            dangerouslySetInnerHTML={{
              __html: `${
                intl.formatMessage(messages.agentTestCompleteTemplateTitle, { agentName: this.props.agent.agentName })
                }`,
            }}
          />
        </Typography>
        <Typography className={classes.results}>
          {intl.formatMessage(messages.agentTestCompleteResults)}
        </Typography>
        <Typography className={classes.notification}>
          <span
            dangerouslySetInnerHTML={{
              __html: `${
                intl.formatMessage(messages.agentTestCompleteResultsContent, { accuracy: this.props.testTrain.accuracy.toFixed(2) * 100 })
                }`,
            }}
          />
        </Typography>
      </Fragment>
    )
  }

  renderGoToReviewPage(classes, intl, messages) {
    return (
      <Fragment >
        <Typography style={{ marginLeft: '8px' }} className={classes.notification}>
          <span
            dangerouslySetInnerHTML={{
              __html: `${
                intl.formatMessage(messages.goToReviewPage)
                }`,
            }}
          />
        </Typography>
      </Fragment >
    )
  }

  render() {
    const { classes, intl } = this.props;
    return (
      <Grid className={classes.notificationsContainer} container spacing={16}>
        <Grid
          item
          xs={12}
          className={classes.notificationContainer}
        >
          {this.renderNotificationDot(classes, intl)}
          {!this.props.testTrainLoading && !this.props.testTrain && this.renderFinishTrainingNotification(classes, intl, messages)}
          {this.renderButton(classes, intl, messages)}
          {!this.props.testTrainLoading && this.props.testTrain && this.renderFinishTestingNotification(classes, intl, messages)}

          {this.props.testTrain && !this.props.testTrainLoading && this.renderTabs(classes, intl, messages)}
          {!this.props.testTrainLoading && this.props.testTrain && (
            <Grid
              container
              className={classes.keywordsActionsContainer}
            >
              {!this.props.testTrainLoading && this.props.testTrain && this.state.currentTab === 'keywords' && this.renderKeywordsTable(classes, intl)}
              {!this.props.testTrainLoading && this.props.testTrain && this.state.currentTab === 'actions' && this.renderActionsTable(classes, intl)}
              <br />
              <br />
              <br />
              {!this.props.testTrainLoading && this.props.testTrain && this.renderViewFullSummary(classes, intl, messages)}
              <br />
              <br />
              {!this.props.testTrainLoading && this.props.testTrain && this.renderGoToReviewPage(classes, intl, messages)}
            </Grid>
          )}
        </Grid>
        {!this.props.testTrainLoading && this.renderCloseNotification(classes, intl, messages)}
      </Grid >
    );
  }
}

TestTrainNotification.propTypes = {
  intl: intlShape,
  classes: PropTypes.object.isRequired,
  onCloseNotification: PropTypes.func,
  notifications: PropTypes.array,
};

export default injectIntl(withStyles(styles)(TestTrainNotification));
