/**
 *
 * CheckBoxCell
 *
 */

import _ from 'lodash';
import React from 'react';

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
    const checked = _.isString(value) ? (value === 'true') : value;
    return (
      <div key={this.state.id} className="center-align">
        <input type="checkbox" id={this.state.id} checked={!!checked} onChange={this.onChange} />
        <label htmlFor={this.state.id}>&nbsp;</label>
      </div>
    );
  }
}

CheckBoxCell.propTypes = {
  value: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.bool,
  ]).isRequired,
  onChange: React.PropTypes.func.isRequired,
};

export default CheckBoxCell;
