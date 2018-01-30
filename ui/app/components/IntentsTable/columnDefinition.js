import * as React from 'react';
import _ from 'lodash';

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
  type: 'list',
  accessor: row => _.map(row.examples, 'userSays'),
  filterable: true,
  headerClassName: 'table2-header',
  cellClassName: 'table2-column',
}];
