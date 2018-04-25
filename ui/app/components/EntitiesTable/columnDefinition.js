export default [{
  id: 'name',
  label: 'Entity',
  tooltip: '',
  type: 'link',
  accessor: row => {
    return { label: row.entityName, path: `/entity/${row.id}/edit`, columnName: 'entityName' };
  },
  filterable: true,
  headerClassName: 'text-align-left table2-header',
  cellClassName: 'text-align-left table2-column',
  minWidth: 1,
}, {
  label: 'Color',
  tooltip: '',
  type: 'color',
  accessor: 'uiColor',
  headerClassName: 'table2-header',
  cellClassName: 'table2-column center-align',
}];