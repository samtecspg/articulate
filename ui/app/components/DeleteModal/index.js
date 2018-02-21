import React from 'react';
import { Button, } from 'react-materialize';
import Modal from '../../components/Modal';
import deleteIlus from '../../img/delete-ilus.svg';

class DeleteModal extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { isOpen, contentBody, contentHeader } = this.props;
    return (
      <Modal
        style={{
          width: '35%',
          textAlign: 'center',
        }}
        isOpen={isOpen}
        actions={[
          <Button onClick={this.props.onDelete} style={{
            backgroundColor: '#de5e56',
          }}>delete</Button>,
          <Button onClick={this.props.onDismiss}>Cancel</Button>,
        ]}
        modalOptions={{
          dismissible: false,
        }}
      >
      <div style={{
          textAlign: 'center',
        }}>
          <img src={deleteIlus} style={{
            width: '100px',
            height: '100px',
            paddingBottom: '15px',
          }} alt="" />
          <p style={{fontSize: '2em'}}>{contentHeader}</p>
          <p>{contentBody}</p>
        </div>
      </Modal>
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
