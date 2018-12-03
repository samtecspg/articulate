import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import imgMissingAPI from '../../images/missing-api.svg';
import messages from './messages';

const styles = {
  mainContainer: {
    marginTop: '60px'
  },
  image: {
    width: '300px',
    height: '300px',
    display: 'block',
    margin: 'auto',
    width: '50%'
  },
  needHelpLink: {
    cursor: 'pointer',
    left: -15,
    fontSize: '14px',
    fontFamily: 'Montserrat',
    fontWeight: 400,
    position: 'relative',
  }
}

class MissingAPIPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { classes } = this.props;
    return (
      <Grid className={classes.mainContainer} container justify='center' spacing={8}>
        <Grid item xs={12}>
          <Typography align='center'>
            <FormattedMessage {...messages.missingAPITitle} />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <img className={classes.image} src={imgMissingAPI} alt="" />
        </Grid>
        <Grid item xs={6}>
          <Typography align='center'>
            <FormattedMessage {...messages.missingAPIParagraph} />
          </Typography>
        </Grid>
        <Grid item xs={12}>
        </Grid>
        <Grid item xs={12}>
            <a className={classes.needHelpLink} target="_blank" href='https://samtecspg.github.io/articulate/'>
              <Typography align='center'>
                <FormattedMessage {...messages.needHelp} />
              </Typography>
            </a>
        </Grid>
      </Grid>
    );
  }
}

MissingAPIPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MissingAPIPage);