import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import {
  Grid,
  Slide,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

const styles = {
  subContainer: {
    marginBottom: '15px',
  },
  textContainer: {
    color: '#a2a7b1',
    float: 'right',
    display: 'inline',
    marginRight: '24px',
  },
  exitIcon: {
    cursor: 'pointer',
    marginLeft: '20px',
    marginRight: '5px',
    paddingTop: '20px',
  },
  message: {
    position: 'relative',
    bottom: '3px',
  },
  exitLabel: {
    color: '#4e4e4e',
    cursor: 'pointer',
    textDecoration: 'underline',
    position: 'relative',
    bottom: '3px',
  },
  dialog: {
    border: '1px solid #4e4e4e',
  },
  dialogContent: {
    backgroundColor: '#f6f7f8',
    borderBottom: '1px solid #4e4e4e',
  },
  dialogContentGrid: {
    margin: '40px 0px',
  },
  dialogActions: {
    height: '105px',
    overflowX: 'hidden',
  },
  exitLabelDialog: {
    fontSize: '12px',
    position: 'relative',
    bottom: '2px',
  },
  exitMessage: {
    color: '#4e4e4e',
    fontSize: '18px',
  },
  exitQuestion: {
    color: '#4e4e4e',
    fontSize: '14px',
  },
  exitButton: {
    color: '#f44336',
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
};

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class ExitModal extends React.PureComponent {
  state = {
    hoverOnExit: false,
  };

  render() {
    const { classes } = this.props;
    return (
      <Grid container>
        <Dialog
          open={this.props.open}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => {
            this.props.onClose();
          }}
          maxWidth="xs"
          className={classes.dialog}
        >
          <DialogContent className={classes.dialogContent}>
            <Grid className={classes.dialogContentGrid}>
              <DialogContentText>
                <span className={classes.exitMessage}>
                  {!this.props.customMessage1 &&
                    <FormattedMessage {...messages.exitMessageDialog1} />}
                  {!this.props.customMessage1 ? ` ${this.props.type} ` : null}
                  {!this.props.customMessage1 &&
                    <FormattedMessage {...messages.exitMessageDialog2} />}
                  {this.props.customMessage1}
                </span>
              </DialogContentText>
              <DialogContentText>
                <br />
                <span className={classes.exitQuestion}>
                  {!this.props.customMessage2 &&
                    <FormattedMessage {...messages.exitQuestion} />}
                  {this.props.customMessage2}
                </span>
              </DialogContentText>
            </Grid>
          </DialogContent>
          <DialogActions className={classes.dialogActions}>
            <Grid container justify="center" spacing={24}>
              <Grid item>
                <Button
                  variant="contained"
                  onClick={() => {
                    this.props.onSaveAndExit();
                    this.props.onClose();
                  }}
                >
                  {!this.props.customMessageSaveAndExitButton &&
                    <FormattedMessage {...messages.saveAndExit} />}
                  {this.props.customMessageSaveAndExitButton}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  className={classes.exitButton}
                  onClick={() => {
                    this.props.onExit();
                    this.props.onClose();
                  }}
                >
                  {!this.props.customMessageExitButton &&
                    <FormattedMessage {...messages.exit} />}
                  {this.props.customMessageExitButton}
                </Button>
              </Grid>
            </Grid>
          </DialogActions>
        </Dialog>
      </Grid>
    );
  }
}

ExitModal.propTypes = {
  classes: PropTypes.object.isRequired,
  onSaveAndExit: PropTypes.func,
  onExit: PropTypes.func,
  onClose: PropTypes.func,
  type: PropTypes.string,
  open: PropTypes.bool,
  customMessage1: PropTypes.string,
  customMessage2: PropTypes.string,
  customMessageSaveAndExitButton: PropTypes.string,
  customMessageExitButton: PropTypes.string
};

export default withStyles(styles)(ExitModal);
