/**
 *
 * EntitiesTable
 *
 */

import React from 'react';

import ReactTable from 'react-table';

class IntentListTable extends React.Component { // eslint-disable-line react/prefer-stateless-function


  render() {
    const { data } = this.props;
    const intentColumns = [{
      id: 'name',
      label: 'Intent',
      tooltip: '',
      type: 'string',
      accessor: 'intentName',
      headerClassName: 'hide',
      cellClassName: 'text-align-left table2-column',
      minWidth: 1.75,
      sortable: false,

    }];
    return (
      <ReactTable
        data={data}
        columns={intentColumns}
        defaultPageSize={3}
        showPagination={false}
      />
    );
  }
}

IntentListTable.propTypes = {
  data: React.PropTypes.array,

};

export default IntentListTable;
