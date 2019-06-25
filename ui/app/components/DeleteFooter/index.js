import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import {
  Grid,
  Typography,
  Slide,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import trashIcon from '../../images/trash-icon.svg';

const styles = {
  container: {
    backgroundColor: '#FFF',
    borderTop: '1px solid #c5cbd8',
    borderBottomLeftRadius: '5px',
    borderBottomRightRadius: '5px',
  },
  subContainer: {
    marginBottom: '15px',
  },
  textContainer: {
    color: '#a2a7b1',
    float: 'right',
    display: 'inline',
    marginRight: '24px',
  },
  deleteIcon: {
    cursor: 'pointer',
    marginLeft: '20px',
    marginRight: '5px',
    paddingTop: '20px',
  },
  message: {
    position: 'relative',
    bottom: '3px',
  },
  deleteLabel: {
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
  deleteLabelDialog: {
    fontSize: '12px',
    position: 'relative',
    bottom: '2px',
  },
  deleteMessage: {
    color: '#4e4e4e',
    fontSize: '18px',
  },
  deleteQuestion: {
    color: '#4e4e4e',
    fontSize: '14px',
  },
  deleteButton: {
    color: '#f44336',
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
};

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class DeleteFooter extends React.PureComponent {
  state = {
    hoverOnDelete: false,
    openDeleteDialog: false,
  };

  render() {
    const { classes } = this.props;
    return (
      <Grid container className={classes.container}>
        <Dialog
          open={this.state.openDeleteDialog}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => {
            this.setState({
              openDeleteDialog: false,
              selectedAgent: null,
            });
          }}
          maxWidth="xs"
          className={classes.dialog}
        >
          <DialogContent className={classes.dialogContent}>
            <Grid className={classes.dialogContentGrid}>
              <DialogContentText>
                <span className={classes.deleteMessage}>
                  <FormattedMessage {...messages.deleteMessageDialog} />
                  {` ${this.props.type}`}.
                </span>
              </DialogContentText>
              <DialogContentText>
                <br />
                <span className={classes.deleteQuestion}>
                  <FormattedMessage {...messages.deleteQuestion} />
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
                    this.setState({
                      openDeleteDialog: false,
                    });
                  }}
                >
                  <FormattedMessage {...messages.no} />
                </Button>
              </Grid>
              <Grid item>
                <Button
                  className={classes.deleteButton}
                  onClick={() => {
                    this.props.onDelete();
                    this.setState({
                      openDeleteDialog: false,
                    });
                  }}
                >
                  <FormattedMessage {...messages.delete} />
                </Button>
              </Grid>
            </Grid>
          </DialogActions>
        </Dialog>
        <Grid className={classes.subContainer} item xs={12}>
          <Typography className={classes.textContainer}>
            <span
              style={{ display: this.state.hoverOnDelete ? 'inline' : 'none' }}
              className={classes.message}
            >
              <FormattedMessage {...messages.deleteMessage} />
              {` ${this.props.type}`}
            </span>
            <span
              onMouseLeave={() => this.setState({ hoverOnDelete: false })}
              onMouseOver={() => this.setState({ hoverOnDelete: true })}
              onClick={() => {
                this.setState({
                  openDeleteDialog: true,
                });
              }}
              className={classes.deleteContainer}
            >
              <img className={classes.deleteIcon} src={trashIcon} />
              <span className={classes.deleteLabel}>
                <FormattedMessage {...messages.delete} />
              </span>
            </span>
          </Typography>
        </Grid>
      </Grid>
    );
  }
}

DeleteFooter.propTypes = {
  classes: PropTypes.object.isRequired,
  onDelete: PropTypes.func,
  type: PropTypes.string,
};

export default withStyles(styles)(DeleteFooter);
