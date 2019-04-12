import React from "react";
import { FormattedMessage, injectIntl, intlShape } from "react-intl";

import PropTypes from "prop-types";
import { Grid, Typography, Button, Modal, TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import ChipInput from 'components/ChipInput'

import messages from "../messages";

import playHelpIcon from "../../../images/play-help-icon.svg";
import DeleteFooter from "../../../components/DeleteFooter";

const styles = {
  headerContainer: {
    backgroundColor: "#f6f7f8",
    border: "1px solid #c5cbd8",
    borderRadius: "5px",
    marginBottom: "60px",
  },
  titleContainer: {
    padding: "25px",
  },
  titleTextHelpContainer: {
    display: "inline",
    position: "relative",
    bottom: "6px",
  },
  title: {
    display: "inline",
    paddingRight: "25px",
  },
  formDescriptionContainer: {
    margin: '15px 0px',
  },
  formDescription: {
    fontSize: '14px',
    fontWeight: 300,
  },
  helpButton: {
    display: "inline",
    width: "50px",
    height: "20px",
  },
  playIcon: {
    height: "10px",
  },
  helpText: {
    fontSize: "9px",
    fontWeight: 300,
    position: "relative",
    bottom: "2px",
    paddingLeft: "2px",
  },
  modalContent: {
    top: "50%",
    left: "50%",
    transform: `translate(-50%, -50%)`,
    position: "absolute",
    width: '80%',
    height: '80%',
    backgroundColor: "#fff",
    boxShadow:
      "0px 3px 5px -1px rgba(0, 0, 0, 0.2),0px 5px 8px 0px rgba(0, 0, 0, 0.14),0px 1px 14px 0px rgba(0, 0, 0, 0.12)",
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
  connectionValueInputContainer: {
    padding: '0px 12px !important',
  },
  connectionValueInput: {
    marginTop: '0px',
  },
  chipInputRootFirst: {
    marginTop: 16,
    marginBottom: 8,
  },
  chipInputRoot: {
    marginBottom: 8,
  },
  chipContainer: {
    border: '1px solid #a2a7b1',
    borderRadius: '5px',
    marginTop: '25px !important',
  },
  inputRoot: {
    marginTop: '0px !important',
  },
  chip: {
    margin: '8px 0px 8px 8px',
  },
  chipInput: {
    border: 'none',
  },
  newValueInput: {
    marginTop: '-15px !important',
  },
};

/* eslint-disable react/prefer-stateless-function */
class DetailsForm extends React.Component {
  state = {
    openModal: false,
    newConnection: '',
    newSyonynm: '',
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
    const { classes, intl, connection } = this.props;
    return (
      <Grid className={classes.headerContainer} container item xs={12}>
        <Grid className={classes.titleContainer} item xs={12}>
          <Grid className={classes.titleTextHelpContainer} container>
            <Typography className={classes.title} variant="h2">
              <FormattedMessage {...messages.detailsFormTitle} />
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
                  width='100%'
                  height='100%'
                  src="https://www.youtube.com/embed/O6EnZ9cjLOI"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </Grid>
            </Modal>
          </Grid>
          <Grid className={classes.formDescriptionContainer} container>
            <Typography className={classes.formDescription}>
              <FormattedMessage {...messages.detailsFormDescription} />
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid className={classes.formContainer} container item xs={12}>
            <Grid className={classes.formSubContainer} id='formContainer' container item xs={12}>
              {this.props.connection.channel ? (Object.keys(this.props.channels[this.props.connection.channel].details).length > 0 ? Object.keys(this.props.channels[this.props.connection.channel].details).map((detail, detailIndex) => (
                <Grid key={`value_${detailIndex}`} container item xs={12}>
                  <Grid className={classes.keywordValueInputContainer} item xs={12}>
                    <TextField
                      id='detailValue'
                      className={detailIndex !== 0 ? classes.keywordValueInput : ''}
                      value={this.props.connection.details[detail]}
                      label={detail}
                      placeholder={this.props.channels[this.props.connection.channel].details[detail]}
                      onChange={(evt) => { this.props.onChangeDetailValue(detail, evt.target.value) }}
                      margin='normal'
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>
              )) : <Typography><FormattedMessage {...messages.noDetailsInChanell} /></Typography>) : <Typography><FormattedMessage {...messages.selectAChanelFirst} /></Typography>}
            </Grid>
          </Grid>
        </Grid>
        {this.props.newConnection ? 
          null : 
          <DeleteFooter
            onDelete={this.props.onDelete}
            type={intl.formatMessage(messages.instanceName)}
          />
        }
      </Grid>
    );
  }
}

DetailsForm.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  channels: PropTypes.object,
  agents: PropTypes.array,
  connection: PropTypes.object,
  onChangeConnectionData: PropTypes.func.isRequired,
  onChangeDetailValue: PropTypes.func,
  errorState: PropTypes.object,
  onDelete: PropTypes.func,
  newConnection: PropTypes.bool
};

export default injectIntl(withStyles(styles)(DetailsForm));
