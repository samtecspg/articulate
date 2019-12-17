import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { intlShape, injectIntl } from 'react-intl';

import PropTypes from 'prop-types';
import {
  createMuiTheme,
  MuiThemeProvider,
  withStyles
} from '@material-ui/core/styles';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Grid, Popover, MenuItem, Tooltip } from '@material-ui/core';

import messages from './messages';
import { checkCookie } from '../../utils/cookies';

import settingsIcon from '../../images/settings-icon.svg';
import userListIcon from '../../images/user-list-icon.svg';
import userIconGray from '../../images/user-icon-gray.svg';
import logoutIcon from '../../images/logout-icon.svg';

import ExitModal from '../../components/ExitModal';
import { makeSelectCurrentUser } from '../../containers/App/selectors';

const tooltipTheme = createMuiTheme({
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: '14px',
        fontFamily: 'Montserrat',
        backgroundColor: 'none',
        color: '#4E4E4E',
        marginLeft: '-20px',
        marginRight: '10px'
      }
    }
  }
});

const styles = {
  settings: {
    padding: 17,
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '60px',
  },
  menuItem: {
    paddingLeft: '12pt'
  },
  popoverOption: {
    marginTop: '12px',
    marginLeft: '12px',
    marginBottom: '4px',
    display: 'inline-block',
    color: '#959595',
    fontSize: '14px',
    fontFamily: 'Montserrat'
  },
  popoverUserName: {
    display: 'inline-block',
    marginBottom: '10px',
    marginLeft: '12px',
    color: '#4E4E4E',
    marginRight: '80px',
    fontSize: '17px',
    fontFamily: 'Montserrat'
  },
  popoverValue: {
    display: 'inline-block',
    marginLeft: '8px',
    fontSize: '14px',
    fontFamily: 'Montserrat'
  },
  popoverValueBorder: {
    border: '1px solid',
    borderLeft: 'none',
    borderRight: 'none',
    borderTop: 'none'
  },
  currentUser: {
    '&:hover': {
      filter: 'invert(0)',
    },
    filter: 'invert(1)',
    paddingBottom: '8px',
    cursor: 'pointer',
    width: '100%'
  },
  settingsImage: {
    width: '100%',
  },
  currentUserClicked: {
    filter: 'invert(0)',
    paddingBottom: '8px',
    cursor: 'pointer',
    width: '100%',
  },

  logoutIcon: {
    display: 'inline-block'
  }
};

/* eslint-disable react/prefer-stateless-function */
export class AppContent extends React.Component {

  constructor(props) {
    super(props);
    this.renderPopover = this.renderPopover.bind(this.renderPopover);
    this.renderExitModal = this.renderExitModal.bind(this.renderExitModal);
  }

  state = {
    popOverAnchorEl: null,
    openLogoutExitModal: false
  }

  handlePopoverClose = () => {
    this.setState({
      popOverAnchorEl: null
    });
  };

