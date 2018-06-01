import React from 'react';
import { Row } from 'react-materialize';

export function Table(props) {

  let classes = 'table-container ';
  classes += (props.quotes ? 'quotes ' : '');
  classes += (props.disableSelection ? 'disable-selection ' : '')
  return (
    <div id={props.id} className={classes} style={props.tableStyle}>
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
  disableSelection: React.PropTypes.bool,
  style: React.PropTypes.object,
  tableStyle: React.PropTypes.object,
};

Table.defaultProps = {
  borderContainer: true
}

export default Table;
