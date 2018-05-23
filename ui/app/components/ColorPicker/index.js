import React, { PropTypes } from 'react';
import { SwatchesPicker } from 'react-color';

function ColorPicker(props) { // eslint-disable-line react/prefer-stateless-function

  const styles = {
    color: {
      borderRadius: '3px',
      background: props.color,
      width: '100%',
      height: '2.2rem'
    },
    swatch_container: {
      padding: '0',
      height: '3.1rem',
      border: '1px solid #c5cbd8',
      borderRadius: '3px',
    },
    swatch: {
      padding: '5px',
      background: '#fff',
      display: 'inline-block',
      cursor: 'pointer',
      width: '100%',
    },
    popover: {
      background: '#FFFFFF',
      // border: '1px solid #c5cbd8',
      // borderRadius: '3px',
      marginTop: '5px',
      position: 'absolute',
      right: '-10px',
      zIndex: '999',
    },
    cover: {
      position: 'fixed',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
    },
  };

  return (
    <div className={`col s${props.s}`} style={ styles.swatch_container}>
      <div style={ styles.swatch } onClick={ props.handleClick }>
        <div style={ styles.color } />
      </div>
      { props.displayColorPicker ? <div style={ styles.popover }>
        <div style={ styles.cover } onClick={ props.handleClose }/>
        <SwatchesPicker color={ props.color } onChange={ props.handleColorChange } />
      </div> : null }
    </div>
  );
}

ColorPicker.propTypes = {
  handleClose: React.PropTypes.func,
  handleClick: React.PropTypes.func,
  handleColorChange: React.PropTypes.func,
  color: React.PropTypes.string,
  displayColorPicker: React.PropTypes.bool,
};

ColorPicker.defaultProps = {
  s: 1,
};

export default ColorPicker;
