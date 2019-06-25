import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import PropTypes from 'prop-types';
import { Grid, Typography, Button, Modal } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import WebhookSettings from 'components/WebhookSettings';

import messages from '../messages';

import playHelpIcon from '../../../images/play-help-icon.svg';
import DeleteFooter from '../../../components/DeleteFooter';

const styles = {
  headerContainer: {
    backgroundColor: '#f6f7f8',
    border: '1px solid #c5cbd8',
    borderRadius: '5px',
    marginBottom: '60px',
  },
  titleContainer: {
    padding: '25px',
  },
  titleTextHelpContainer: {
    display: 'inline',
    position: 'relative',
    bottom: '6px',
  },
  title: {
    display: 'inline',
    paddingRight: '25px',
  },
  formDescriptionContainer: {
    margin: '15px 0px',
  },
  formDescription: {
    fontSize: '14px',
    fontWeight: 300,
  },
  helpButton: {
    display: 'inline',
    width: '50px',
    height: '20px',
  },
  playIcon: {
    height: '10px',
  },
  helpText: {
    fontSize: '9px',
    fontWeight: 300,
    position: 'relative',
    bottom: '2px',
    paddingLeft: '2px',
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
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #c5cbd8',
    borderBottomLeftRadius: '5px',
    borderBottomRightRadius: '5px',
  },
  formSubContainer: {
    padding: '40px 25px',
  },
  panelContent: {
    display: 'inline',
    fontSize: '14px',
    fontWeight: 300,
    color: '#4e4e4e',
    width: '95%',
  },
};

/* eslint-disable react/prefer-stateless-function */
class WebhookForm extends React.Component {
  state = {
    actionNameError: false,
    openModal: false,
  };

  handleOpen = () => {
    this.setState({
      openModal: true,
    });
  };

  handleClose = () => {
    this.setState({
      openModal: false,
    });
  };

  render() {
    const { classes, intl, action, webhook } = this.props;
    return (
      <Grid className={classes.headerContainer} container item xs={12}>
        <Grid className={classes.titleContainer} item xs={12}>
          <Grid className={classes.titleTextHelpContainer} container>
            <Typography className={classes.title} variant="h2">
              <FormattedMessage {...messages.webhookFormTitle} />
            </Typography>
            <Button
              className={classes.helpButton}
              variant="outlined"
              onClick={this.handleOpen}
            >
              <img
                className={classes.playIcon}
                src={playHelpIcon}
                alt={intl.formatMessage(messages.playHelpAlt)}
              />
              <span className={classes.helpText}>
                <FormattedMessage {...messages.help} />
              </span>
            </Button>
            <Modal open={this.state.openModal} onClose={this.handleClose}>
              <Grid className={classes.modalContent} container>
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/o807YDeK6Vg"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </Grid>
            </Modal>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid className={classes.formContainer} container item xs={12}>
            <Grid
              className={classes.formSubContainer}
              id="formContainer"
              container
              item
              xs={12}
            >
              <Typography className={classes.panelContent}>
                <FormattedMessage {...messages.webhookFormDescription} />
              </Typography>
              <WebhookSettings
                webhook={webhook}
                useWebhook={action.useWebhook}
                onChangeUseWebhook={this.props.onChangeActionData}
                onChangeWebhookData={this.props.onChangeWebhookData}
                onChangeWebhookPayloadType={
                  this.props.onChangeWebhookPayloadType
                }
                onAddNewHeader={this.props.onAddNewHeader}
                onDeleteHeader={this.props.onDeleteHeader}
                onChangeHeaderName={this.props.onChangeHeaderName}
                onChangeHeaderValue={this.props.onChangeHeaderValue}
                errorState={this.props.errorState}
              />
            </Grid>
          </Grid>
        </Grid>
        {this.props.newAction ? null : (
          <DeleteFooter
            onDelete={this.props.onDelete}
            type={intl.formatMessage(messages.instanceName)}
          />
        )}
      </Grid>
    );
  }
}

WebhookForm.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  action: PropTypes.object,
  webhook: PropTypes.object,
  onChangeActionData: PropTypes.func,
  onChangeWebhookData: PropTypes.func,
  onChangeWebhookPayloadType: PropTypes.func,
  onAddNewHeader: PropTypes.func,
  onDeleteHeader: PropTypes.func,
  onChangeHeaderName: PropTypes.func,
  onChangeHeaderValue: PropTypes.func,
  errorState: PropTypes.object,
};

export default injectIntl(withStyles(styles)(WebhookForm));
