import React from 'react';
import { Link } from 'react-router-dom';
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

const styles = {
  root: {
    flexGrow: 1,
    backgroundColor: '#fbfcfd'
  },
  header: {
    padding: 17
  },
  logo: {
    height: 45
  },
  flex: {
    flex: 1,
  },
  agentsButtonContainer: {
    textAlign: 'center'
  },
  openChat: {
    float: 'right'
  },
  icon: {
    paddingRight: '5px'
  },
  link:{
    textDecoration: 'none'
  }
};

/* eslint-disable react/prefer-stateless-function */
export class AppHeader extends React.Component {

  render(){
    const { classes, intl, conversationBarOpen } = this.props;
    return (
      conversationBarOpen ?
      <Grid container className={classes.header} item xs={12}>
        <Hidden only={['xs', 'sm']}>
          <ConversationBar
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
            <Button onClick={() => {this.props.onToggleConversationBar(true)}} color='primary' variant='contained' className={classes.openChat}>
              <img className={classes.icon} src={chatIcon} alt={intl.formatMessage(messages.articulateLogoAlt)} />
              <FormattedMessage {...messages.openChatButton} />
            </Button>
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
            <Button onClick={() => {this.props.onToggleConversationBar(true)}} color='primary' variant='contained' className={classes.openChat}>
              <img className={classes.icon} src={chatIcon} alt={intl.formatMessage(messages.articulateLogoAlt)} />
              <FormattedMessage {...messages.openChatButton} />
            </Button>
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
};

const withDefinedStyles = withStyles(styles);

export default compose(
  withDefinedStyles,
  injectIntl
)(AppHeader);