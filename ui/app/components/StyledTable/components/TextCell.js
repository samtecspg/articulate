import { TableCell } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

const styles = {};

function TextCell(props) {
  const {
    children,
    ...rest
  } = props;
  return <TableCell {...rest}>
    {children}
  </TableCell>;
}

TextCell.propTypes = {
  children: PropTypes.element.isRequired,
};

TextCell.defaultProps = {};

export default withStyles(styles)(TextCell);
