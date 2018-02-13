/**
 *
 * EntitiesTable
 *
 */

import React from 'react';
import Table2 from '../../Table2';
import columns from './columnDefinition';

class IntentListTable extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { data } = this.props;
    return (
      <Table2
        minRows={5}
        tableName={'Intents'}
        data={data}
        columns={columns}
        showSearchInput={false}
      />
    );
  }
}

IntentListTable.propTypes = {
  data: React.PropTypes.array,

};

export default IntentListTable;
