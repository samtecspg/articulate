import { TableRow } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

// import PropTypes from 'prop-types';
const styles = {
  root: {},
};

function StyledRow(props) {
  const {
    classes,
    children,
    ...rest
  } = props;
  return <TableRow {...rest}>
    {children}
  </TableRow>;
}

StyledRow.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StyledRow);