  renderPopover = (classes, intl) => {
    return (<Popover
      anchorEl={this.state.popOverAnchorEl}
      open={Boolean(this.state.popOverAnchorEl)}
      onClose={this.handlePopoverClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      elevation={3}>
      <Grid>
        <span className={classes.popoverOption}>
          {intl.formatMessage(messages.popoverUserTitle)}
        </span>
        <br />
        <div className={classes.popoverValueBorder}>
          <span className={classes.popoverUserName}>
            {this.props.currentUser ? this.props.currentUser.email : null}
          </span>
        </div>
        <MenuItem
          className={classes.menuItem}
          onClick={() => {
            this.handlePopoverClose();
            this.setState({ openLogoutExitModal: true })
          }}
        >
          <img
            className={
              classes.logoutIcon
            }
            src={logoutIcon}
          />
          <span className={classes.popoverValue}>
            {intl.formatMessage(messages.popoverUserSignOut)}
          </span>
        </MenuItem>
      </Grid>
    </Popover>);
  }

  renderExitModal = (intl) => {
    return (<ExitModal
      open={this.state.openLogoutExitModal}
      onSaveAndExit={() => {
        this.setState({
          openLogoutExitModal: false
        });
      }
      }
      onExit={() => {
        this.setState({ openLogoutExitModal: false })
        this.props.onLogoutUser();
      }}
      onClose={() => {
        this.setState({ openLogoutExitModal: false });
      }}
      customMessage1={intl.formatMessage(messages.signOutQuestion)}
      customMessage2={intl.formatMessage(messages.signOutExplanation)}
      customMessageSaveAndExitButton={intl.formatMessage(messages.signOutNo)}
      customMessageExitButton={intl.formatMessage(messages.signOutYes)}
    />)
  }

  render() {
    const { classes, intl, conversationBarOpen, demoMode } = this.props;
    return conversationBarOpen ? (
      <Grid container>
        <Grid container item xs={12}>
          <Grid item xs={1} />
          <Grid item xl={8} lg={8} md={8} sm={10} xs={10}>
            {this.props.children}
          </Grid>
        </Grid>
        {
          demoMode ?
            null :
            <Grid className={classes.settings} item xs={12}>
              {checkCookie() && (<Fragment>
                <MuiThemeProvider theme={tooltipTheme}>
                  <Tooltip title={this.props.currentUser ? this.props.currentUser.email : ''} placement="right-start">
                    <img
                      className={this.state.popOverAnchorEl ? classes.currentUserClicked : classes.currentUser}
                      src={userIconGray}
                      alt={'intl.formatMessage(messages.usersIconAlt)'}
                      onClick={(ev) => {
                        this.setState({ popOverAnchorEl: ev.currentTarget })
                      }}
                    />
                  </Tooltip>
                </MuiThemeProvider>
              </Fragment>)}
              <Link id="settings" to="/settings">
                <img
                  src={settingsIcon}
                  alt={intl.formatMessage(messages.settingsIconAlt)}
                  className={classes.settingsImage}
                />
              </Link>
              {this.renderPopover(classes, intl)}
              {this.renderExitModal(intl)}
            </Grid>
        }
      </Grid>
    ) : (
        <Grid container>
          <Grid container item xs={12}>
            <Grid item xl={2} lg={2} md={2} sm={1} xs={1} />
            <Grid item xl={8} lg={8} md={8} sm={10} xs={10}>
              {this.props.children}
            </Grid>
            <Grid item xl={2} lg={2} md={2} sm={1} xs={1} />
          </Grid>
          {
            demoMode ?
              null :
              <Grid className={classes.settings} item xs={12}>
                <Link id="users" to="/users">
                  <img
                    style={{
                      filter: 'invert(0.51)',
                      paddingBottom: '8px'
                    }}
                    src={userListIcon}
                    alt={intl.formatMessage(messages.usersIconAlt)}
                  />
                </Link>
                <Fragment>

                  {checkCookie() && (
                    <MuiThemeProvider theme={tooltipTheme}>
                      <Tooltip title={this.props.currentUser ? this.props.currentUser.email : ''} placement="right-start" >
                        < img
                          className={this.state.popOverAnchorEl ? classes.currentUserClicked : classes.currentUser}
                          src={userIconGray}
                          alt={'intl.formatMessage(messages.usersIconAlt)'}
                          onClick={(ev) => {
                            this.setState({ popOverAnchorEl: ev.currentTarget })
                          }}
                        />
                      </Tooltip>
                    </MuiThemeProvider>)}
                </Fragment>
                <Link id="settings" to="/settings">
                  <img
                    src={settingsIcon}
                    alt={intl.formatMessage(messages.settingsIconAlt)}
                    className={classes.settingsImage}
                  />
                </Link>
                {this.renderPopover(classes, intl)}
                {this.renderExitModal(intl)}
              </Grid>
          }
        </Grid >
      );
  }
}

AppContent.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  conversationBarOpen: PropTypes.bool,
  demoMode: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser()
});

const withConnect = connect(
  mapStateToProps
);

export default withConnect(injectIntl(withStyles(styles)(AppContent)));
