import * as React from 'react';

export default [{
  id: 'name',
  label: 'Intent',
  tooltip: '',
  type: 'string',
  accessor: 'intentName',
  filterable: true,
  headerClassName: 'text-align-left table2-header',
  cellClassName: 'text-align-left table2-column',
  minWidth: 1.75,

}, {
  label: 'Examples',
  id: 'examples',
  tooltip: '',
  type: 'number',
  accessor: row => row.examples.length,
  pivot: true,
  filterable: true,
  headerClassName: 'table2-header',
  cellClassName: 'text-align-center table2-column',
}];
