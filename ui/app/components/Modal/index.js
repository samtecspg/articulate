/**
 *
 * Modal
 *
 */

import _ from 'lodash';
import React from 'react';
import { Modal as MaterializeModal } from 'react-materialize';

class Modal extends React.Component { // eslint-disable-line react/prefer-stateless-function

  state = {
    id: _.uniqueId('modal_'),
  };

  componentDidUpdate() {
    const { isOpen } = this.props;
    if (isOpen) {
      // eslint-disable-next-line semi,no-undef
      $(`#${this.state.id}`).modal('open');
    } else {
      // eslint-disable-next-line semi,no-undef
      $(`#${this.state.id}`).modal('close');
    }
  }

  componentWillUnmount() {
    // eslint-disable-next-line semi,no-undef
    $(`#${this.state.id}`).modal('close');
  }

  render() {
    const { isOpen, children, ...other } = this.props;
    return (
      <div>
        <MaterializeModal
          {...other}
          id={this.state.id}
        >{children}</MaterializeModal>
      </div>
    );
  }
}

Modal.propTypes = {
  isOpen: React.PropTypes.bool,
  onClose: React.PropTypes.func,
  children: React.PropTypes.node
};
Modal.defaultProps = {};
export default Modal;
