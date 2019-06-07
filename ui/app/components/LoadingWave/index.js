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
      '30%': {
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
      {props.agentName}
      <Typography className={classes.agentMessage}>
        <span className={classes.dot} />
        &nbsp;
        <span className={`${classes.dot} ${classes.dot1}`} />
        &nbsp;
        <span className={`${classes.dot} ${classes.dot2}`} />
      </Typography>
    </Grid>
  );
}

LoadingWave.propTypes = {
  agentName: PropTypes.object,
};

export default withStyles(styles)(LoadingWave);
