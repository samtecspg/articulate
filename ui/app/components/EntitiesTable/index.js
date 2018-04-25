/**
 *
 * EntitiesTable
 *
 */

import React from 'react';
import Table2 from '../Table2';
import columns from './columnDefinition';
import IntentListTable from './components/intentListtable';
import Immutable from 'seamless-immutable';
import SearchInput from '../SearchInput/index';

class EntitiesTable extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(){
    super();
    this.onChangeSearchInput = this.onChangeSearchInput.bind(this);
    this.searchTable = this.searchTable.bind(this);
  }

  state = {
    initialData: [],
    data: [],
    filterFields: [],
  };

  onChangeSearchInput(event) {
    this.searchTable(event.target.value);
  }

  componentWillMount() {
    this.updateData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateData(nextProps);
  }

  updateData(props) {
    this.setState({
      initialData: Immutable.asMutable(props.data, { deep: true }),
      data: Immutable.asMutable(props.data, { deep: true }),
      filterFields: _(columns).filter('filterable').map('accessor').value(),
    });
  }

  searchTable(searchText) {
    const filter = (value) => {
      const search = (field) => {
        if (typeof field === 'function'){
          return value[field(value).columnName].toString().toLowerCase().indexOf(searchText.toLowerCase()) >= 0
        }
        else {
          return value[field].toString().toLowerCase().indexOf(searchText.toLowerCase()) >= 0
        }
      };
      return _(this.state.filterFields).map(search).compact().value().length > 0;
    };
    const filteredData = searchText ? _.filter(this.state.initialData, filter) : this.state.initialData;
    this.setState({ data: filteredData });
  }

  render() {
    const { data, intentData, onCellChange, menu } = this.props;
    let formattedData = Immutable.asMutable(data, { deep: true });
    return (
      <div className={'ReactTable'}>
        <SearchInput
          onChange={this.onChangeSearchInput}
          name={'Entities'}
        />
        <div>
          <Table2
            columns={columns}
            data={this.state.data}
            onCellChange={onCellChange}
            menu={menu}
            tableName={'Entities'}
            defaultSortMethod={(a, b, desc) => {
              a = (a === null || a === undefined) ? -Infinity : a.label
              b = (b === null || b === undefined) ? -Infinity : b.label
              // force any string values to lowercase
              a = a === 'string' ? a.toLowerCase() : a
              b = b === 'string' ? b.toLowerCase() : b
              // Return either 1 or -1 to indicate a sort priority
              if (a > b) {
                return 1
              }
              if (a < b) {
                return -1
              }
              // returning 0, undefined or any falsey value will use subsequent sorts or the index as a tiebreaker
              return 0
            }}
            SubComponent={row => {

              return <div style={{ padding: '20px' }}>
                <div
                  style={{
                    padding: '20px',
                    border: '1px solid rgba(0,0,0,0.1)',
                  }}
                  className={' grey lighten-5'}
                >
                  <IntentListTable
                    data={intentData[row.original.id]}
                  />
                </div>
              </div>
                ;
            }}
          />
        </div>
      </div>
    );
  }
}

EntitiesTable.propTypes = {
  data: React.PropTypes.array,
  intentData: React.PropTypes.any,
  menu: React.PropTypes.array,
  onCellChange: React.PropTypes.func,
  onFetchIntents: React.PropTypes.func,
};

export default EntitiesTable;
