/*
 * ConversationBar
 *
 *
 */

import React from 'react';
import Guid from 'guid';

import PropTypes from 'prop-types';
import { compose } from 'redux';
import { injectIntl, intlShape } from 'react-intl';
import {
  Grid,
  Typography,
  TextField,
  MenuItem,
  Button,
  Select,
  Tooltip,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import injectSaga from '../../utils/injectSaga';
import saga from './saga';

import rightArrowIcon from '../../images/right-arrow-icon.svg';
import expandTtrimmedSingleIcon from '../../images/expand-trimmed-single-icon.svg';
import eraserIcon from '../../images/eraser-icon.svg';
import trashIcon from '../../images/trash-icon.svg';
import grabIcon from '../../images/grab-icon.svg';

import messages from './messages';

import {
  makeSelectNotifications,
  makeSelectMessages,
  makeSelectAgent,
  makeSelectWaitingResponse,
  makeSelectConversationStateObject,
  makeSelectSettings,
  makeSelectSessionId,
  makeSelectSessionLoaded,
  makeSelectLoading,
} from '../../containers/App/selectors';

import {
  closeNotification,
  sendMessage,
  resetSession,
  loadSettings,
  updateSetting,
  loadSession,
  deleteSession,
  showWarning,
  respondMessage,
  storeSourceData,
} from '../../containers/App/actions';

import LoadingWave from '../LoadingWave';
import CodeModal from '../CodeModal';
import Notifications from './components/Notifications';
import gravatars from '../Gravatar';

import Nes from 'nes';
import { ROUTE_AGENT, ROUTE_CONVERSE } from '../../../../api/util/constants';
import { getWS } from '../../utils/locationResolver';
import { AUTH_ENABLED } from "../../../common/env";

const styles = {
  container: {
    height: '100%',
    position: 'fixed',
    zIndex: 1,
    top: 0,
    right: 0,
    backgroundColor: '#fff',
    borderLeft: '1px solid #c5cbd8',
  },
  clearAll: {
    borderBottom: '1px solid #979797',
    borderLeft: '1px solid #979797',
    borderRight: '1px solid #979797',
    borderRadius: '0px 0px 3px 3px',
    height: '30px',
    position: 'fixed',
    top: '0px',
    backgroundColor: '#f6f7f8',
    justifyContent: 'space-around',
  },
  clearAllLabel: {
    paddingTop: '5px',
    fontSize: '12px',
    fontWeight: 300,
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  toggle: {
    cursor: 'pointer',
    height: '35px',
    width: '25px',
    borderRadius: '3px 0px 0px 3px',
    position: 'fixed',
    top: '20px',
    zIndex: 2,
    backgroundColor: '#00c582',
    boxShadow: '0 1px 4px 1px #00bd6f',
  },
  arrow: {
    paddingTop: '10px',
    paddingLeft: '8px',
    height: '25px',
  },
  inputContainer: {
    padding: '10px',
    position: 'fixed',
    bottom: 0,
    right: 0,
  },
  messagesContainer: {
    marginRight: '20px',
    marginTop: '20px',
  },
  userMessage: {
    '&:hover': {
      boxShadow: '0 2px 10px 0px #000000',
    },
    color: '#fff',
    backgroundColor: '#00bd6f',
    borderRadius: '3px',
    padding: '8px',
    wordBreak: 'break-word',
  },
  userMessageContainer: {
    position: 'relative',
    display: '-webkit-box',
    display: '-moz-box',
    display: '-ms-flexbox',
    display: '-webkit-flex',
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '16px',
    marginRight: '12px',
    marginLeft: '60px',
  },
  agentMessage: {
    '&:hover': {
      boxShadow: '0 2px 10px 0px #000000',
    },
    color: '#4A4A4A',
    borderRadius: '3px',
    padding: '8px',
    marginRight: '60px',
    marginLeft: '15px',
    marginBottom: '16px',
  },
  agentName: {
    display: 'block',
    marginLeft: '15px',
    fontWeight: '500',
    fontSize: '10px',
    marginBottom: '3px',
  },
  messageSource: {
    '&:hover': {
      textDecoration: 'underline',
    },
    cursor: 'pointer',
    fontSize: '10px',
    display: 'block',
    marginTop: '10px',
  },
  contentContainer: {
    position: 'fixed',
    top: '60px',
    bottom: '95px',
    overflowY: 'scroll',
    overflowX: 'hidden',
  },
  agentIcon: {
    marginRight: '5px',
    height: '20px',
    position: 'relative',
    top: '3px',
  },
  sessionDropdownIcon: {
    top: 'calc(50% - 2px)',
    right: '13px',
    position: 'absolute',
    pointerEvents: 'none',
    width: '0.75em',
    display: 'inline-block',
    fontSize: '14px',
    userSelect: 'none',
    flexShrink: '0',
  },
  eraseIcon: {
    position: 'relative',
    top: '30px',
    left: '10px',
    cursor: 'pointer',
  },
  selectSession: {
    marginTop: '20px',
    padding: '0px 10px',
  },
  sessionSelectMenu: {
    padding: '8px 15px',
  },
  deleteIcon: {
    '&:hover': {
      filter: 'invert(0)',
    },
    filter: 'invert(1)',
    cursor: 'pointer',
    marginLeft: '10px',
  },
  grabWidth: {
    top: '50%',
    width: '13px',
    cursor: 'pointer',
    height: '35px',
    zIndex: 2,
    position: 'fixed',
    border: '1px solid #c5cbd8',
    borderRight: '0px',
    borderRadius: '3px 0px 0px 3px',
    backgroundColor: '#f6f7f8',
  },
};

/* eslint-disable react/prefer-stateless-function */
export class ConversationBar extends React.PureComponent {
  state = {
    sessionId: '',
    userMessage: '',
    repeatPreviousMessage: null,
    openCodeModal: false,
    isResizing: false,
    lastDownX: 0,
    newWidth: this.props.settings.conversationPanelWidth ? this.props.settings.conversationPanelWidth : 300,
    client: null,
    socketClientConnected: false,
  };

  componentWillMount() {
    if (!this.props.settings.defaultAgentLanguage) {
      this.props.onLoadSettings();
    }

    if (!this.state.socketClientConnected) {
      const client = new Nes.Client(getWS());
      client.onConnect = () => {
        this.setState({
          client,
          socketClientConnected: true,
        });

        const handler = response => {
          if (response) {
            this.props.onRespondMessage({
              author: this.props.agent.agentName,
              docId: response.docId,
              message: response.textResponse,
              conversationStateObject: response.conversationStateObject,
            });
            this.props.onStoreSourceData({ ...response.conversationStateObject });
          }
        };

        client.subscribe(
          `/${ROUTE_AGENT}/${this.props.agent.id}/${ROUTE_CONVERSE}`,
          handler,
        );
      };
      client.connect({
        delay: 1000,
        auth: AUTH_ENABLED
          ? { headers: { cookie: document.cookie } }
          : undefined,
      });
    }
  }

  componentDidMount() {
    this.scrollToBottom();
    document.addEventListener('mousemove', e => this.handleMousemove(e));
    document.addEventListener('mouseup', e => this.handleMouseup(e));

    if (!this.props.sessionLoaded) {
      const sessions = JSON.parse(sessionStorage.getItem('sessions'));
      if (sessions && sessions[this.props.agent.agentName]) {
        const sessionIdStored = sessions[this.props.agent.agentName].sessionId;
        if (sessionIdStored) {
          this.props.onLoadSessionId(sessionIdStored);
        }
      }
    }
  }

  componentDidUpdate(prevProps) {
    this.scrollToBottom();
    if (
      this.props.settings.conversationPanelWidth !==
      prevProps.settings.conversationPanelWidth
    ) {
      this.setState({
        newWidth: this.props.settings.conversationPanelWidth,
      });
    }
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView(true);
  };

  handleMousedown = e => {
    this.setState({ isResizing: true, lastDownX: e.clientX });
  };

  handleMousemove = e => {
    // we don't want to do anything if we aren't resizing.
    if (!this.state.isResizing) {
      return;
    }

    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    } else if (document.selection) {
      document.selection.empty();
    }

    const offsetRight =
      document.body.offsetWidth - (e.clientX - document.body.offsetLeft);
    const minWidth = 300;
    const maxWidth = 600;
    if (offsetRight >= minWidth && offsetRight <= maxWidth) {
      this.setState({ newWidth: offsetRight });
    }
  };

  handleMouseup = e => {
    if (this.state.isResizing) {
      this.props.onUpdateConversationPanelWidth(this.state.newWidth);
    }
    this.setState({ isResizing: false });
  };

  render() {
    const { classes, intl, demoMode } = this.props;
    return (
      <Grid
        style={{ width: this.state.newWidth }}
        className={classes.container}
      >
        <div
          style={{ right: this.state.newWidth }}
          onMouseDown={event => {
            this.handleMousedown(event);
          }}
          id="resize"
          className={classes.grabWidth}
        >
          <img
            style={{ position: 'relative', top: '2px', left: '2px' }}
            src={grabIcon}
          />
        </div>
        <Grid style={{ cursor: 'default' }}>
          <Grid id="sessionSelector" container>
            <Grid item xs={demoMode ? 12 : 10}>
              <Select
                className={classes.selectSession}
                fullWidth
                id="sessionId"
                value={this.props.sessionId || 'select'}
                IconComponent={() => (
                  <img
                    className={classes.sessionDropdownIcon}
                    src={expandTtrimmedSingleIcon}
                  />
                )}
                onChange={evt => {
                  if (
                    evt.nativeEvent &&
                    evt.nativeEvent.target &&
                    evt.nativeEvent.target.id.indexOf('deleteSession') > -1
                  ) {
                    // Removes the sessionId from the sessions array in the sessionStorage of the browser
                    const sessions = JSON.parse(
                      sessionStorage.getItem('sessions'),
                    );
                    const indexOfSession = sessions[
                      this.props.agent.agentName
                    ].sessions.indexOf(evt.target.value);
                    sessions[this.props.agent.agentName].sessions.splice(
                      indexOfSession,
                      1,
                    );

                    // Gets current sessionId selected by the user
                    const currentSession =
                      sessions[this.props.agent.agentName].sessionId;
                    const areTheSame = currentSession === evt.target.value;
                    sessions[this.props.agent.agentName].sessionId = areTheSame
                      ? ''
                      : currentSession;
                    sessionStorage.setItem(
                      'sessions',
                      JSON.stringify(sessions),
                    );

                    // If the current session is the same than the deleted session, then remove it from the storage
                    this.props.onDeleteSession(evt.target.value, areTheSame);
                  } else if (evt.target.value === 'newSession') {
                    if (this.props.agent) {
                      let sessions = sessionStorage.getItem('sessions');
                      if (!sessions) {
                        sessions = '{}';
                      }
                      sessions = JSON.parse(sessions);
                      if (!sessions[this.props.agent.agentName]) {
                        sessions[this.props.agent.agentName] = {
                          sessionId: '',
                          sessions: [],
                        };
                      }
                      const newSessionId = `${this.props.agent.agentName.replace(
                        ' ',
                        '',
                      )}-session-${Guid.create().toString()}`;
                      sessions[this.props.agent.agentName].sessions.unshift(
                        newSessionId,
                      );
                      sessions[
                        this.props.agent.agentName
                      ].sessionId = newSessionId;
                      sessionStorage.setItem(
                        'sessions',
                        JSON.stringify(sessions),
                      );
                      this.props.onLoadSessionId(newSessionId, true);
                    }
                  } else if (evt.target.value !== 'select') {
                    let sessions = sessionStorage.getItem('sessions');
                    sessions = JSON.parse(sessions);
                    sessions[this.props.agent.agentName].sessionId =
                      evt.target.value;
                    sessionStorage.setItem(
                      'sessions',
                      JSON.stringify(sessions),
                    );
                    this.props.onLoadSessionId(evt.target.value);
                  }
                }}
                classes={{
                  selectMenu: classes.sessionSelectMenu,
                }}
              >
                <MenuItem
                  style={{ marginBottom: '10px' }}
                  key="newSession"
                  value="newSession"
                >
                  <Button variant="contained">
                    {intl.formatMessage(messages.newSession)}
                  </Button>
                </MenuItem>
                {sessionStorage.getItem('sessions') ? (
                  JSON.parse(sessionStorage.getItem('sessions'))[
                    this.props.agent.agentName
                  ] ? (
                    [
                      !this.props.sessionId ? (
                        <MenuItem key="select" value="select">
                          <span>{intl.formatMessage(messages.noSession)}</span>
                        </MenuItem>
                      ) : null,
                      JSON.parse(sessionStorage.getItem('sessions'))[
                        this.props.agent.agentName
                      ].sessions.map((agentSession, index) => (
                        <MenuItem
                          key={`agentSession_${index}`}
                          value={agentSession}
                        >
                          <span>
                            {agentSession}
                            {demoMode ? null :
                            <img
                              id={`deleteSession_${index}`}
                              className={classes.deleteIcon}
                              src={trashIcon}
                            />
                            }
                          </span>
                        </MenuItem>
                      )),
                    ]
                  ) : (
                    <MenuItem key="select" value="select">
                      <span>{intl.formatMessage(messages.noSession)}</span>
                    </MenuItem>
                  )
                ) : (
                  <MenuItem key="select" value="select">
                    <span>{intl.formatMessage(messages.noSession)}</span>
                  </MenuItem>
                )}
              </Select>
            </Grid>
            {demoMode ? null :
            <Grid item xs={2}>
              <Tooltip
                placement="bottom-end"
                title={intl.formatMessage(messages.erase)}
              >
                <img
                  className={classes.eraseIcon}
                  src={eraserIcon}
                  onClick={() => this.props.onResetSession()}
                />
              </Tooltip>
            </Grid>
            }
          </Grid>
          <Grid
            style={{ right: this.state.newWidth }}
            container
            onClick={() => {
              this.props.onToggleConversationBar(this.state.newWidth > 300);
            }}
            className={classes.toggle}
          >
            <img className={classes.arrow} src={rightArrowIcon} />
          </Grid>
          <Grid
            style={{ width: this.state.newWidth + 17 }}
            className={classes.contentContainer}
          >
            <Notifications
              notifications={this.props.notifications}
              onCloseNotification={this.props.onCloseNotification}
            />
            <Grid className={classes.messagesContainer}>
              {this.props.messages.map((message, index) => {
                if (message.author === 'User') {
                  return (
                    <Grid
                      key={`message_${index}`}
                      item
                      className={classes.userMessageContainer}
                    >
                      <Typography className={classes.userMessage}>
                        {message.message}
                      </Typography>
                    </Grid>
                  );
                }

                return (
                  <Grid key={`message_${index}`}>
                    <Typography
                      style={{ color: this.props.agent.uiColor }}
                      className={classes.agentName}
                    >
                      {this.props.agent.gravatar !== ''
                        ? gravatars[this.props.agent.gravatar - 1]({
                            color: this.props.agent.uiColor,
                            className: classes.agentIcon,
                          })
                        : null}
                      {message.author}
                    </Typography>
                    <Typography
                      style={{
                        border: `1px solid ${this.props.agent.uiColor}`,
                      }}
                      className={classes.agentMessage}
                    >
                      {message.message}
                      {message.docId && !demoMode ? (
                        <span
                          onClick={() => {
                            this.setState({
                              openCodeModal: true,
                              conversationStateObject:
                                message.conversationStateObject,
                            });
                          }}
                          className={classes.messageSource}
                        >
                          {'</> '}
                          <span className={classes.messageSourceLink}>
                            {intl.formatMessage(messages.seeSource)}
                          </span>
                        </span>
                      ) : null}
                    </Typography>
                  </Grid>
                );
              })}
              {this.props.waitingResponse ? (
                <LoadingWave
                  agentName={
                    <Typography
                      style={{ color: this.props.agent.uiColor }}
                      className={classes.agentName}
                    >
                      {this.props.agent.gravatar !== ''
                        ? gravatars[this.props.agent.gravatar - 1]({
                            color: this.props.agent.uiColor,
                            className: classes.agentIcon,
                          })
                        : null}
                      {this.props.agent.agentName}
                    </Typography>
                  }
                />
              ) : null}
              <div
                style={{ float: 'left', clear: 'both' }}
                ref={el => {
                  this.messagesEnd = el;
                }}
              />
            </Grid>
          </Grid>
          <Grid
            style={{ width: this.state.newWidth - 2 }}
            container
            className={classes.inputContainer}
          >
            <Grid item xs={12}>
              <TextField
                id="userMessage"
                value={this.state.userMessage}
                placeholder={intl.formatMessage(
                  messages.userMessagePlaceholder,
                )}
                onChange={evt => {
                  this.setState({ userMessage: evt.target.value });
                }}
                onKeyDown={evt => {
                  if (evt.key === 'Enter' && evt.target.value !== '') {
                    evt.preventDefault();
                    if (!this.props.sessionId) {
                      if (this.props.agent) {
                        let sessions = sessionStorage.getItem('sessions');
                        if (!sessions) {
                          sessions = '{}';
                        }
                        sessions = JSON.parse(sessions);
                        if (
                          !sessions[this.props.agent.agentName] ||
                          sessions[this.props.agent.agentName].sessions
                            .length === 0
                        ) {
                          sessions[this.props.agent.agentName] = {
                            sessionId: '',
                            sessions: [],
                          };

                          const newSessionId = `${this.props.agent.agentName.replace(
                            ' ',
                            '',
                          )}-session-${Guid.create().toString()}`;
                          sessions[this.props.agent.agentName].sessions.unshift(
                            newSessionId,
                          );
                          sessions[
                            this.props.agent.agentName
                          ].sessionId = newSessionId;
                          sessionStorage.setItem(
                            'sessions',
                            JSON.stringify(sessions),
                          );
                          this.props.onLoadSessionId(newSessionId, true);

                          this.props.onSendMessage(
                            evt.target.value,
                            newSessionId,
                          );
                          this.setState({
                            userMessage: '',
                          });
                        } else {
                          this.props.onShowWarning(
                            intl.formatMessage(messages.selectSession),
                          );
                        }
                      }
                    } else {
                      this.props.onSendMessage(evt.target.value);
                      this.setState({
                        userMessage: '',
                      });
                    }
                  }
                  if (evt.key === 'ArrowUp') {
                    if (this.props.messages.length > 0) {
                      const { messages } = this.props;
                      let len =
                        this.state.repeatPreviousMessage || messages.length;
                      let message = null;

                      while (len-- && !message) {
                        if (messages[len].author === 'User') {
                          this.state.repeatPreviousMessage = len;
                          message = messages[len].message;
                        }
                      }

                      evt.target.value = message;
                    }
                  }
                }}
                margin="normal"
                fullWidth
              />
            </Grid>
          </Grid>
          <CodeModal
            handleClose={() => {
              this.setState({ openCodeModal: false });
            }}
            conversationStateObject={this.state.conversationStateObject}
            open={this.state.openCodeModal}
          />
        </Grid>
      </Grid>
    );
  }
}

ConversationBar.propTypes = {
  loading: PropTypes.bool,
  classes: PropTypes.object,
  intl: intlShape.isRequired,
  notifications: PropTypes.array,
  conversationStateObject: PropTypes.object,
  onResetSession: PropTypes.func,
  onCloseNotification: PropTypes.func,
  onSendMessage: PropTypes.func,
  sessionId: PropTypes.string,
  sessionLoaded: PropTypes.bool,
  onLoadSessionId: PropTypes.func,
  onDeleteSession: PropTypes.func,
  demoMode: PropTypes.bool,
};
const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  agent: makeSelectAgent(),
  notifications: makeSelectNotifications(),
  messages: makeSelectMessages(),
  waitingResponse: makeSelectWaitingResponse(),
  conversationStateObject: makeSelectConversationStateObject(),
  settings: makeSelectSettings(),
  sessionId: makeSelectSessionId(),
  sessionLoaded: makeSelectSessionLoaded(),
});

