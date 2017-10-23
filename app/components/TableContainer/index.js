import React from 'react';
import { Row } from 'react-materialize';

export function Table(props) {
  
  return (
    <div id="examplesTable" className="table-container">
      <Row>
        <div className="col input-field s12 table-col">
          <div>
            <div className="border-container ">
              {React.Children.toArray(props.children)}
            </div>
          </div>
        </div>
      </Row>
    </div>
  );
}

Table.propTypes = {
  children: React.PropTypes.node,
};

export default Table;
