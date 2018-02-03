import _ from 'lodash';
import React from 'react';

// import styled from 'styled-components';

class Dropdown extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.renderMenu = this.renderMenu.bind(this);
  }

  state = {
    id: undefined,
    item: undefined,
  };

  componentWillMount() {
    const { item } = this.props;
    const id = _.uniqueId('Table2-MenuCell');
    this.setState({
      id,
      item,
    });
  }

  componentDidMount() {
    // eslint-disable-next-line no-undef
    $('.dropdown-button').dropdown();
  }

  componentWillUnmount() {
    // eslint-disable-next-line no-undef
    $('.dropdown-button').dropdown('remove');
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.item.id !== this.state.item.id) {
      this.setState({
        item: nextProps.item,
      });
    }
  }

  renderMenu(menuItem) {
    const action = menuItem.action.bind(null, this.state.item);
    return (
      <li key={menuItem.label}>
        <a onClick={action}>{menuItem.label}</a>
      </li>
    );
  }

  render() {
    const {
      element,
      menu,
      inDuration,
      outDuration,
      constrainWidth,
      hover,
      gutter,
      belowOrigin,
      alignment,
      stopPropagation,
      globalStyle,
    } = this.props;
    return (
      <div style={globalStyle}>
        <a
          className="dropdown-button"
          data-activates={this.state.id}
          data-induration={inDuration}
          data-outDuration={outDuration}
          data-constrainWidth={constrainWidth}
          data-hover={hover}
          data-gutter={gutter}
          data-beloworigin={belowOrigin}
          data-alignment={alignment}
          data-stoppropagation={stopPropagation}
        >{element}</a>
        <ul id={this.state.id} className="dropdown-content">
          {menu.map(this.renderMenu)}
        </ul>
      </div>
    );
  }
}

Dropdown.propTypes = {
  element: React.PropTypes.element.isRequired,
  menu: React.PropTypes.array.isRequired,
  item: React.PropTypes.object.isRequired,
  inDuration: React.PropTypes.number,
  outDuration: React.PropTypes.number,
  constrainWidth: React.PropTypes.bool,
  hover: React.PropTypes.bool,
  gutter: React.PropTypes.number,
  belowOrigin: React.PropTypes.bool,
  alignment: React.PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  stopPropagation: React.PropTypes.bool,
  globalStyle: React.PropTypes.object,
};

Dropdown.defaultProps = {
  inDuration: 200,
  outDuration: 425,
  constrainWidth: false, // Does not change width of dropdown to that of the activator
  hover: true, // Activate on hover
  gutter: 0, // Spacing from edge
  belowOrigin: true, // Displays dropdown below the button
  alignment: 'right', // Displays dropdown with edge aligned to the left of button
  stopPropagation: false,// Stops event propagation
  globalStyle: {}
};

export default Dropdown;
