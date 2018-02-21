import React from 'react';
import { Button, } from 'react-materialize';
import Modal from '../../components/Modal';
import exitIlus from '../../img/exit-ilus.svg';

class ConfirmationModal extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { isOpen, contentBody, contentHeader } = this.props;
    return (
      <Modal
        style={{
          width: '35%',
          textAlign: 'center',
          maxHeight: '100%',
          height: '340px',
        }}
        isOpen={isOpen}
        actions={[
          <Button onClick={this.props.onLeave} style={{
            backgroundColor: '#d3d3d3',
            color: '#4e4e4e',
          }}>Abandon</Button>,
          <Button className='modal-action modal-close' onClick={this.props.onDismiss}>Stay</Button>,
        ]}
        modalOptions={{
          dismissible: false,
        }}
      >{
        <div style={{
          textAlign: 'center',
        }}>
          <img src={exitIlus} style={{
              width: '100px',
              height: '100px',
              paddingBottom: '10px',
            }} alt="" />
          <p style={{fontSize: '2em'}}>{contentHeader}</p>
          <br/>
          <p>{contentBody}</p>
        </div>
      }</Modal>
    );
  }
}

ConfirmationModal.propTypes = {
  contentHeader: React.PropTypes.string,
  contentBody: React.PropTypes.string,
  isOpen: React.PropTypes.bool.isRequired,
  onLeave: React.PropTypes.func.isRequired,
  onDismiss: React.PropTypes.func.isRequired,
};

ConfirmationModal.defaultProps = {
  contentHeader: 'Abandon your edits?',
  contentBody: 'You have not saved your edits. If you leave you will lose your current work.',
};

export default ConfirmationModal;
