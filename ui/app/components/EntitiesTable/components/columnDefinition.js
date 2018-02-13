export default [{
  id: 'name',
  label: 'Used in the following Intents',
  tooltip: '',
  type: 'link',
  accessor: row => {
    return { label: row.intentName, path: `/intent/${row.id}/edit` };
  },
  headerClassName: '',
  cellClassName: 'text-align-left table2-column',
  minWidth: 1.75,
  sortable: false,

}];
