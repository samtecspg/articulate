import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import {
  Grid,
  Modal,
} from '@material-ui/core';
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from './messages';

const styles = {
  dialog: {
    border: '1px solid #4e4e4e',
  },
  modalContent: {
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%)`,
    position: 'absolute',
    width: '80%',
    height: '80%',
    backgroundColor: '#fff',
    boxShadow:
      '0px 3px 5px -1px rgba(0, 0, 0, 0.2),0px 5px 8px 0px rgba(0, 0, 0, 0.14),0px 1px 14px 0px rgba(0, 0, 0, 0.12)',
  }
};

class VersionsModal extends React.PureComponent {
  state = {
    hoverOnExit: false,
  };

  render() {
    const { classes } = this.props;
    debugger;
    return (
      <Grid container>
        <div>
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={this.props.open}
            onClose={this.props.onClose}
          >
            <div className={classes.modalContent}>
              <h2 id="simple-modal-title">Text in a modal</h2>
              <p id="simple-modal-description">
                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </p>

            </div>
          </Modal>
        </div>
      </Grid>
    );
  }
}

VersionsModal.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool
};

export default injectIntl(withStyles(styles)(VersionsModal));