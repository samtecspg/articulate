import React from 'react';

import PropTypes from 'prop-types';
import { Grid, Typography } from '@material-ui/core';
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
};

/* eslint-disable react/prefer-stateless-function */
export class Notifications extends React.Component {

  componentDidMount() {
    this.interval = setInterval(() => {this.setState({ time: Date.now() })}, 5000); // update the component every 10 seconds
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { classes, intl } = this.props;
    return (
        <Grid className={classes.notificationsContainer} container spacing={16}>
          {
            this.props.notifications.map(
              (notification, index) => {  
                const messageText = intl.formatMessage(messages[notification.template], notification);
                return (
                  notification.type === 'error' || ((new Date() - notification.datetime) / 1000) < 10 ?
                  <Grid item xs={12} key={`notification_${index}`} className={notification.type === 'error' ? classes.notificationContainerError : classes.notificationContainer}>
                    <div className={classes.notificationDot} style={{ backgroundColor: notification.type === 'error' ? '#cb2121' : '#358fec' }}></div>
                    <Typography className={classes.notification}>
                      <span dangerouslySetInnerHTML={{__html: `${notification.type === 'error' ? intl.formatMessage(messages.errorTitle) : intl.formatMessage(messages.notificationTitle)}: ${messageText}`}}></span>
                    </Typography>
                    <div onClick={() => { this.props.onCloseNotification(index) }} className={classes.closeNotification}>
                      <Typography>
                          x
                      </Typography>
                    </div>
                  </Grid> : 
                  null
                )
              }
            )
          }
        </Grid>
    );
  }
}

Notifications.propTypes = {
  intl: intlShape,
  classes: PropTypes.object.isRequired,
  onCloseNotification: PropTypes.func,
  notifications: PropTypes.array,
};

export default injectIntl(withStyles(styles)(Notifications));
