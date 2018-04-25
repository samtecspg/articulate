import * as React from 'react';

export default [{
  id: 'name',
  label: 'Domains',
  tooltip: '',
  type: 'link',
  accessor: row => {
    return { label: row.domainName, path: `/intents?domainId=${row.id}`, columnName: 'domainName' };
  },
  headerClassName: 'text-align-left table2-header',
  cellClassName: 'text-align-left table2-column',
  filterable: true,
  minWidth: 1,
}, {
  label: 'Enabled',
  tooltip: '',
  type: 'checkbox',
  accessor: 'enabled',
  headerClassName: 'table2-header',
  cellClassName: 'table2-column',
}, {
  label: 'Intent Threshold',
  tooltip: '',
  type: 'number',
  accessor: 'intentThreshold',
  headerClassName: 'table2-header',
  cellClassName: 'table2-column',
}];
