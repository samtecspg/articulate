/**
 *
 * CheckBoxCell
 *
 */

import React from 'react';
import _ from 'lodash';

class CheckBoxCell extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    const id = _.uniqueId('Table2-CheckBoxCell-');
    this.setState({ id });
  }

  onChange(e) {
    this.props.onChange(e.target.checked);
  }

  render() {
    const { value } = this.props;
    return (
      <div key={this.state.id} className="center-align">
        <input type="checkbox" id={this.state.id} checked={!!value} onChange={this.onChange} />
        <label htmlFor={this.state.id}>&nbsp;</label>
      </div>
    );
  }
}

CheckBoxCell.propTypes = {
  value: React.PropTypes.bool.isRequired,
  onChange: React.PropTypes.func.isRequired,
};

export default CheckBoxCell;
