import React from 'react';
import PropTypes from 'prop-types';
import { SwatchesPicker } from 'react-color';

import { withStyles } from '@material-ui/core/styles';
import { Grid }  from '@material-ui/core';

const styles = {
  swatchContainer: {
    height: '52px',
    padding: '0',
    border: '1px solid #a2a7b1',
    borderRadius: '5px',
  },
  swatch: {
    padding: '5px',
    background: '#fff',
    display: 'inline-block',
    cursor: 'pointer',
    width: '100%',
    borderRadius: '10px',
  },
  popover: {
    background: '#FFFFFF',
    position: 'absolute',
    zIndex: '999',
  },
  cover: {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  },
  color: {
    borderRadius: '3px',
    width: '100%',
    height: '2.4rem',
  },
  expandArrow: {
    float:'right',
    marginTop: 15,
    marginRight: 5,
  },
};

function ColorPicker(props) { // eslint-disable-line react/prefer-stateless-function

  const { classes } = props;
  return (
    <Grid className={classes.swatchContainer}>
      <Grid className={ classes.swatch } onClick={ props.handleOpen }>
        <div style={{background: props.color }} className={ classes.color } />
      </Grid>
      {
        props.displayColorPicker ?
          <Grid className={ classes.popover }>
            <Grid className={ classes.cover } onClick={ props.handleClose }/>
            <SwatchesPicker color={ props.color } onChange={ props.handleColorChange } />
          </Grid>
          :
          null
      }
    </Grid>
  );
}

ColorPicker.propTypes = {
  classes: PropTypes.object.isRequired,
  handleClose: PropTypes.func,
  handleOpen: PropTypes.func,
  handleColorChange: PropTypes.func,
  color: PropTypes.string,
  displayColorPicker: PropTypes.bool,
};

export default withStyles(styles)(ColorPicker);
