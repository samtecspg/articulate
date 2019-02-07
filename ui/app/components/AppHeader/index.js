import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';

import messages from './messages';

import logo from '../../images/logo.svg';
import agentsIcon from '../../images/agents-icon.svg';
import chatIcon from '../../images/chat-icon.svg';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Hidden, Button }  from '@material-ui/core';

import ConversationBar from '../ConversationBar';
import { compose } from 'redux';
import LanguageSelect from '../LanguageSelect';

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
};

/* eslint-disable react/prefer-stateless-function */
export class AppHeader extends React.Component {

  render(){
    const { classes, intl, conversationBarOpen, notifications } = this.props;
    return (
      conversationBarOpen ?
        <Grid container className={classes.header} item xs={12}>
          <Hidden only={['xs', 'sm']}>
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
              <Link to='/' className={classes.link}>
                <Button variant='contained'>
                  <img className={classes.icon} src={agentsIcon} alt={intl.formatMessage(messages.articulateLogoAlt)} />
                  <FormattedMessage {...messages.agentsButton} />
                </Button>
              </Link>
            </Grid>
          </Hidden>
          <Hidden only={['md', 'lg', 'xl']}>
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
              <Link to='/' className={classes.link}>
                <Button variant='contained'>
                  <img className={classes.icon} src={agentsIcon} alt={intl.formatMessage(messages.articulateLogoAlt)} />
                  <FormattedMessage {...messages.agentsButton} />
                </Button>
              </Link>
            </Grid>
            <Grid item xl={3} lg={3} md={3}/>
            <Grid item xl={2} lg={2} md={2}>
              { this.props.location.pathname !== '/' ? 
                [
                  notifications.length > 0 ? <div key='conversationNotificationDot' className={classes.notificationDot}></div> : null,
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
              <Link to='/' className={classes.link}>
                <Button variant='contained'>
                  <img className={classes.icon} src={agentsIcon} alt={intl.formatMessage(messages.articulateLogoAlt)} />
                  <FormattedMessage {...messages.agentsButton} />
                </Button>
              </Link>
            </Grid>
            <Grid item sm={6} xs={6}>
              { this.props.location.pathname !== '/' ? 
                [
                  notifications.length > 0 ? <div key='conversationNotificationDot' className={classes.notificationDot}></div> : null,
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
};

const withDefinedStyles = withStyles(styles);

export default compose(
  withRouter,
  withDefinedStyles,
  injectIntl
)(AppHeader);