/*
 * ConversationBar
 *
 *
 */

import React from 'react';

import PropTypes from 'prop-types';
import { compose } from 'redux';
import { injectIntl, intlShape } from 'react-intl';

import { Grid, Typography, TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import rightArrowIcon from '../../images/right-arrow-icon.svg';

import messages from './messages';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { makeSelectNotifications, makeSelectMessages, makeSelectAgent, makeSelectWaitingResponse, makeSelectDoc } from '../../containers/App/selectors';
import { closeNotification, sendMessage, resetSession, loadDoc } from '../../containers/App/actions';

import LoadingWave from '../LoadingWave';
import CodeModal from '../CodeModal';

const styles = {
  container: {
    height: '100%',
    width: '300px',
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
    width: '85px',
    position: 'fixed',
    top: '0px',
    right: '107px',
    backgroundColor: '#f6f7f8',
  },
  clearAllLabel: {
    paddingTop: '5px',
    paddingLeft: '16px',
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
    right: '300px',
    top: '20px',
    zIndex: 2,
    backgroundColor: '#00c582',
    boxShadow: '0 1px 4px 1px #00bd6f',
  },
  arrow: {
    paddingTop: '10px',
    paddingLeft: '8px',
    height:'25px',
  },
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
  notification: {
    paddingLeft: '5px',
    fontSize: '12px',
    fontWeight: 300,
    width: '95%',
  },
  notificationDot: {
    backgroundColor: '#Cb2121',
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
  inputContainer: {
    padding: '10px',
    position: 'fixed',
    bottom: 0,
    right: 0,
    width: 298,
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
    color: '#4e4e4e',
    backgroundColor: '#dbe0e9',
    borderRadius: '3px',
    padding: '8px',
    marginRight: '60px',
    marginLeft: '15px',
    marginBottom: '16px',
  },
  agentName: {
    display: 'block',
    marginLeft: '15px',
    fontWeight: '300',
    fontSize: '10px',
    color: '#a2a7b1',
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
    width: '317px',
    position: 'fixed',
    top: '50px',
    bottom: '95px',
    overflowY: 'scroll',
    overflowX: 'hidden',
  },
};

/* eslint-disable react/prefer-stateless-function */
export class ConversationBar extends React.PureComponent {

  state = {
    userMessage: '',
    repeatPreviousMessage: null,
    openCodeModal: false,
  };

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView(true);
  };

  render() {
    const { classes, intl } = this.props;
    return (
      <Grid className={classes.container}>
        <Grid onClick={() => this.props.onResetSession()} container className={classes.clearAll}>
          <Typography className={classes.clearAllLabel}>
            Clear All
          </Typography>
        </Grid>
        <Grid container onClick={() => { this.props.onToggleConversationBar(false) }} className={classes.toggle}>
          <img className={classes.arrow} src={rightArrowIcon}></img>
        </Grid>
        <Grid className={classes.contentContainer}>
          <Grid className={classes.notificationsContainer} container spacing={16}>
            {
              this.props.notifications.map((notification, index) => (
                <Grid item xs={12} key={`notification_${index}`} className={classes.notificationContainer}>
                  <div className={classes.notificationDot}></div>
                  <Typography className={classes.notification}>
                    <span dangerouslySetInnerHTML={{__html: notification}}></span>
                  </Typography>
                  <div onClick={() => { this.props.onCloseNotification(index) }} className={classes.closeNotification}>
                    <Typography>
                        x
                    </Typography>
                  </div>
                </Grid>
              ))
            }
          </Grid>
          <Grid className={classes.messagesContainer}>
            {
              this.props.messages.map((message, index) => {
                if (message.author === 'User'){
                  return (
                    <Grid key={`message_${index}`} item className={classes.userMessageContainer}>
                      <Typography className={classes.userMessage}>
                        {message.message}
                      </Typography>
                    </Grid>
                  );
                }

                return (
                  <Grid key={`message_${index}`}>
                    <Typography className={classes.agentName}>
                      {message.author}
                    </Typography>
                    <Typography className={classes.agentMessage}>
                      {message.message}
                      {message.docId !== null ?
                        <span onClick={() => { this.props.onLoadDoc(message.docId); this.setState({openCodeModal: true})}} className={classes.messageSource}>
                          {'</> '}<span className={classes.messageSourceLink}>See Source</span>
                        </span>
                        : null}
                    </Typography>
                  </Grid>
                );

              })
            }
            {
              this.props.waitingResponse ?
                <LoadingWave agentName={this.props.agent.agentName} /> :
                null
            }
            <div
              style={{ float: 'left', clear: 'both' }}
              ref={(el) => {
                this.messagesEnd = el;
              }}
            >
            </div>
          </Grid>
        </Grid>
        <Grid container className={classes.inputContainer}>
          <Grid item xs={12}>
            <TextField
              id='userMessage'
              value={this.state.userMessage}
              placeholder={intl.formatMessage(messages.userMessagePlaceholder)}
              onChange={(evt) => { this.setState({ userMessage: evt.target.value }) }}
              onKeyDown={(evt) => {
                if(evt.key === 'Enter' && evt.target.value !== ''){
                  evt.preventDefault();
                  this.props.onSendMessage(evt.target.value);
                  this.setState({
                    userMessage: '',
                  })
                }
                if (evt.key === 'ArrowUp') {
                  if (this.props.messages.length > 0) {
                    const messages = this.props.messages;
                    let len = this.state.repeatPreviousMessage || messages.length;
                    let message = null;

                    while (len-- && !message) {
                      if (messages[len].author === "User") {
                        this.state.repeatPreviousMessage = len;
                        message = messages[len].message;
                      }
                    }

                    evt.target.value = message;
                  }
                }
              }}
              margin='normal'
              fullWidth
            />
          </Grid>
        </Grid>
        <CodeModal handleClose={() => { this.setState({ openCodeModal: false }) }} doc={this.props.doc} open={this.state.openCodeModal} />
      </Grid>
    );
  }
}

ConversationBar.propTypes = {
  classes: PropTypes.object,
  intl: intlShape.isRequired,
  notifications: PropTypes.array,
  doc: PropTypes.object,
  onResetSession: PropTypes.func,
  onCloseNotification: PropTypes.func,
  onSendMessage: PropTypes.func,
  onLoadDoc: PropTypes.func,
}; 

const mapStateToProps = createStructuredSelector({
  agent: makeSelectAgent(),
  notifications: makeSelectNotifications(),
  messages: makeSelectMessages(),
  waitingResponse: makeSelectWaitingResponse(),
  doc: makeSelectDoc(),
});

function mapDispatchToProps(dispatch) {
  return {
    onResetSession: () => {
      dispatch(resetSession());
    },
    onCloseNotification: (index) => {
      dispatch(closeNotification(index));
    },
    onSendMessage: (message) => {
      dispatch(sendMessage({
        author: 'User',
        message,
      }));
    },
    onLoadDoc: (docId) => {
      dispatch(loadDoc(docId));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

// const withSaga = injectSaga({ key: 'keywordsEdit', saga });

const withDefinedStyles = withStyles(styles);

export default compose(
  withDefinedStyles,
  withConnect,
  injectIntl,
)(ConversationBar);
