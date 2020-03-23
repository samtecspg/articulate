import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import PropTypes from 'prop-types';
import { Grid, Typography, Button, Modal, Tabs, Tab, Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import messages from '../messages';
import { map } from 'lodash';

import agentIcon from '../../../images/agents-icon.svg';
import playHelpIcon from '../../../images/play-help-icon.svg';

const styles = {
  headerContainer: {
    backgroundColor: '#f6f7f8',
    border: '1px solid #c5cbd8',
    borderRadius: '5px',
    marginBottom: '60px',
  },
  titleContainer: {
    padding: '25px',
  },
  agentIcon: {
    display: 'inline',
    paddingRight: '10px',
    height: '30px',
  },
  titleTextHelpContainer: {
    display: 'inline',
    position: 'relative',
    bottom: '6px',
  },
  title: {
    display: 'inline',
    paddingRight: '25px',
  },
  helpButton: {
    display: 'inline',
    width: '50px',
    height: '20px',
  },
  playIcon: {
    height: '10px',
  },
  helpText: {
    fontSize: '9px',
    fontWeight: 300,
    position: 'relative',
    bottom: '2px',
    paddingLeft: '2px',
  },
  agentTabs: {
    paddingLeft: '15px'
  },
  selected: {
    color: '#4e4e4e',
    border: '1px solid #C5CBD8',
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
    backgroundColor: '#fff',
    borderBottom: '0px',
  },
  modalContent: {
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%)`,
    position: 'absolute',
    width: '80%',
    height: '80%',
    backgroundColor: '#fff',
    boxShadow:
      '0px 3px 5px -1px rgba(0, 0, 0, 0.2),0px 5px 8px 0px rgba(0, 0, 0, 0.14),0px 1px 14px 0px rgba(0, 0, 0, 0.12)',
  },
  settingsIcon: {
    height: '18px',
    paddingRight: '5px',
    position: 'absolute',
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
  tabLabel: {
    padding: '0px 10px',
    position: 'relative',
    top: '5px',
  },
  settingsTabLabel: {
    padding: '0px 20px',
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
  formContainer: {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #c5cbd8',
    borderBottomLeftRadius: '5px',
    borderBottomRightRadius: '5px',
  },
  formSubContainer: {
    paddingLeft: '25px',
    paddingRight: '25px',
    paddingBottom: '40px'
  },
  badNumber: {
    marginLeft: '6px',
    backgroundColor: '#C10007',
    padding: '1px 6px',
    borderRadius: '4px',
    color: 'white'
  },
  formDescriptionContainer: {
    margin: '15px 0px',
  },
  formDescription: {
    fontSize: '14px',
    fontWeight: 300,
  },
};

/* eslint-disable react/prefer-stateless-function */
class Form extends React.Component {

  constructor(props) {
    super(props);
  }

  state = {
    openModal: false
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

  renderKeywordsTable = (classes, intl, messages) => {
    return (<Table>
      <TableBody>
        {(!this.props.testTrain || this.props.testTrain.keywords.length === 0) && (
          <TableRow
            className={classes.keywordRow}
          >
            <TableCell>
              <span>{intl.formatMessage(messages.noData)}</span>
            </TableCell>
          </TableRow>
        )}
        {this.props.testTrain ? (this.props.testTrain.keywords.map((keyword, index) => (
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
        ))) : null}
      </TableBody>
    </Table>)
  }

  getMultiactionArray = (multiAction) => {
    return multiAction.split('+__+');
  }

  renderActionsTable = (classes, intl, messages) => {
    return (<Table>
      <TableBody>
        {(!this.props.testTrain || this.props.testTrain.actions.length === 0) && (
          <TableRow
            className={classes.keywordRow}
          >
            <TableCell>
              <span>{intl.formatMessage(messages.noData)}</span>
            </TableCell>
          </TableRow>
        )}
        {this.props.testTrain ? (this.props.testTrain.actions.map((action, index) => (
          <TableRow
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
          </TableRow>
        ))) : null}
      </TableBody>
    </Table>)
  }


  render() {
    const { classes, intl, isReadOnly } = this.props;
    return (
      <Grid className={classes.headerContainer} container item xs={12}>
        <Grid className={classes.titleContainer} item xs={12}>
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
                  width="100%"
                  height="100%"
                  src={
                    this.props.selectedTab === 'sayings'
                      ? 'https://www.youtube.com/embed/opL04qS6S5U'
                      : 'https://www.youtube.com/embed/-Agogt68gSg'
                  }
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </Grid>
            </Modal>
          </Grid>
          <Grid className={classes.formDescriptionContainer} container>
            <Typography className={classes.formDescription}>
              <span
                dangerouslySetInnerHTML={{
                  __html: `${
                    intl.formatMessage(messages.trainingTestSummaryDescription, { accuracy: this.props.testTrain ? Number(this.props.testTrain.accuracy).toFixed(2) * 100 : 0 })
                    }`,
                }}
              />
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid item xs={12} container direction={'row'}>
            <Grid item xs={6}>
              <Tabs
                className={classes.agentTabs}
                value={this.props.selectedTab}
                indicatorColor="primary"
                textColor="secondary"
                scrollable
                scrollButtons="off"
                onChange={(evt, value) => {
                  this.props.handleTabChange(evt, value);
                }}
                TabIndicatorProps={{
                  style: {
                    display: 'none',
                  },
                }}
              >
                <Tab
                  value="keywords"
                  label={
                    <span className={classes.tabLabel}>
                      <span>{intl.formatMessage(messages.keywordsFormTitle)}</span> <span style={{ color: '#C10007', fontSize: '12px' }}>{this.props.testTrain ? this.props.testTrain.keywords.length : 0}</span>
                    </span>
                  }
                  className={
                    this.props.selectedTab === 'keywords' ? classes.selected : null
                  }
                />
                <Tab
                  value="actions"
                  label={
                    <span className={classes.tabLabel}>
                      <span>{intl.formatMessage(messages.actionsFormTitle)}</span> <span style={{ color: '#C10007', fontSize: '12px' }}>{this.props.testTrain ? this.props.testTrain.actions.length : 0}</span>
                    </span>
                  }
                  className={
                    this.props.selectedTab === 'actions' ? classes.selected : null
                  }
                />
              </Tabs>
            </Grid>
          </Grid>
          <Grid className={classes.formContainer} container item xs={12}>
            <Grid
              container
              direction="row"
            >
              <Grid
                item xs={6}>
                <Typography
                  style={{
                    marginLeft: '25px',
                    marginTop: '40px',
                    display: 'inline-block',
                    color: '#C10007',
                    fontSize: '12px'
                  }}
                >
                  {this.props.selectedTab === 'keywords' && this.props.testTrain ? this.props.testTrain.keywords.map(keyword => { return keyword.bad }).reduce(function (acc, val) { return acc + val; }, 0) : null}
                  {this.props.selectedTab === 'actions' && this.props.testTrain ? this.props.testTrain.actions.map(action => { return action.bad }).reduce(function (acc, val) { return acc + val; }, 0) : null}
                </Typography>
                {' '}
                <Typography
                  style={{
                    display: 'inline-block',
                    color: '#4E4E4E',
                    fontSize: '12px'
                  }}
                >
                  {intl.formatMessage(messages.issuesTotal)}
                </Typography>
              </Grid>
              <Grid item xs={6}
                style={{ textAlign: 'right' }}
              >
                <Typography
                  style={{
                    marginRight: '25px',
                    marginTop: '40px',
                    display: 'inline-block',
                    color: '#A2A7B1',
                    fontSize: '12px'
                  }}
                >
                  {intl.formatMessage(messages.accuracyPrc)}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              className={classes.formSubContainer}
              id="formContainer"
              container
              item
              xs={12}
            >
              {this.props.selectedTab === 'keywords' && this.renderKeywordsTable(classes, intl, messages)}
              {this.props.selectedTab === 'actions' && this.renderActionsTable(classes, intl, messages)}
            </Grid>
          </Grid>
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
  agentFilteredActions: PropTypes.array,
  onAddSaying: PropTypes.func,
  onDeleteSaying: PropTypes.func,
  onDeleteAction: PropTypes.func,
  onTagKeyword: PropTypes.func,
  onUntagKeyword: PropTypes.func,
  onSearchSaying: PropTypes.func,
  onSearchCategory: PropTypes.func,
  onSearchActions: PropTypes.func,
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
  selectedTab: PropTypes.string,
  handleTabChange: PropTypes.func,
  onChangeSayingCategory: PropTypes.func,
  isReadOnly: PropTypes.bool,
  onChangeDialoguePageFilterSearchSaying: PropTypes.func,
  dialoguePageFilterSearchSaying: PropTypes.string,
  onChangeDialoguePageFilterCategory: PropTypes.func,
  dialoguePageFilterCategory: PropTypes.string,
  onChangeDialoguePageFilterSearchSaying: PropTypes.func,
  dialoguePageFilterSearchSaying: PropTypes.string,
  onChangeDialoguePageFilterCategory: PropTypes.func,
  dialoguePageFilterCategory: PropTypes.string,
  onChangeDialoguePageFilterActions: PropTypes.func,
  dialoguePageFilterActions: PropTypes.array,
  onChangeDialoguePageNumberOfFiltersApplied: PropTypes.func,
  dialoguePageNumberOfFiltersApplied: PropTypes.number,
  onResetDialoguePageFilters: PropTypes.func,
  onChangeDialoguePageFilterKeywords: PropTypes.func,
  dialoguePageFilterKeywords: PropTypes.array,
  onChangeDialoguePageFilterKeywordIssues: PropTypes.func,
  dialoguePageFilterKeywordIssues: PropTypes.bool,
  onChangeDialoguePageFilterActionIssues: PropTypes.func,
  dialoguePageFilterActionIssues: PropTypes.bool,
};

Form.defaultProps = {
  isReadOnly: false,
};


export default injectIntl(withStyles(styles)(Form));
