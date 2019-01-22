import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import TextCell from './TextCell';

const styles = {};
const formatter = new Intl.NumberFormat(this, { style: 'percent', maximumFractionDigits: 2 });

function PercentCell(props) {
  const {
    value,
    ...rest
  } = props;
  return <TextCell {...rest}>
    <span>{_.isNil(value) ? 'N/A' : formatter.format(value)}</span>
  </TextCell>;
}

PercentCell.propTypes = {
  value: PropTypes.number,
};

PercentCell.defaultProps = {};

export default withStyles(styles)(PercentCell);
