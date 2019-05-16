import React from 'react';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, Hidden }  from '@material-ui/core';

const styles = {
  container: {
    display: 'inline',
    paddingTop: 50,
    paddingLeft: 25,
  },
  titleContainer: {
    display: 'inline',
    position: 'relative',
    top: '5px',
  },
  title: {
    color: '#4e4e4e',
    display: 'inline',
  },
  subtitle: {
    paddingLeft: '5px',
    color: '#4e4e4e',
    fontWeight: 'bold',
    display: 'inline',
  },
  backArrow: {
    cursor: 'pointer',
    left: -15,
    fontSize: '14px',
    fontFamily: 'Montserrat',
    fontWeight: 400,
    position: 'relative',
  },
  backButton: {
    cursor: 'pointer',
    left: -15,
    fontSize: '14px',
    fontFamily: 'Montserrat',
    fontWeight: 400,
    position: 'relative',
    textDecoration: 'underline',
  },
};

/* eslint-disable react/prefer-stateless-function */
export class ContentHeader extends React.Component {
  render(){
    const { classes } = this.props;
    return (
      <Grid className={classes.container} item xs={12}>
        <Grid className={classes.titleContainer}>
          {this.props.title ?
            <Typography className={classes.title}>
              <FormattedMessage {...this.props.title} />:&nbsp;
            </Typography> :
            null
          }
          {this.props.subtitle ?
            <Typography className={classes.subtitle}>
              {
                typeof this.props.subtitle === 'string' ?
                  this.props.subtitle :
                  <FormattedMessage {...this.props.subtitle} />
              }
            </Typography> :
            null
          }
        </Grid>
        <Hidden only={this.props.sizesForHideInlineElement}>
          {this.props.inlineElement ? this.props.inlineElement : null}
        </Hidden>
      </Grid>
    )
  }
}

ContentHeader.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]).isRequired,
  subtitle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]).isRequired,
  inlineElement: PropTypes.node,
  classes: PropTypes.object.isRequired,
  sizesForHideInlineElement: PropTypes.array,
  goBack: PropTypes.func,
};

ContentHeader.defaultProps = {
  sizesForHideInlineElement: [],
};

export default withRouter(withStyles(styles)(ContentHeader));
