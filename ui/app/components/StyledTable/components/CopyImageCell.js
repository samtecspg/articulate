import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import icon from '../../../images/icon-copy.svg';
import ImageCell from './ImageCell';

const styles = {
  cell: {
    width: '20px',
  },
};

function CopyImageCell(props) {
  const {
    classes,
    onClick,
    ...rest
  } = props;
  return <ImageCell
    className={classes.cell}
    image={icon}
    onClick={onClick}
    {...rest}
  />;
}

CopyImageCell.propTypes = {
  onClick: PropTypes.func,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CopyImageCell);
