import React from 'react';
import { Link } from 'react-router-dom';
import { intlShape, injectIntl } from 'react-intl';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid }  from '@material-ui/core';

import messages from './messages';

import settingsIcon from '../../images/settings-icon.svg';

const styles = {
  settings: {
    padding: 17,
    position: 'fixed',
    bottom: 0,
    left: 0
  }
};


/* eslint-disable react/prefer-stateless-function */
function AppContent(props) {
  const { classes, intl } = props;
  return (
    <Grid container>
      <Grid container item xs={12}>
        <Grid item xl={2} lg={2} md={2} sm={1} xs={1}/>
        <Grid item xl={8} lg={8} md={8} sm={10} xs={10}>
          { props.children }
        </Grid>
        <Grid item xl={2} lg={2} md={2} sm={1} xs={1}/>
      </Grid>
      <Grid className={classes.settings} item xs={12}>
        <Link id='settings' to='/settings'>
          <img src={settingsIcon} alt={intl.formatMessage(messages.settingsIconAlt)} />
        </Link>
      </Grid>
    </Grid>
  );
}

AppContent.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(withStyles(styles)(AppContent));