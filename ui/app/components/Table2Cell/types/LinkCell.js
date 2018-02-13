/**
 *
 * LinkCell
 *
 */

import React from 'react';
import { Link, } from 'react-router';

function LinkCell(props) {
  const {
    label,
    path,
    className,
    activeClassName
  } = props;
  return <Link to={path} activeClassName={activeClassName} className={className}>{label}</Link>;

}

LinkCell.propTypes = {
  label: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
    React.PropTypes.node,
  ]).isRequired,
  path: React.PropTypes.string.isRequired,
  className: React.PropTypes.string,
  activeClassName: React.PropTypes.string,
};

export default LinkCell;
