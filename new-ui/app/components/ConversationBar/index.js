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
import { makeSelectNotifications, makeSelectMessages } from '../../containers/App/selectors';
import { closeNotification } from '../../containers/App/actions';

const styles = {
    container: {
      height: '100%',
      width: '300px',
      position: 'fixed',
      zIndex: 1,
      top: 0,
      right: 0,
      backgroundColor: '#fff',
      overflowX: 'hidden',
      paddingTop: '20px',
      borderLeft: '1px solid #c5cbd8'
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
      zIndex: 2,
      backgroundColor: '#00c582',
      boxShadow: '0 1px 4px 1px #00bd6f'
    },
    arrow: {
      paddingTop: '10px',
      paddingLeft: '8px',
      height:'25px'
    },
    notificationsContainer: {
      marginTop: '0px',
    },
    notificationContainer: {
      backgroundColor: '#f6f7f8',
      border: '1px solid #4e4e4e',
      margin: '10px 20px 0px 20px',
      borderRadius: '3px',
      position: 'relative',
    },
    notification: {
      paddingLeft: '5px',
      fontSize: '12px',
      fontWeight: 300,
      width: '95%'
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
      width: 298
    },
    messagesContainer: {
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
      marginLeft: '60px'
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
      marginLeft: '25px',
      marginBottom: '16px',
    },
    agentName: {
      display: 'block',
      marginLeft: '25px',
      fontWeight: '300',
      fontSize: '10px',
      color: '#a2a7b1',
      marginBottom: '3px'
    },
    messageSource: {
      '&:hover': {
        textDecoration: 'underline'
      },
      cursor: 'pointer',
      fontSize: '10px',
      display: 'block',
      marginTop: '10px',
    },
    contentContainer: {
      position: 'fixed',
      top: '50px',
      bottom: '80px',
      overflowY: 'scroll',
    }
}

/* eslint-disable react/prefer-stateless-function */
export class ConversationBar extends React.PureComponent {

  state = {
    userMessage: '',
  }

  render() {
    const { classes, intl } = this.props;
    return (
      <Grid className={classes.container}>
        <Grid container className={classes.clearAll}>
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
              this.props.notifications.map((notification, index) => {
                return (
                  <Grid item xs={12} key={`notification_${index}`} className={classes.notificationContainer}>
                    <div className={classes.notificationDot}></div>
                    <Typography className={classes.notification}>
                      {notification}
                    </Typography>
                    <div onClick={() => { this.props.onCloseNotification(index) }} className={classes.closeNotification}>
                      <Typography>
                        x
                      </Typography>
                    </div>
                  </Grid>
                );
              })
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
              else{
                return (
                  <Grid key={`message_${index}`}>
                    <Typography className={classes.agentName}>
                      {message.author}
                    </Typography>
                    <Typography className={classes.agentMessage}>
                      {message.message}
                      <span onClick={() => {window.open(`${process.env.API_URL}\\doc\\${message.docId}`, "_blank")}} className={classes.messageSource}>
                        {'</> '}<span className={classes.messageSourceLink}>See Source</span>
                      </span>
                    </Typography>
                  </Grid>
                );
              }
            })
          }
          </Grid>
        </Grid>
        <Grid container className={classes.inputContainer}>
            <Grid item xs={12}>
              <TextField
                id='userMessage'
                value={this.state.userMessage}
                placeholder={intl.formatMessage(messages.userMessagePlaceholder)}
                onChange={(evt) => { this.setState({ userMessage: evt.target.value }) }}
                onKeyPress={(evt) => {
                  if(evt.key === 'Enter'){
                    evt.preventDefault();
                    this.props.onSendMessage(evt.target.value);
                    this.setState({
                        userMessage: '',
                    })
                  }
                }}
                margin='normal'
                fullWidth
              />
            </Grid>
          </Grid>
      </Grid>
    );
  }
}

ConversationBar.propTypes = {
  classes: PropTypes.object,
  intl: intlShape.isRequired,
  onToggleConversationBar: PropTypes.func,
  notifications: PropTypes.array,
}; 

const mapStateToProps = createStructuredSelector({
  notifications: makeSelectNotifications(),
  messages: makeSelectMessages(),
});

function mapDispatchToProps(dispatch) {
  return {
    onCloseNotification: (index) => {
      dispatch(closeNotification(index));
    },
    onSendMessage: (message) => {
      console.log('message: ', message);
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

//const withSaga = injectSaga({ key: 'keywordsEdit', saga });

const withDefinedStyles = withStyles(styles);

export default compose(
  withDefinedStyles,
  withConnect,
  injectIntl,
)(ConversationBar);