function mapDispatchToProps(dispatch) {
  return {
    onResetSession: () => {
      dispatch(resetSession());
    },
    onCloseNotification: index => {
      dispatch(closeNotification(index));
    },
    onSendMessage: (message, sessionId) => {
      dispatch(
        sendMessage({
          author: 'User',
          message,
          sessionId,
        }),
      );
    },
    onLoadSettings: () => {
      dispatch(loadSettings());
    },
    onUpdateConversationPanelWidth(newWidth) {
      dispatch(updateSetting('conversationPanelWidth', newWidth));
    },
    onLoadSessionId: (sessionId, newSession) => {
      dispatch(loadSession(sessionId, newSession));
    },
    onDeleteSession: (sessionId, clearSessionId) => {
      dispatch(deleteSession(sessionId, clearSessionId));
    },
    onShowWarning: message => {
      dispatch(showWarning(message));
    },
    onRespondMessage: (payload) => {
      dispatch(respondMessage(payload));
    },
    onStoreSourceData: (payload) => {
      dispatch(storeSourceData(payload));
    }
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga({ key: 'conversationBar', saga });

const withDefinedStyles = withStyles(styles);

export default compose(
  withSaga,
  withDefinedStyles,
  withConnect,
  injectIntl,
)(ConversationBar);
