import React from 'react';
import { Row } from 'react-materialize';

export function TableContainer(props) {
  
  return (
    <table className="bordered highlight">
        {React.Children.toArray(props.children)}
    </table>
  );
}

TableContainer.propTypes = {
  children: React.PropTypes.node,
};

export default TableContainer;
