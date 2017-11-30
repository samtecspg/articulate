import _ from 'lodash';
import React from 'react';
import { Icon } from 'react-materialize';
import ReactTable from 'react-table';
import SearchInput from '../SearchInput/index';
import Table2Cell from '../Table2Cell';
import MenuCell from '../Table2Cell/types/MenuCell';

import Tooltip from '../Tooltip';
import './table.style.scss';

class Table2 extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.generateColumnDefinition = this.generateColumnDefinition.bind(this);
    this.onChangeSearchInput = this.onChangeSearchInput.bind(this);
    this.searchTable = this.searchTable.bind(this);
  }

  state = {
    initialData: [],
    data: [],
    filterFields: [],
  };

  componentWillMount() {
    this.setState({
      initialData: this.props.data,
      data: this.props.data,
      filterFields: _(this.props.columns).filter('filterable').map('accessor').value(),
    });
  }

  onChangeSearchInput(event) {
    this.searchTable(event.target.value);
  }

  searchTable(searchText) {
    const filter = (value) => {
      const search = (field) => value[field].toString().toLowerCase().indexOf(searchText.toLowerCase()) >= 0;
      return _(this.state.filterFields).map(search).compact().value().length > 0;
    };
    const filteredData = searchText ? _.filter(this.state.initialData, filter) : this.state.initialData;
    this.setState({ data: filteredData });
  }

  generateColumnDefinition(column) {
    const { onCellChange } = this.props;
    const header = (<div>
      {column.label}
      {
        column.tooltip
          ? <Tooltip
            tooltip={column.tooltip}
            delay={50}
            position="top"
          >
            <a>
              <Icon>help_outline</Icon>
            </a>
          </Tooltip>
          : ''
      }</div>);
    const cell = (prop) => {
      const tableCell = column.type === 'menu' ?
        (
          <MenuCell
            menu={column.menu}
            item={prop.original}
          />
        ) :
        (
          <Table2Cell
            value={prop.value}
            type={column.type}
            onCellChange={(value) => onCellChange(prop.original, column.accessor, value)}
          />
        );
      return (tableCell);
    };

    return {
      Header: header,
      Cell: cell,
      accessor: column.accessor,
      sortable: column.sortable,
      className: column.cellClassName,
      headerClassName: column.headerClassName,
      minWidth: column.minWidth,
      resizable: column.resizable,
      maxWidth: column.maxWidth,
    };
  }

  render() {
    const {
      columns,
      menu,
      tableName,
      minRows,
      highlightRow,
      striped,
      showPagination,
      showSearchInput,
    } = this.props;
    let newColumns;

    const classNames = ['border-container'];
    if (highlightRow) classNames.push('-highlight');
    if (striped) classNames.push('-striped');

    // If menu object is available then render a new cell
    if (menu && menu.length > 0) {
      const menuCell = {
        type: 'menu',
        resizable: false,
        sortable: false,
        cellClassName: 'table2-row-menu',
        maxWidth: 45,
        menu,
      };
      newColumns = [...columns, menuCell];
    } else {
      newColumns = columns;
    }
    return (
      <div className={'ReactTable'}>
        {showSearchInput ?
          <SearchInput
            onChange={this.onChangeSearchInput}
            name={tableName}
          />
          : ''
        }
        <div>
          <ReactTable
            data={this.state.data}
            columns={newColumns.map(this.generateColumnDefinition)}
            showPagination={showPagination}
            className={classNames.join(' ')}
            minRows={minRows}
          />
        </div>
      </div>
    );
  }
}

Table2.propTypes = {
  columns: React.PropTypes.array.isRequired,
  menu: React.PropTypes.array,
  data: React.PropTypes.array,
  onCellChange: React.PropTypes.func.isRequired,
  tableName: React.PropTypes.string,
  minRows: React.PropTypes.number,
  highlightRow: React.PropTypes.bool,
  striped: React.PropTypes.bool,
  showPagination: React.PropTypes.bool,
  showSearchInput: React.PropTypes.bool,

};

Table2.defaultProps = {
  minRows: 15,
  highlightRow: true,
  striped: false,
  showPagination: false,
  showSearchInput: true,

};
export default Table2;
