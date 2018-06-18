/**
 *
 * IntentsTable
 *
 */

import React from 'react';
import Table2 from '../Table2';
import columns from './columnDefinition';
import Immutable from 'seamless-immutable';
import SearchInput from '../SearchInput/index';

class IntentsTable extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(){
    super();
    this.onChangeSearchInput = this.onChangeSearchInput.bind(this);
  }

  state = {
    filter: '',
    page: 0,
    pages: 0,
    initialData: [],
    data: []
  };

  onChangeSearchInput(event) {
    this.setState({
      page: 0,
      filter: event.target.value
    }, () => {
      this.props.onReloadData(this.state.page ? this.state.page : 0, this.state.filter);
    });
  }

  componentWillMount() {
    this.updateData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateData(nextProps);
  }

  updateData(props) {
    this.setState({
      initialData: Immutable.asMutable(props.data.intents, { deep: true }),
      data: Immutable.asMutable(props.data.intents, { deep: true }),
      pages: Math.ceil(props.data.total / this.props.defaultPageSize)
    });
  }

  render() {
    const { data, onCellChange, menu, defaultPageSize } = this.props;
    return (
      <div className={'ReactTable'}>
        <SearchInput
          onChange={this.onChangeSearchInput}
          name={'Intents'}
        />
        <div>
          <Table2
            sortable={false}
            manual
            page={this.state.page}
            pages={this.state.pages}
            onPageChange={
              (pageIndex) => {
                this.setState({
                  page: pageIndex
                })
                this.props.onReloadData.bind(null, pageIndex, this.state.filter)()
              }
            }
            defaultPageSize={defaultPageSize}
            columns={columns}
            data={this.state.data}
            onCellChange={onCellChange}
            menu={menu}
            tableName={'Intents'}
          />
        </div>
      </div>
    );
  }
}

IntentsTable.propTypes = {
  data: React.PropTypes.object,
  menu: React.PropTypes.array,
  onCellChange: React.PropTypes.func,
  onReloadData: React.PropTypes.func,
  defaultPageSize: React.PropTypes.number,
};

IntentsTable.defaultProps = {
  defaultPageSize: 10,
}

export default IntentsTable;
