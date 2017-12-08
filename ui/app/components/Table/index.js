import React from 'react';

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
