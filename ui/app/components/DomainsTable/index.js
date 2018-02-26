/**
 *
 * DomainsTable
 *
 */

import React from 'react';
import Table2 from '../../components/Table2';
import columns from './columnDefinition';

class DomainsTable extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { data, onCellChange, menu } = this.props;
    const formattedData = data.map((domain) => {
      return domain.updateIn(['intentThreshold'], intentThreshold => intentThreshold * 100);
    });
    return (
      <Table2
        columns={columns}
        data={formattedData}
        onCellChange={onCellChange}
        menu={menu}
        tableName={'Domains'}
      />
    );
  }
}

DomainsTable.propTypes = {
  data: React.PropTypes.array,
  menu: React.PropTypes.array,
  onCellChange: React.PropTypes.func,
};

export default DomainsTable;
