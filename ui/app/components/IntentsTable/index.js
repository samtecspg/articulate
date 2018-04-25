/**
 *
 * IntentsTable
 *
 */

import React from 'react';
import Table2 from '../Table2';
import columns from './columnDefinition';
import Immutable from 'seamless-immutable';

class IntentsTable extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { data, onCellChange, menu } = this.props;
    let formattedData = Immutable.asMutable(data, { deep: true });
    return (
      <Table2
        columns={columns}
        data={formattedData}
        onCellChange={onCellChange}
        menu={menu}
        tableName={'Intents'}
        defaultSortMethod={(a, b, desc) => {
          a = (a === null || a === undefined) ? -Infinity : a.label
          b = (b === null || b === undefined) ? -Infinity : b.label
          // force any string values to lowercase
          a = a === 'string' ? a.toLowerCase() : a
          b = b === 'string' ? b.toLowerCase() : b
          // Return either 1 or -1 to indicate a sort priority
          if (a > b) {
            return 1
          }
          if (a < b) {
            return -1
          }
          // returning 0, undefined or any falsey value will use subsequent sorts or the index as a tiebreaker
          return 0
        }}
      />
    );
  }
}

IntentsTable.propTypes = {
  data: React.PropTypes.array,
  menu: React.PropTypes.array,
  onCellChange: React.PropTypes.func,
};

export default IntentsTable;
