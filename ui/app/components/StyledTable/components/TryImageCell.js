import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import trashIcon from '../../../images/trash-icon.svg';
import ImageCell from './ImageCell';

const styles = {
  cell: {
    width: '20px',
  },
};

function TryImageCell(props) {
  const { classes, onClick, ...rest } = props;
  return (
    <ImageCell
      className={classes.cell}
      image={trashIcon}
      onClick={onClick}
      {...rest}
    />
  );
}

TryImageCell.propTypes = {
  onClick: PropTypes.func,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TryImageCell);
