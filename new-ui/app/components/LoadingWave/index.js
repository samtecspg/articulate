import React from 'react';
import PropTypes from 'prop-types';

import { Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  '@global': {
    '@keyframes wave': {
      '0%, 60%, 100%': {
        transform: 'initial',
      },
      '30%':{
        opacity: 0.15,
      },
    },
  },
  dot: {
    display: 'inline-block',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#4e4e4e',
    animation: 'wave 1.3s linear infinite',
  },
  dot1: {
    animationDelay: '-1.1s',
  },
  dot2: {
    animationDelay: '-0.9s',
  },
  agentName: {
    display: 'block',
    marginLeft: '15px',
    fontWeight: '300',
    fontSize: '10px',
    color: '#a2a7b1',
    marginBottom: '3px',
  },
  agentMessage: {
    width: '50px',
    paddingLeft: '8px',
    marginRight: '60px',
    marginLeft: '15px',
    marginBottom: '16px',
  },
};

export function LoadingWave(props) {

  const { classes } = props;
  return (
    <Grid>
      <Typography className={classes.agentName}>
        {props.agentName}
      </Typography>
      <Typography className={classes.agentMessage}>
        <span className={classes.dot}></span>&nbsp;
        <span className={`${classes.dot} ${classes.dot1}`}></span>&nbsp;
        <span className={`${classes.dot} ${classes.dot2}`}></span>
      </Typography>
    </Grid>
  );
}

LoadingWave.propTypes = {
  agentName: PropTypes.string,
};

export default withStyles(styles)(LoadingWave);
