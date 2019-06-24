import { Button, Grid, Input, Modal, Typography, Tabs, Tab } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import playHelpIcon from '../../../images/play-help-icon.svg';
import reviewIcon from '../../../images/icon-review.svg';
import searchIcon from '../../../images/search-icon.svg';
import messages from '../messages';
import SayingsDataForm from './SayingsDataForm';
import SessionsDataForm from './SessionsDataForm';

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
  state = {
    openModal: false,
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
          </Grid>
        </Grid>
        <Grid item xs={12}>
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
          </Tabs>
          {this.props.selectedTab === 'documents' && (
              <SayingsDataForm
                agentId={this.props.agentId}
                documents={this.props.documents}
                agentKeywords={this.props.agentKeywords}
                agentActions={this.props.agentActions}
                agentCategories={this.props.agentCategories}
                onCopySaying={this.props.onCopySaying}
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
        </Grid>
      </Grid>
    );
  }
}

Form.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  documents: PropTypes.array,
  agent: PropTypes.object,
  agentId: PropTypes.string,
  agentKeywords: PropTypes.array,
  agentActions: PropTypes.array,
  agentCategories: PropTypes.array,
  agentFilteredCategories: PropTypes.array,
  onCopySaying: PropTypes.func,
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
};

export default injectIntl(withStyles(styles)(Form));
