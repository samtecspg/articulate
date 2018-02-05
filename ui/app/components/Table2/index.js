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
    this.updateData = this.updateData.bind(this);
  }

  state = {
    initialData: [],
    data: [],
    filterFields: [],
  };

  componentWillMount() {
    this.updateData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateData(nextProps);
  }

  onChangeSearchInput(event) {
    this.searchTable(event.target.value);
  }

  updateData(props) {
    this.setState({
      initialData: props.data,
      data: props.data,
      filterFields: _(props.columns).filter('filterable').map('accessor').value(),
    });
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
      pivot:column.pivot,
      Cell: cell,
      accessor: column.accessor,
      sortable: column.sortable,
      className: column.cellClassName,
      headerClassName: column.headerClassName,
      minWidth: column.minWidth,
      resizable: column.resizable,
      maxWidth: column.maxWidth,
      Aggregated: column.Aggregated,
      aggregate: column.aggregate,
      id: column.id,
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
      pivotBy
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
            pivotBy={pivotBy}
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
  pivotBy: React.PropTypes.array,
};

Table2.defaultProps = {
  minRows: 15,
  highlightRow: true,
  striped: false,
  showPagination: false,
  showSearchInput: true,
  pivotBy: []
};
export default Table2;
