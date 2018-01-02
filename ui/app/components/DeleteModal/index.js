import React from 'react';
import { Button, } from 'react-materialize';
import Modal from '../../components/Modal';

class DeleteModal extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { isOpen, contentBody, contentHeader } = this.props;
    return (
      <Modal
        isOpen={isOpen}
        header={contentHeader}
        actions={[
          <Button flat waves={'light'} onClick={this.props.onDelete} className={'red lighten-1 white-text text-darken-4'}>delete</Button>,
          <Button flat waves={'light'} onClick={this.props.onDismiss}>cancel</Button>,
        ]}
        modalOptions={{
          dismissible: false,
        }}
      >{contentBody}</Modal>
    );
  }
}

DeleteModal.propTypes = {
  contentHeader: React.PropTypes.string,
  contentBody: React.PropTypes.string,
  isOpen: React.PropTypes.bool.isRequired,
  onDelete: React.PropTypes.func.isRequired,
  onDismiss: React.PropTypes.func.isRequired,
};

DeleteModal.defaultProps = {
  contentHeader: 'Delete',
  contentBody: 'Do you want to proceed?',
};

export default DeleteModal;
