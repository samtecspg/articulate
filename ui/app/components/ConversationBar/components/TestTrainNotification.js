import React from 'react';

import PropTypes from 'prop-types';
import { Grid, Typography, Button, Tabs, Tab, Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { injectIntl, intlShape } from 'react-intl';
import messages from '../messages';

const styles = {
  notificationsContainer: {
    marginTop: '0px',
  },
  notificationContainer: {
    backgroundColor: '#f6f7f8',
    border: '1px solid #4e4e4e',
    margin: '10px 35px 0px 20px',
    borderRadius: '3px',
    position: 'relative',
  },
  notificationContainerError: {
    backgroundColor: '#ffebee',
    border: '1px solid #4e4e4e',
    margin: '10px 35px 0px 20px',
    borderRadius: '3px',
    position: 'relative',
  },
  notification: {
    paddingLeft: '5px',
    fontSize: '12px',
    fontWeight: 300,
    width: '95%',
  },
  notificationDot: {
    height: '12px',
    width: '12px',
    borderRadius: '50%',
    position: 'absolute',
    top: -5,
    left: -5,
  },
  closeNotification: {
    position: 'absolute',
    top: 5,
    right: 10,
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
    border: '1px solid #C5CBD8',
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
    backgroundColor: '#fff',
    borderBottom: '0px',
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
};

/* eslint-disable react/prefer-stateless-function */
export class TestTrainNotification extends React.Component {
  state = {
    currentTab: 'keywords',
    currentTabNo: 0
  }
  componentDidMount() {
    //this.interval = setInterval(() => {
    //  this.setState({ time: Date.now() });
    //}, 5000); // update the component every 10 seconds
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  renderKeywordsTable = (classes, intl) => {
    return (<Table>
      <TableBody>
        {this.props.testTrain ? (this.props.testTrain.result.keywords.map((keyword, index) => (
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
                style={{ backgroundColor: /*keyword.uiColor*/ '#FFC9DE' }}
                className={classes.dot}
              />
              <span>{keyword.keywordName}</span>
            </TableCell>
          </TableRow>
        ))) : null}
      </TableBody>
    </Table>)
  }

  renderActionsTable = (classes, intl) => {
    return (<Table>
      <TableBody>
        {this.props.testTrain ? (this.props.testTrain.result.actions.map((action, index) => (
          <TableRow
            className={classes.keywordRow}
            onClick={async () => {
              await this.props.onResetDialoguePageFilter();
              await this.props.onChangeDialoguePageFilterActionIssues();
              await this.props.onChangeDialoguePageFilterActions([action.actionName]);
              await this.props.onChangeDialoguePageNumberOfFiltersApplied(2);
              await this.props.onChangeDialoguePageFilterString('actions:"' + action.actionName + '" actionIssues:"true"');
              await this.props.onSearchSaying();
              await this.props.onGoToUrl(
                `/agent/${this.props.agent.id}/dialogue`,
              );
            }}
            key={`${action}_${index}`}
          >
            <TableCell>
              <span>{action.actionName}</span>
            </TableCell>
          </TableRow>
        ))) : null}
      </TableBody>
    </Table>)
  }

  render() {
    const { classes, intl } = this.props;
    return (
      <Grid className={classes.notificationsContainer} container spacing={16}>
        {
          <Grid
            item
            xs={12}
            key={`notification_${1}`}
            className={
              classes.notificationContainer
            }
          >
            <div
              className={classes.notificationDot}
              style={{
                backgroundColor:
                  '#358fec',
              }}
            />
            <Typography className={classes.notification}>
              <span
                dangerouslySetInnerHTML={{
                  __html: `${
                    intl.formatMessage(messages.notificationTitle)
                    }: ${'THIS IS THE MESSAGE'}`,
                }}
              />
            </Typography>
            <Typography>
              {'Next, would you like to test out this trining to make sure nothing conflicts?'}
            </Typography>
            <Button
              onClick={this.props.onTestAgentTrain}
            >
              Test
            </Button>
            <Tabs
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
              <Tab label="Keywords"
                className={classes.selected}
              />
              <Tab label="Actions" />
            </Tabs>
            {this.state.currentTab === 'keywords' && this.renderKeywordsTable(classes, intl)}
            {this.state.currentTab === 'actions' && this.renderActionsTable(classes, intl)}
            <div
              onClick={() => {
                this.props.onCloseNotification(index);
              }}
              className={classes.closeNotification}
            >
              <Typography>x</Typography>
            </div>
          </Grid>
        }
      </Grid>
    );
  }
}

TestTrainNotification.propTypes = {
  intl: intlShape,
  classes: PropTypes.object.isRequired,
  onCloseNotification: PropTypes.func,
  notifications: PropTypes.array,
  onOpenTestTrainModal: PropTypes.func
};

export default injectIntl(withStyles(styles)(TestTrainNotification));
