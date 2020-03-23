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
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Slide,
  List,
  ListItem,
  ListItemText,
  Collapse,
} from '@material-ui/core';

import ReactAudioPlayer from 'react-audio-player';
import { Player } from 'video-react';
import '../../utils/video-react.css'; // import css

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
import circleEnabledIcon from '../../images/circle-enabled-icon.svg';
import circleDisabledIcon from '../../images/circle-disabled-icon.svg';

import messages from './messages';

import {
  makeSelectNotifications,
  makeSelectMessages,
  makeSelectAgent,
  makeSelectWaitingResponse,
  makeSelectCSO,
  makeSelectSettings,
  makeSelectSessionId,
  makeSelectSessionLoaded,
  makeSelectLoading,
  makeSelectConnection,
  makeSelectTestTrainLoading,
  makeSelectTestTrainError,
  makeSelectDialoguePageFilterString,
  makeSelectTrainTest,
  makeSelectTestTrainNotification
} from '../../containers/App/selectors';

import {
  closeNotification,
  closeTestTrainNotification,
  sendMessage,
  resetSession,
  loadSettings,
  updateSetting,
  loadSession,
  deleteSession,
  showWarning,
  respondMessage,
  storeSourceData,
  loadAgentTrainTest,
  testAgentTrain,
  loadSayings,
  changeDialoguePageFilterKeywords,
  changeDialoguePageFilterActions,
  changeDialoguePageFilterKeywordIssues,
  changeDialoguePageFilterString,
  changeDialoguePageNumberOfFiltersApplied,
  changeDialoguePageFilterActionIssues,
  resetDialoguePageFilters,
} from '../../containers/App/actions';

import LoadingWave from '../LoadingWave';
import CodeModal from '../CodeModal';
import Notifications from './components/Notifications';
import TestTrainNotification from './components/TestTrainNotification'
import gravatars from '../Gravatar';
import { push } from 'react-router-redux';

import Nes from 'nes';
import { getWS } from '../../utils/locationResolver';
import { AUTH_ENABLED } from "../../../common/env";
import { ROUTE_AGENT, ROUTE_CONVERSE, ROUTE_CONNECTION } from '../../../common/constants';

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
    padding: '0px 10px',
    position: 'fixed',
    bottom: 0,
    right: 0,
  },
  messagesContainer: {
    marginRight: '20px',
    marginTop: '20px',
  },
  userMessage: {
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
    color: '#4A4A4A',
    borderRadius: '3px',
    padding: '8px',
    marginRight: '60px',
    marginLeft: '15px',
    marginBottom: '16px',
  },
  agentButtonContainer: {
    whiteSpace: 'nowrap',
    overflow: 'auto',
    overflowX: 'scroll',
    width: '90%',
    marginBottom: '16px',
    marginLeft: '15px'
  },
  agentMessageButton: {
    borderRadius: '3px',
    padding: '8px',
    marginLeft: '15px',
    display: 'inline',
    width: 'auto'
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
  imageMessage: {
    marginLeft: '15px',
    width: '90%',
    borderRadius: '5px',
    marginBottom: '16px'
  },
  cardMessageContainer: {
    width: '90%',
    marginLeft: '15px',
    border: '1px solid #a2a7b1',
    marginBottom: '16px'
  },
  cardMessageImage: {
    width: '100%'
  },
  cardMessageIndicatorContainer: {
    textAlign: 'center',
    marginBottom: '16px'
  },
  cardMessageIndicator: {
    marginLeft: '2px',
    cursor: 'pointer'
  },
  audioMessage: {
    width: '90%',
    marginLeft: '15px',
    height: '25px',
    marginBottom: '16px'
  },
  buttonsContainer: {
    width: '90%',
    marginLeft: '15px',
    padding: '10px 10px 0px 10px',
    borderRadius: '5px',
    marginBottom: '16px'
  },
  buttonMessage: {
    color: '#4A4A4A',
    width: '100%',
    padding: '8px',
    display: 'inline',
    borderRadius: '3px',
    marginBottom: '10px',
    backgroundColor: '#00c582',
    color: '#fff'
  }
};

