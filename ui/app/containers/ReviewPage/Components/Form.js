import { Button, Grid, Input, Modal, Typography, Tabs, Tab, CircularProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import playHelpIcon from '../../../images/play-help-icon.svg';
import reviewIcon from '../../../images/icon-review.svg';
import searchIcon from '../../../images/search-icon.svg';
import messages from '../messages';
import { map } from 'lodash';
import SayingsDataForm from './SayingsDataForm';
import SessionsDataForm from './SessionsDataForm';
import Logs from './Logs';
import ExitModal from '../../../components/ExitModal';
import PopoverFilter from './../../../components/PopoverFilter';

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
  reviewIcon: {
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
  reviewTabs: {
    paddingLeft: '15px',
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
  searchForm: {
    display: 'inline',
    paddingLeft: '25px',
  },
  searchInputField: {
    width: '250px',
    paddingLeft: '5px',
    fontSize: '14px',
  },
  tabLabel: {
    padding: '0px 10px',
    position: 'relative',
    top: '5px',
  },
};

/* eslint-disable react/prefer-stateless-function */
class Form extends React.Component {

  constructor(props) {
    super(props);
    this.processSelectedPopoverFiltersDocuments = this.processSelectedPopoverFiltersDocuments.bind(this);
    this.processSelectedPopoverFiltersLogs = this.processSelectedPopoverFiltersLogs.bind(this);
  }

  state = {
    openModal: false,
    refreshLogFilter: '',
    numberLogsFilter: 1000
  };

  handle

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

  processSelectedPopoverFiltersDocuments(dropDownValuePicked, chipValuesPicked, textFilterValue, actionInterval) {
    var filter = '';
    if (textFilterValue != '') {
      filter = filter + textFilterValue + ' ';
    }
    if (dropDownValuePicked != 'Pick Category') {
      filter = filter + 'category:"' + dropDownValuePicked + '"';
    }
    if (chipValuesPicked.length > 0) {
      filter = filter + ' actions:"'
      filter = filter + chipValuesPicked.join('" actions:"')
      filter = filter + '"';
    }

    if (actionInterval) {
      filter = filter + ' actionIntervals:"'
      filter = filter + actionInterval.join('" actionIntervals:"')
      filter = filter + '"';
    }
    this.props.onSearchSaying(filter);
  }

  processSelectedPopoverFiltersLogs(dropDownValuePicked, chipValuesPicked, textFilterValue, actionInterval, checkboxValuesPicked, currentJustMax) {
    var filter = '';
    if (checkboxValuesPicked.length > 0) {
      filter = filter + ' containers:"';
      filter = filter + checkboxValuesPicked.map(container => { return container.toLowerCase() }).join('" containers:"');
      filter = filter + '"';
    }
    this.props.onSearchLog(filter, currentJustMax);
    this.setState({
      refreshLogFilter: filter,
      numberLogsFilter: currentJustMax
    });
  }

  render() {
    const { classes, intl } = this.props;
    return (
      <Grid className={classes.headerContainer} container item xs={12}>
        <Grid className={classes.titleContainer} item xs={12}>
          <img alt="" className={classes.reviewIcon} src={reviewIcon} />
          <Grid className={classes.titleTextHelpContainer} container>
            <Typography className={classes.title} variant="h2">
              <FormattedMessage {...messages.formTitle} />
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
            {/* <form className={classes.searchForm}>
            <img src={searchIcon} alt={intl.formatMessage(messages.searchReviewAlt)} />
            <Input
              inputProps={{
                style: {
                  border: 'none',
                },
              }}
              disableUnderline
              className={classes.searchInputField}
              placeholder={intl.formatMessage(messages.searchReviewPlaceholder)}
              onChange={(evt) => {
                this.props.onSearchSaying(evt.target.value);
              }}
            />
            </form> */}
            <Modal open={this.state.openModal} onClose={this.handleClose}>
              <Grid className={classes.modalContent} container>
                <iframe
                  title="SPG Intro"
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/o807YDeK6Vg"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </Grid>
            </Modal>
            <ExitModal
              open={this.props.deleteDocumentModalOpen}
              onExit={() => {
                this.props.onDeleteDocumentModalChange(false);
              }}
              onSaveAndExit={() => {
                this.props.onDeleteDocument();
                this.props.onDeleteDocumentModalChange(false);
              }}
              onClose={() => {
                this.props.onDeleteDocumentModalChange(false);
              }}
              customMessage1={intl.formatMessage(messages.deleteDocumentAlert1)}
              customMessage2={intl.formatMessage(messages.deleteDocumentAlert2)}
              customMessageSaveAndExitButton={intl.formatMessage(messages.deleteDocumentAlertYes)}
              customMessageExitButton={intl.formatMessage(messages.deleteDocumentAlertNo)}
            />
            <ExitModal
              open={this.props.deleteSessionModalOpen}
              onExit={() => {
                this.props.onDeleteSessionModalChange(false);
              }}
              onSaveAndExit={() => {
                this.props.onDeleteSession();
                this.props.onDeleteSessionModalChange(false);
              }}
              onClose={() => {
                this.props.onDeleteSessionModalChange(false);
              }}
              customMessage1={intl.formatMessage(messages.deleteSessionAlert1)}
              customMessage2={intl.formatMessage(messages.deleteSessionAlert2)}
              customMessageSaveAndExitButton={intl.formatMessage(messages.deleteSessionAlertYes)}
              customMessageExitButton={intl.formatMessage(messages.deleteSessionAlertNo)}
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid item xs={12} container direction={'row'}>
            <Grid item xs={6}>
              <Tabs
                className={classes.reviewTabs}
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
                  value="documents"
                  label={
                    <span className={classes.tabLabel}>
                      <span>{intl.formatMessage(messages.sayingsFormTitle)}</span>
                    </span>
                  }
                  className={
                    this.props.selectedTab === 'documents' ? classes.selected : null
                  }
                />
                <Tab
                  value="sessions"
                  label={
                    <span className={classes.tabLabel}>
                      <span>{intl.formatMessage(messages.sessionsFormTitle)}</span>
                    </span>
                  }
                  className={
                    this.props.selectedTab === 'sessions' ? classes.selected : null
                  }
                />
                <Tab
                  value="logs"
                  label={
                    <span className={classes.tabLabel}>
                      <span>Logs</span>
                    </span>
                  }
                  className={
                    this.props.selectedTab === 'logs' ? classes.selected : null
                  }
                />
              </Tabs>
            </Grid>
            <Grid item xs={6} style={{ justifyContent: 'flex-end' }} container direction={'row'}>
              {this.props.selectedTab === 'documents' && (
                <PopoverFilter
                  anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  showCheckboxFilter={false}
                  showTextFilter={true}
                  showDropDownFilter={false}
                  showMinMaxFilter={true}
                  showChips={true}
                  showCustomFirstChip={true}
                  chipValues={map(this.props.agentActions, 'actionName')}
                  filtersDescription={intl.formatMessage(messages.filtersDescriptionSayingsTab)}
                  textFilterPlaceholder={intl.formatMessage(messages.searchSayingPlaceholder)}
                  chipsFilterLabel={intl.formatMessage(messages.pickActions)}
                  minMaxFilterLabel={intl.formatMessage(messages.actionIntervals)}
                  minMaxIntervalsWarning={intl.formatMessage(messages.actionIntervalsWarning)}
                  customFirstChipLabel={intl.formatMessage(messages.customFirstActionLabel)}
                  processSelectedFilters={this.processSelectedPopoverFiltersDocuments}
                  absoluteMin={0}
                  absoluteMax={100}
                />
              )}
              {this.props.selectedTab === 'logs' && (
                <PopoverFilter
                  anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  showCheckboxFilter={true}
                  showTextFilter={false}
                  showDropDownFilter={false}
                  showMinMaxFilter={false}
                  showChips={false}
                  showCustomFirstChip={false}
                  checkBoxesFilterLabel={intl.formatMessage(messages.noLogsView)}
                  checkBoxesValues={['API', 'UI', 'Redis', 'Duckling', 'Nginx', 'Rasa']}
                  filtersDescription={intl.formatMessage(messages.filtersDescriptionLogsTab)}
                  processSelectedFilters={this.processSelectedPopoverFiltersLogs}
                  absoluteJustMax={10000}
                  initialJustMax={1000}
                />
              )}
            </Grid>
          </Grid>
          {this.props.selectedTab === 'documents' && (
            <SayingsDataForm
              agentId={this.props.agentId}
              documents={this.props.documents}
              agentKeywords={this.props.agentKeywords}
              agentActions={this.props.agentActions}
              agentCategories={this.props.agentCategories}
              onCopySaying={this.props.onCopySaying}
              onDeleteDocumentModalChange={this.props.onDeleteDocumentModalChange}
              onSendSayingToAction={this.props.onSendSayingToAction}
              currentPage={this.props.currentPage}
              pageSize={this.props.pageSize}
              numberOfPages={this.props.numberOfPages}
              changePage={this.props.changePage}
              movePageBack={this.props.movePageBack}
              movePageForward={this.props.movePageForward}
              changePageSize={this.props.changePageSize}
              onSelectCategory={this.props.onSelectCategory}
              category={this.props.category}
              onSearchCategory={this.props.onSearchCategory}
              newSayingActions={this.props.newSayingActions}
              onClearSayingToAction={this.props.onClearSayingToAction}
              onToggleConversationBar={this.props.onToggleConversationBar}
              onSendMessage={this.props.onSendMessage}
              onRequestSort={this.props.onRequestSort}
              sortField={this.props.sortField}
              sortDirection={this.props.sortDirection}
              locale={this.props.locale}
              timeSort={this.props.timeSort}
            />
          )}
          {this.props.selectedTab === 'sessions' && (
            <SessionsDataForm
              agent={this.props.agent}
              agentId={this.props.agentId}
              sessions={this.props.sessions}
              onCopySaying={this.props.onCopySaying}
              onDeleteSessionModalChange={this.props.onDeleteSessionModalChange}
              onSendSayingToAction={this.props.onSendSayingToAction}
              currentPage={this.props.currentPage}
              pageSize={this.props.pageSize}
              numberOfPages={this.props.numberOfPages}
              changePage={this.props.changePage}
              movePageBack={this.props.movePageBack}
              movePageForward={this.props.movePageForward}
              changePageSize={this.props.changePageSize}
              onSelectCategory={this.props.onSelectCategory}
              category={this.props.category}
              onSearchCategory={this.props.onSearchCategory}
              newSayingActions={this.props.newSayingActions}
              onClearSayingToAction={this.props.onClearSayingToAction}
              onToggleConversationBar={this.props.onToggleConversationBar}
              onSendMessage={this.props.onSendMessage}
              onRequestSort={this.props.onRequestSort}
              sortField={this.props.sortField}
              sortDirection={this.props.sortDirection}
              locale={this.props.locale}
              timeSort={this.props.timeSort}
              onLoadSessionId={this.props.onLoadSessionId}
            />
          )}
          {this.props.selectedTab === 'logs' && (
            <Fragment>
              <Logs
                logsText={this.props.logsText}
                loading={this.props.loading}
                processSelectedFilters={this.processSelectedPopoverFiltersLogs}
                refreshLogs={() => { this.props.onSearchLog(this.state.refreshLogFilter, this.state.numberLogsFilter) }}
              />
            </Fragment>
          )
          }
        </Grid>
      </Grid >
    );
  }
}

Form.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  documents: PropTypes.array,
  logsText: PropTypes.string,
  agent: PropTypes.object,
  agentId: PropTypes.string,
  agentKeywords: PropTypes.array,
  agentActions: PropTypes.array,
  agentCategories: PropTypes.array,
  agentFilteredCategories: PropTypes.array,
  deleteDocumentModalOpen: PropTypes.bool,
  onDeleteSessionModalChange: PropTypes.bool,
  onCopySaying: PropTypes.func,
  onDeleteDocumentModalChange: PropTypes.func,
  onDeleteDocument: PropTypes.func,
  onDeleteSessionModalChange: PropTypes.func,
  onDeleteSession: PropTypes.func,
  onSendSayingToAction: PropTypes.func,
  currentPage: PropTypes.number,
  pageSize: PropTypes.number,
  numberOfPages: PropTypes.number,
  changePage: PropTypes.func,
  movePageBack: PropTypes.func,
  movePageForward: PropTypes.func,
  changePageSize: PropTypes.func,
  onSelectCategory: PropTypes.func,
  category: PropTypes.string,
  newSayingActions: PropTypes.array,
  onAddNewSayingAction: PropTypes.func,
  onDeleteNewSayingAction: PropTypes.func,
  onClearSayingToAction: PropTypes.func,
  onToggleConversationBar: PropTypes.func,
  onSendMessage: PropTypes.func.isRequired,
  onRequestSort: PropTypes.func,
  sortField: PropTypes.string,
  sortDirection: PropTypes.string,
  locale: PropTypes.string,
  timeSort: PropTypes.string,
  selectedTab: PropTypes.string,
  handleTabChange: PropTypes.func,
  onLoadSessionId: PropTypes.func,
  loading: PropTypes.bool,
  onSearchLog: PropTypes.func
};

export default injectIntl(withStyles(styles)(Form));
