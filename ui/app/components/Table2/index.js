import _ from 'lodash';
import React from 'react';
import { Icon } from 'react-materialize';
import ReactTable from 'react-table';
import Table2Cell from '../Table2Cell';
import MenuCell from '../Table2Cell/types/MenuCell';

import Tooltip from '../Tooltip';
import './table.style.scss';

class Table2 extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.generateColumnDefinition = this.generateColumnDefinition.bind(this);
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
    const cell = column.Cell ? column.Cell : (prop) => {
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
      pivot: column.pivot,
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
      borderContainer,
      highlightRow,
      striped,
      showSearchInput,
      showPagination,
      defaultPageSize,
      ...other,
    } = this.props;
    let newColumns;

    const classNames = [];
    if (borderContainer) classNames.push('border-container ');
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
      <ReactTable
        data={this.props.data}
        columns={newColumns.map(this.generateColumnDefinition)}
        defaultPageSize={defaultPageSize}
        className={classNames.join(' ')}
        showPagination={showPagination}
        {...other}
      />
    );
  }
}

Table2.propTypes = {
  columns: React.PropTypes.array.isRequired,
  menu: React.PropTypes.array,
  data: React.PropTypes.array,
  onCellChange: React.PropTypes.func,
  minRows: React.PropTypes.number,
  highlightRow: React.PropTypes.bool,
  striped: React.PropTypes.bool,
  showPagination: React.PropTypes.bool,
  showSearchInput: React.PropTypes.bool,
  pivotBy: React.PropTypes.array,
  SubComponent: React.PropTypes.func,
  defaultPageSize: React.PropTypes.number,
};

Table2.defaultProps = {
  borderContainer: true,
  highlightRow: true,
  striped: false,
  showPagination: true,
  showSearchInput: true,
  pivotBy: []
};
export default Table2;
