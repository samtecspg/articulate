import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';

import messages from './messages';

import logo from '../../images/logo.svg';
import agentsIcon from '../../images/agents-icon.svg';
import chatIcon from '../../images/chat-icon.svg';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Hidden, Button, Typography }  from '@material-ui/core';

import ConversationBar from '../ConversationBar';
import { compose } from 'redux';
import LanguageSelect from '../LanguageSelect';
import gravatars from '../Gravatar/';

const styles = {
  root: {
    flexGrow: 1,
    backgroundColor: '#fbfcfd',
  },
  header: {
    padding: 17,
  },
  logo: {
    height: 45,
  },
  flex: {
    flex: 1,
  },
  agentsButtonContainer: {
    textAlign: 'center',
  },
  openChat: {
    float: 'right',
    marginLeft: '15px'
  },
  icon: {
    paddingRight: '5px',
  },
  link:{
    textDecoration: 'none',
  },
  notificationDot: {
    backgroundColor: '#Cb2121',
    height: '12px',
    width: '12px',
    borderRadius: '50%',
    position: 'absolute',
    right: '138px',
    top: '13px',
    zIndex: 999,
  },
  languageSelectContainer: {
    position: 'absolute',
    right: '350px',
    top: '20px'
  },
  agentIcon: {
    marginRight: '5px',
    height: '20px',
    position: 'relative',
    top: '3px',
  },
  agentName: {
    position: 'relative',
    top: '8px',
    fontWeight: '500',
    fontSize: '16px'
  }
};

/* eslint-disable react/prefer-stateless-function */
export class AppHeader extends React.Component {

