import React, { PropTypes } from 'react';
import { Icon } from 'react-materialize';
import Tooltip from '../Tooltip';

function TableHeader(props) { // eslint-disable-line react/prefer-stateless-function

  return (
    <thead>
    <tr style={{ width: '100%' }}>
      {
        props.columns.map((column, index) => {
          return (
            <th key={'th_' + index} style={{ width: column.width, display: 'inline-block' }}>
              {column.icon ? column.icon : null}
              {column.label ? column.label : ''}
              {column.tooltip ? 
              <Tooltip
                tooltip={column.tooltip}
                delay={50}
                position="top"
              >
                <a>
                  <Icon>help_outline</Icon>
                </a>
              </Tooltip>
              : null}
            </th>
          );
        })
      }
    </tr>
    </thead>
  );
}

TableHeader.propTypes = {
  columns: PropTypes.array,
};

export default TableHeader;
