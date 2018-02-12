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
      Header: 'Intents using it',
      tooltip: '',
      type: 'string',
      accessor: 'intentName',
      headerClassName: '',
      cellClassName: 'text-align-left table2-column',
      minWidth: 1.75,
      sortable: false,

    }];
    return (
      <ReactTable
        minRows={5}
        data={data}
        columns={intentColumns}
        showPagination={false}
      />
    );
  }
}

IntentListTable.propTypes = {
  data: React.PropTypes.array,

};

export default IntentListTable;