const unescapeText = (string) => {
  return unescape(string).replace(/&#x27;/g, '\'');
}

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
    newSessionCreatedForStart: false,
    cardsCarouselActiveCard: 0,
    collapsibleActiveItem: -1,
  };

  constructor(props) {
    super(props);
    this.onSearchSaying = this.onSearchSaying.bind(this);
  }

  componentWillMount() {
    if (!this.props.settings.defaultAgentLanguage) {
      this.props.onLoadSettings();
    }

    if (!this.state.socketClientConnected && !this.props.demoMode) {
      this.connectWSClient();
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

  componentWillUnmount() {
    this.disconnectWSClient();
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

    if (this.props.demoMode && !this.state.newSessionCreatedForStart && this.props.agent && this.props.agent.agentName) {
      this.setState({
        newSessionCreatedForStart: true
      });
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
        this.connectWSClient();
        this.props.onLoadSessionId(newSessionId, true);
      } else {
        if (!this.state.socketClientConnected) {
          this.connectWSClient();
        }
        if (!this.props.sessionLoaded) {
          this.props.onLoadSessionId(sessions[this.props.agent.agentName].sessionId);
        }
      }
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

  connectWSClient = () => {
    const client = new Nes.Client(getWS());
    client.onConnect = () => {
      this.setState({
        client,
        socketClientConnected: true,
      });

      const handler = (response) => {
        if (response) {
          this.props.onRespondMessage({
            author: this.props.agent.agentName,
            docId: response.docId,
            message: response.textResponse,
            quickResponses: response.quickResponses,
            richResponses: response.richResponses,
            CSO: response.CSO,
            disableTextResponse: response.disableTextResponse
          });
          this.props.onStoreSourceData({ ...response.CSO });
        }
      };

      var session, sessionId;
      if (this.props.demoMode) {
        session = sessionStorage.getItem('sessions');
        session = JSON.parse(session);
        sessionId = session[this.props.agent.agentName].sessionId;
      }
      client.subscribe(
        this.props.demoMode ?
          `/${ROUTE_CONNECTION}/${this.props.connection.id}/external/${sessionId}` :
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

  disconnectWSClient = () => {
    if (this.state.client) {
      var session, sessionId;
      if (this.props.demoMode) {
        session = sessionStorage.getItem('sessions');
        session = JSON.parse(session);
        sessionId = session[this.props.agent.agentName].sessionId;
      }
      this.state.client.unsubscribe(this.props.demoMode ?
        `/${ROUTE_CONNECTION}/${this.props.connection.id}/external/${sessionId}` :
        `/${ROUTE_AGENT}/${this.props.agent.id}/${ROUTE_CONVERSE}`);
      this.setState({
        socketClientConnected: false,
      });
    }
  }

  onSearchSaying() {
    this.props.onLoadSayings(this.props.dialoguePageFilterString, 1, 5);
  }

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
            <Grid style={{
              padding: demoMode ? '10px' : null
            }} item xs={demoMode ? 12 : 10}>
              {demoMode ?
                <Button
                  style={{
                    width: '100%',
                  }}
                  onClick={() => {
                    if (this.props.agent) {
                      let sessions = sessionStorage.getItem('sessions');
                      if (!sessions) {
                        sessions = '{}';
                      } else {
                        this.disconnectWSClient();
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
                      this.connectWSClient();
                    }
                  }}
                  variant="contained">
                  {intl.formatMessage(messages.newSession)}
                </Button> :
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
              }
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
            {this.props.testTrainNotification &&
              this.props.testTrainNotification.agentId === this.props.agent.id &&
              this.props.agent.status === 'Ready' &&
              <TestTrainNotification
                notifications={this.props.notifications}
                onCloseNotification={this.props.onCloseNotification}
                onCloseTestTrainNotification={this.props.onCloseTestTrainNotification}
                testTrain={this.props.testTrain}
                testTrainLoading={this.props.testTrainLoading}
                testTrainError={this.props.loadTestTrainError}
                onTestAgentTrain={() => { this.props.onTestAgentTrain(this.props.agent.id) }}
                onSearchSaying={this.onSearchSaying}
                onChangeDialoguePageFilterKeywords={this.props.onChangeDialoguePageFilterKeywords}
                onChangeDialoguePageFilterActions={this.props.onChangeDialoguePageFilterActions}
                onChangeDialoguePageFilterString={this.props.onChangeDialoguePageFilterString}
                onChangeDialoguePageFilterKeywordIssues={this.props.onChangeDialoguePageFilterKeywordIssues}
                onChangeDialoguePageFilterActionIssues={this.props.onChangeDialoguePageFilterActionIssues}
                onResetDialoguePageFilter={this.props.onResetDialoguePageFilter}
                onChangeDialoguePageNumberOfFiltersApplied={this.props.onChangeDialoguePageNumberOfFiltersApplied}
                onGoToUrl={this.props.onGoToUrl}
                agent={this.props.agent}
                onLoadAgentTrainTest={this.props.onLoadAgentTrainTest}
              />}
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
                    {index !== 0 && this.props.messages[index - 1].author === 'User' ? <Typography
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
                    </Typography> : null}
                    {!message.disableTextResponse &&
                      <Typography
                        style={{
                          border: `1px solid ${this.props.agent.uiColor}`,
                        }}
                        className={classes.agentMessage}
                      >
                        {unescapeText(message.message)}
                        {message.docId && !demoMode ? (
                          <span
                            onClick={() => {
                              this.setState({
                                openCodeModal: true,
                                CSO:
                                  message.CSO,
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
                    }
                    {message.quickResponses && message.quickResponses.length > 0 ?
                      <Grid className={classes.agentButtonContainer}>
                        {message.quickResponses.map((quickResponse, buttonIndex) => {
                          return (
                            <Button
                              key={`message_${index}_button_${buttonIndex}`}
                              style={{
                                border: `1px solid ${this.props.agent.uiColor}`,
                                marginLeft: buttonIndex === 0 ? '0px' : '15px'
                              }}
                              className={classes.agentMessageButton}
                              onClick={() => {
                                this.props.onSendMessage({ message: unescapeText(quickResponse), isDemo: demoMode });
                              }}
                            >
                              {unescapeText(quickResponse)}
                            </Button>
                          )
                        })}
                      </Grid> : null}
                    {message.richResponses ?
                      message.richResponses.map((richResponse, richResponseIndex) => {
                        switch (richResponse.type) {
                          case 'audio':
                            return (
                              <ReactAudioPlayer
                                className={classes.audioMessage}
                                key={`message_${index}_richResponse_${richResponseIndex}`}
                                src={unescapeText(richResponse.data.audio)}
                                controls
                              />
                            )
                          case 'buttons':
                            return (
                              <Grid key={`message_${index}_richResponse_${richResponseIndex}`}>
                                <div style={{ border: `1px solid ${this.props.agent.uiColor}`, }} className={classes.buttonsContainer}>
                                  {richResponse.data.map((button, buttonIndex) => {
                                    return (
                                      <Button
                                        key={`message_${index}_richResponse_${richResponseIndex}_button_${buttonIndex}`}
                                        className={classes.buttonMessage}
                                        onClick={() => {
                                          window.open(unescapeText(button.linkURL), "_blank");
                                        }}
                                      >
                                        {unescapeText(button.label)}
                                      </Button>
                                    )
                                  })}
                                </div>
                              </Grid>
                            )
                          case 'cardsCarousel':
                            return (
                              <Grid key={`message_${index}_richResponse_${richResponseIndex}`}>
                                {richResponse.data.map((card, cardIndex) => {
                                  return (
                                    cardIndex === this.state.cardsCarouselActiveCard ?
                                      <Slide in={true} timeout={200} direction="left" key={`message_${index}_richResponse_${richResponseIndex}_card_${cardIndex}`}>
                                        <Card onClick={() => { window.open(unescapeText(card.linkURL), "_blank") }} className={classes.cardMessageContainer}>
                                          <CardActionArea>
                                            <CardMedia image={unescapeText(card.imageURL)}>
                                              <img className={classes.cardMessageImage} alt={unescapeText(card.title)} src={unescapeText(card.imageURL)} />
                                            </CardMedia>
                                            <CardContent>
                                              <Typography gutterBottom variant="h5" component="h2">
                                                {unescapeText(card.title)}
                                              </Typography>
                                              <Typography component="p">
                                                {unescapeText(card.description)}
                                              </Typography>
                                            </CardContent>
                                          </CardActionArea>
                                        </Card>
                                      </Slide> : null
                                  )
                                })}
                                {richResponse.data.length > 1 &&
                                  <Grid className={classes.cardMessageIndicatorContainer}>
                                    {richResponse.data.map((card, cardIndicatorIndex) => {
                                      return (
                                        <span key={`message_${index}_richResponse_${richResponseIndex}_cardIndicator_${cardIndicatorIndex}`} className={classes.cardMessageIndicator}><img onClick={() => { this.setState({ cardsCarouselActiveCard: cardIndicatorIndex }) }} key={`message_${index}_richResponse_${richResponseIndex}_cardIndicator_${cardIndicatorIndex}`} src={this.state.cardsCarouselActiveCard === cardIndicatorIndex ? circleEnabledIcon : circleDisabledIcon} /></span>
                                      )
                                    })
                                    }
                                  </Grid>
                                }
                              </Grid>
                            )
                          case 'collapsible':
                            return (
                              <List
                                key={`message_${index}_richResponse_${richResponseIndex}`}
                                component="nav"
                                className={classes.cardMessageContainer}
                                style={{
                                  border: `1px solid ${this.props.agent.uiColor}`,
                                  borderRadius: '5px'
                                }}
                                disablePadding
                              >
                                {richResponse.data.map((item, itemIndex) => {
                                  return (
                                    <React.Fragment key={`message_${index}_richResponse_${richResponseIndex}_item_${itemIndex}`}>
                                      <ListItem
                                        style={{
                                          borderBottom: (itemIndex + 1 === richResponse.data.length && this.state.collapsibleActiveItem !== itemIndex) ? null : `1px solid ${this.props.agent.uiColor}`
                                        }}
                                        button
                                        onClick={() => {
                                          const newActiveItem = this.state.collapsibleActiveItem === itemIndex ? -1 : itemIndex;
                                          this.setState({ collapsibleActiveItem: newActiveItem })
                                        }}
                                      >
                                        <ListItemText primary={unescapeText(item.title)} />
                                      </ListItem>
                                      <Collapse
                                        in={this.state.collapsibleActiveItem === itemIndex}
                                        timeout="auto"
                                        unmountOnExit
                                        style={{
                                          borderBottom: (itemIndex + 1 === richResponse.data.length && this.state.collapsibleActiveItem === itemIndex) ? null : `1px solid ${this.props.agent.uiColor}`
                                        }}
                                      >
                                        <Typography component='p' variant='body1' style={{ padding: '10px' }}>
                                          {unescapeText(item.content)}
                                        </Typography>
                                      </Collapse>
                                    </React.Fragment>
                                  )
                                })}
                              </List>
                            )
                          case 'image':
                            return (
                              <a key={`message_${index}_richResponse_${richResponseIndex}`} href={unescapeText(richResponse.data.imageURL)} target="_blank">
                                <img className={classes.imageMessage} src={unescapeText(richResponse.data.imageURL)} />
                              </a>
                            )
                          case 'quickResponses':
                            return (
                              <Grid key={`message_${index}_richResponse_${richResponseIndex}`} className={classes.agentButtonContainer}>
                                {richResponse.data.quickResponses.map((quickResponse, quickResponseIndex) => {
                                  return (
                                    <Button
                                      key={`message_${index}_richResponse_${richResponseIndex}_quickResponse_${quickResponseIndex}`}
                                      style={{
                                        border: `1px solid ${this.props.agent.uiColor}`,
                                        marginLeft: quickResponseIndex === 0 ? '0px' : '15px'
                                      }}
                                      className={classes.agentMessageButton}
                                      onClick={() => {
                                        this.props.onSendMessage({ message: unescapeText(quickResponse), isDemo: demoMode });
                                      }}
                                    >
                                      {unescapeText(quickResponse)}
                                    </Button>
                                  )
                                })}
                              </Grid>
                            )
                          case 'richText':
                            return (
                              <Grid
                                key={`message_${index}_richResponse_${richResponseIndex}`}
                                style={{
                                  border: `1px solid ${this.props.agent.uiColor}`,
                                }}
                                className={classes.agentMessage}
                              >
                                <div style={{ fontFamily: 'Montserrat' }} dangerouslySetInnerHTML={{ __html: unescapeText(richResponse.data.text) }} />
                              </Grid>
                            )
                          case 'video':
                            return (
                              <Player
                                key={`message_${index}_richResponse_${richResponseIndex}`}
                                playsInline
                                src={unescapeText(richResponse.data.video)}
                              />
                            )
                          default:
                            return null;
                        }
                      }) : null}
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
                        if (!sessions[this.props.agent.agentName] || sessions[this.props.agent.agentName].sessions.length === 0) {
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

                          this.props.onSendMessage({
                            message: evt.target.value,
                            sessionId: newSessionId,
                            newSession: true,
                            isDemo: demoMode
                          });
                          this.setState({
                            userMessage: '',
                          });
                        } else {
                          this.props.onShowWarning('selectSession');
                        }
                      }
                    } else {
                      this.props.onSendMessage({ message: evt.target.value, isDemo: demoMode });
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
                style={{
                  marginTop: '0px'
                }}
                InputProps={{
                  style: {
                    marginTop: '0px !important'
                  }
                }}
              />
            </Grid>
          </Grid>
          <CodeModal
            handleClose={() => {
              this.setState({ openCodeModal: false });
            }}
            CSO={this.state.CSO}
            open={this.state.openCodeModal}
          />
        </Grid>
      </Grid >
    );
  }
}

ConversationBar.propTypes = {
  loading: PropTypes.bool,
  classes: PropTypes.object,
  intl: intlShape.isRequired,
  notifications: PropTypes.array,
  CSO: PropTypes.object,
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
  testTrainNotification: makeSelectTestTrainNotification(),
  messages: makeSelectMessages(),
  waitingResponse: makeSelectWaitingResponse(),
  CSO: makeSelectCSO(),
  settings: makeSelectSettings(),
  sessionId: makeSelectSessionId(),
  sessionLoaded: makeSelectSessionLoaded(),
  connection: makeSelectConnection(),
  testTrain: makeSelectTrainTest(),
  testTrainLoading: makeSelectTestTrainLoading(),
  testTrainError: makeSelectTestTrainError(),
  dialoguePageFilterString: makeSelectDialoguePageFilterString()
});

function mapDispatchToProps(dispatch) {
  return {
    onResetSession: () => {
      dispatch(resetSession());
    },
    onCloseNotification: index => {
      dispatch(closeNotification(index));
    },
    onCloseTestTrainNotification: () => {
      dispatch(closeTestTrainNotification());
    },
    onSendMessage: ({ message, sessionId, newSession, isDemo }) => {
      dispatch(
        sendMessage({
          author: 'User',
          message,
          sessionId,
        }, newSession, isDemo),
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
    },
    onTestAgentTrain: (agentId) => {
      dispatch(testAgentTrain(agentId));
    },
    onLoadTestTrain: () => {
      dispatch(loadTestTrain());
    },
    onLoadTestTrainLoading: () => {
      dispatch(loadTestTrainLoading());
    },
    onLoadTestTrainError: () => {
      dispatch(loadTestTrainError());
    },
    onLoadSayings: (filter, page, pageSize, ignoreKeywords) => {
      dispatch(loadSayings(filter, page, pageSize, ignoreKeywords));
    },
    onChangeDialoguePageFilterActions: newValue => {
      dispatch(changeDialoguePageFilterActions(newValue));
    },
    onChangeDialoguePageNumberOfFiltersApplied: newValue => {
      dispatch(changeDialoguePageNumberOfFiltersApplied(newValue));
    },
    onChangeDialoguePageFilterString: newValue => {
      dispatch(changeDialoguePageFilterString(newValue));
    },
    onChangeDialoguePageFilterKeywords: newValue => {
      dispatch(changeDialoguePageFilterKeywords(newValue));
    },
    onChangeDialoguePageFilterKeywordIssues: () => {
      dispatch(changeDialoguePageFilterKeywordIssues())
    },
    onChangeDialoguePageFilterActionIssues: () => {
      dispatch(changeDialoguePageFilterActionIssues())
    },
    onResetDialoguePageFilter: () => {
      dispatch(resetDialoguePageFilters())
    },
    onChangeDialoguePageNumberOfFiltersApplied: newValue => {
      dispatch(changeDialoguePageNumberOfFiltersApplied(newValue))
    },
    onGoToUrl: url => {
      dispatch(push(url));
    },

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
