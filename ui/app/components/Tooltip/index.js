import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

class Tooltip extends Component {
  componentDidMount() {
    $('.tooltipped').tooltip();
  }

  componentWillUnmount() {
    $('.tooltipped').tooltip('remove');
  }
  componentDidUpdate() {
    $('.tooltipped').tooltip()
  }

  render() {
    const {
      children,
      tooltip,
      delay,
      position,
      html,
      onClick,
    } = this.props;

    return React.cloneElement(children, {
      'data-tooltip': tooltip,
      'data-delay': delay,
      'data-position': position,
      'data-html': html,
      'onClick': onClick,
      className: cx(children.props.className, 'tooltipped'),
    });
    
  }
}

Tooltip.propTypes = {
  children: PropTypes.element.isRequired,
  tooltip: PropTypes.string.isRequired,
  delay: PropTypes.number,
  html: PropTypes.bool,
  position: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  onClick: PropTypes.func,
};

Tooltip.defaultProps = {
  delay: 350,
  position: 'bottom',
  html: false,
};

export default Tooltip;
