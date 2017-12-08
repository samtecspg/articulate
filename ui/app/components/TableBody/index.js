import React from 'react';

export function TableBody(props) {

  return (
    <tbody>
    {React.Children.toArray(props.children)}
    </tbody>
  );
}

TableBody.propTypes = {
  children: React.PropTypes.node,
};

export default TableBody;