  componentDidMount() {
    this.interval = setInterval(() => {this.setState({ time: Date.now() })}, 5000); // update the component every 10 seconds
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render(){
    const { classes, intl, conversationBarOpen, notifications, agent } = this.props;

    let notificationDotColor = '#358fec';
    const validNotifications = notifications.filter((notification) => {
      if (notification.type === 'error'){
        notificationDotColor = '#cb2121';
        return true;
      }
      return ((new Date() - notification.datetime) / 1000) < 10 
    });

    return (
      conversationBarOpen ?
        <Grid container className={classes.header} item xs={12}>
          <Hidden only={['xs', 'sm']}>
            <Grid className={classes.languageSelectContainer}> 
              <LanguageSelect 
                key='selectLanguage'
                uiLanguage={this.props.uiLanguage} 
                uiLanguages={this.props.uiLanguages} 
                onChangeLanguage={this.props.onChangeLanguage} />
            </Grid>
            <ConversationBar
              uiLanguage={this.props.uiLanguage} 
              uiLanguages={this.props.uiLanguages} 
              onChangeLanguage={this.props.onChangeLanguage}
              onToggleConversationBar={this.props.onToggleConversationBar}
            />
            <Grid item xl={2} lg={2} md={2}>
              <Link to='/'>
                <img className={classes.logo} src={logo} alt={intl.formatMessage(messages.articulateLogoAlt)} />
              </Link>
            </Grid>
            <Grid item xl={2} lg={2} md={2}/>
            <Grid className={classes.agentsButtonContainer} item xl={2} lg={2} md={2}>
              {this.props.location.pathname.indexOf('connection') === -1 && this.props.location.pathname.indexOf('settings') === -1 && agent.gravatar !== '' && this.props.location.pathname !== '/' ? 
              <Typography className={classes.agentName} style={{color: agent.uiColor}}>
                {gravatars[agent.gravatar - 1]({ color: agent.uiColor, className: classes.agentIcon })}
                <span className={classes.agentName}>{agent.agentName}</span>
              </Typography> : null}
            </Grid>
          </Hidden>
          <Hidden only={['md', 'lg', 'xl']}>
            <Grid className={classes.languageSelectContainer}>  
              <LanguageSelect 
                key='selectLanguage'
                uiLanguage={this.props.uiLanguage} 
                uiLanguages={this.props.uiLanguages} 
                onChangeLanguage={this.props.onChangeLanguage} />
            </Grid>
            <ConversationBar
              uiLanguage={this.props.uiLanguage} 
              uiLanguages={this.props.uiLanguages} 
              onChangeLanguage={this.props.onChangeLanguage}
              onToggleConversationBar={this.props.onToggleConversationBar}
            />
            <Grid item sm={6} xs={6}>
              <Link to='/' className={classes.link}>
                <Button variant='contained'>
                  <img className={classes.icon} src={agentsIcon} alt={intl.formatMessage(messages.articulateLogoAlt)} />
                  <FormattedMessage {...messages.agentsButton} />
                </Button>
              </Link>
            </Grid>
            <Grid item sm={6} xs={6}>
              <Button onClick={() => {this.props.onToggleConversationBar(true)}} color='primary' variant='contained' className={classes.openChat}>
                <img className={classes.icon} src={chatIcon} alt={intl.formatMessage(messages.articulateLogoAlt)} />
                <FormattedMessage {...messages.openChatButton} />
              </Button>
            </Grid>
          </Hidden>
        </Grid>
        :
        <Grid container className={classes.header} item xs={12}>
          <Hidden only={['xs', 'sm']}>
            <Grid item xl={2} lg={2} md={2}>
              <Link to='/'>
                <img className={classes.logo} src={logo} alt={intl.formatMessage(messages.articulateLogoAlt)} />
              </Link>
            </Grid>
            <Grid item xl={3} lg={3} md={3}/>
            <Grid className={classes.agentsButtonContainer} item xl={2} lg={2} md={2}>
              {this.props.location.pathname.indexOf('connection') === -1 && this.props.location.pathname.indexOf('settings') === -1 && agent.gravatar !== '' && this.props.location.pathname !== '/' ? 
              <Typography className={classes.agentName} style={{color: agent.uiColor}}>
                {gravatars[agent.gravatar - 1]({ color: agent.uiColor, className: classes.agentIcon })}
                <span>{agent.agentName}</span>
              </Typography> : null}
            </Grid>
            <Grid item xl={3} lg={3} md={3}/>
            <Grid item xl={2} lg={2} md={2}>
              { this.props.location.pathname !== '/' ? 
                [
                  validNotifications.length > 0 ? <div key='conversationNotificationDot' className={classes.notificationDot} style={{ backgroundColor: notificationDotColor }}></div> : null,
                  <Button key='conversat_button' onClick={() => {this.props.onToggleConversationBar(true)}} color='primary' variant='contained' className={classes.openChat}>
                    <img className={classes.icon} src={chatIcon} alt={intl.formatMessage(messages.articulateLogoAlt)} />
                    <FormattedMessage {...messages.openChatButton} />
                  </Button>,
                  <LanguageSelect 
                    key='selectLanguage'
                    uiLanguage={this.props.uiLanguage} 
                    uiLanguages={this.props.uiLanguages} 
                    onChangeLanguage={this.props.onChangeLanguage} />
                ] : 
                <LanguageSelect 
                  key='selectLanguage'
                  uiLanguage={this.props.uiLanguage} 
                  uiLanguages={this.props.uiLanguages} 
                  onChangeLanguage={this.props.onChangeLanguage} />
              }
            </Grid>
          </Hidden>
          <Hidden only={['md', 'lg', 'xl']}>
            <Grid item sm={6} xs={6}>
              {this.props.location.pathname.indexOf('connection') === -1 && this.props.location.pathname.indexOf('settings') === -1 && agent.gravatar !== '' && this.props.location.pathname !== '/' ? 
              <Typography className={classes.agentName} style={{color: agent.uiColor}}>
                {gravatars[agent.gravatar - 1]({ color: agent.uiColor, className: classes.agentIcon })}
                <span className={classes.agentName}>{agent.agentName}</span>
              </Typography> : null}
            </Grid>
            <Grid item sm={6} xs={6}>
              { this.props.location.pathname !== '/' ? 
                [
                  validNotifications.length > 0 ? <div key='conversationNotificationDot' className={classes.notificationDot} style={{ backgroundColor: notificationDotColor }}></div> : null,
                  <Button
                    key='conversat_button'
                    onClick={() => {this.props.onToggleConversationBar(true)}}
                    color='primary'
                    variant='contained'
                    className={classes.openChat}
                  >
                    <img className={classes.icon} src={chatIcon} alt={intl.formatMessage(messages.articulateLogoAlt)} />
                    <FormattedMessage {...messages.openChatButton} />
                  </Button>,
                  <LanguageSelect 
                    key='selectLanguage'
                    uiLanguage={this.props.uiLanguage} 
                    uiLanguages={this.props.uiLanguages} 
                    onChangeLanguage={this.props.onChangeLanguage} />
                ] : 
                <LanguageSelect 
                  key='selectLanguage'
                  uiLanguage={this.props.uiLanguage} 
                  uiLanguages={this.props.uiLanguages} 
                  onChangeLanguage={this.props.onChangeLanguage} />
              }
            </Grid>
          </Hidden>
        </Grid>
    );
  }
}

AppHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  conversationBarOpen: PropTypes.bool,
  onToggleConversationBar: PropTypes.func,
  notifications: PropTypes.array,
  uiLanguages: PropTypes.array,
  uiLanguage: PropTypes.string,
  onChangeLanguage: PropTypes.func,
  agent: PropTypes.object,
};

const withDefinedStyles = withStyles(styles);

export default compose(
  withRouter,
  withDefinedStyles,
  injectIntl
)(AppHeader);