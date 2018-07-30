import React from 'react';
import PropTypes from 'prop-types';
import { SwatchesPicker } from 'react-color';

import { withStyles } from '@material-ui/core/styles';
import { Grid }  from '@material-ui/core';

import expandSingleIcon from '../../images/expand-single-icon.svg';

const styles = {
    color: {
      borderRadius: '5px',
      height: '40px'
    },
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
      borderRadius: '10px'
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
    dot: {
      marginTop: 12,
      marginLeft: 5,
      height: 15,
      width: 15,
      borderRadius: '50%',
      display: 'inline-block',
    },
    expandArrow: {
      float:'right',
      marginTop: 15,
      marginRight: 5,
    }
};

function ColorPicker(props) { // eslint-disable-line react/prefer-stateless-function

    const { classes } = props;
    return (
        <Grid className={classes.swatchContainer}>
            <Grid className={ classes.swatch } onClick={ props.handleOpen }>
                <span style={{backgroundColor: props.color}} className={classes.dot}/>
                <img className={classes.expandArrow} src={expandSingleIcon} />
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
