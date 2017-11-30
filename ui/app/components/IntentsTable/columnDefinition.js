export default [{
  label: 'Intent',
  tooltip: 'String Tooltip',
  type: 'string',
  accessor: 'name',
  filterable: true,
  headerClassName: 'text-align-left table2-header',
  cellClassName: 'text-align-left table2-column',
  minWidth: 1.75,

}, {
  label: 'Examples',
  tooltip: 'Number Tooltip',
  type: 'number',
  accessor: 'examples',
  headerClassName: 'table2-header',
  cellClassName: 'table2-column',
}, {
  label: 'T-Score',
  tooltip: 'String2 Tooltip',
  type: 'number',
  accessor: 'tScore',
  headerClassName: 'table2-header',
  cellClassName: 'table2-column',

}, {
  label: 'U-Score',
  tooltip: 'String2 Tooltip',
  type: 'number',
  accessor: 'uScore',
  headerClassName: 'table2-header',
  cellClassName: 'table2-column',
}, {
  label: 'Scenario',
  type: 'checkbox',
  accessor: 'scenario',
  headerClassName: 'table2-header',
  cellClassName: 'table2-column',
}, {
  label: 'Description',
  type: 'string',
  accessor: 'description',
  filterable: true,
  sortable: false,
  headerClassName: 'table2-header',
  cellClassName: 'table2-column table2-ellipsis',
}, {
  label: 'Progress',
  tooltip: 'Progress Tooltip',
  type: 'progress',
  accessor: 'progress',
  headerClassName: 'table2-header',
  cellClassName: 'table2-column',
}];
