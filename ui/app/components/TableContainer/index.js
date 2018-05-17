import React from 'react';
import { Row } from 'react-materialize';

export function Table(props) {

  return (
    <div id={props.id} className={(props.quotes ? 'quotes ' : '') + 'table-container'} style={props.tableStyle}>
      <Row>
        <div className="col input-field s12 table-col">
          <div>
            <div className={props.borderContainer ? 'border-container ' : ''} style={props.style}>
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
  id: React.PropTypes.string,
  quotes: React.PropTypes.bool,
  style: React.PropTypes.object,
  tableStyle: React.PropTypes.object,
};

Table.defaultProps = {
  borderContainer: true
}

export default Table;
