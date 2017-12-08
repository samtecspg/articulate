import React from 'react';

export function Row(props) {

  return (
    <div className="row">
      {React.Children.toArray(props.children)}
    </div>
  );
}

Row.propTypes = {
  children: React.PropTypes.node,
};

export default Row;
