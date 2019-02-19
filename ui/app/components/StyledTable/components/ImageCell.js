import { TableCell } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

const styles = {
  icon: {
    '&:hover': {
      filter: 'invert(0)',
    },
    filter: 'invert(1)',
    cursor: 'pointer',
    position: 'relative',
    top: '4px',
    height: '15px'
  },
};

function ImageCell(props) {
  const {
    classes,
    image,
    onClick,
    disabled,
    tooltip,
    ...rest
  } = props;
  return (
    <TableCell {...rest}>
      <Tooltip title={tooltip} placement="top-start">
        <img
          alt="" onClick={() => {
          onClick && !disabled ? onClick() : _.noop;
        }} className={classes.icon} src={image}
        />
      </Tooltip>
    </TableCell>);
}

ImageCell.propTypes = {
  onClick: PropTypes.func,
  image: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  tooltip: PropTypes.string,
  disabled: PropTypes.bool,
};

export default withStyles(styles)(ImageCell);
