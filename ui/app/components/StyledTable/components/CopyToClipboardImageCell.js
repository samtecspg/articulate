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

function CopyToClipboardImageCell(props) {
  const copyToClipboard = ({ text }) => {
    const textField = document.createElement('textarea');
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
  };
  const {
    classes,
    text,
    ...rest
  } = props;
  return <ImageCell
    {...rest}
    className={classes.cell}
    image={icon}
    onClick={() => copyToClipboard({ text })}
  />;
}

CopyToClipboardImageCell.propTypes = {
  text: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { name: 'CopyToClipboardImageCell' })(CopyToClipboardImageCell);
