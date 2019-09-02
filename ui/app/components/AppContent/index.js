import React from 'react';
import { Link } from 'react-router-dom';
import { intlShape, injectIntl } from 'react-intl';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';

import messages from './messages';

import settingsIcon from '../../images/settings-icon.svg';
import userListIcon from '../../images/user-list-icon.svg';

const styles = {
  settings: {
    padding: 17,
    position: 'fixed',
    bottom: 0,
    left: 0,
  },
};

/* eslint-disable react/prefer-stateless-function */
export class AppContent extends React.Component {
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
            <Link id="settings" to="/settings">
              <img
                src={settingsIcon}
                alt={intl.formatMessage(messages.settingsIconAlt)}
              />
            </Link>
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
                  paddingBottom: '10px'
                }}
                src={userListIcon}
                alt={intl.formatMessage(messages.usersIconAlt)}
              />
            </Link>
            <Link id="settings" to="/settings">
              <img
                src={settingsIcon}
                alt={intl.formatMessage(messages.settingsIconAlt)}
              />
            </Link>
          </Grid>
        }
      </Grid>
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

export default injectIntl(withStyles(styles)(AppContent));
