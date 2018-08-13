import React from "react";
import { FormattedMessage, injectIntl, intlShape } from "react-intl";

import PropTypes from "prop-types";
import { Grid, Typography, Button, Modal, TextField, Table, TableBody, TableRow, TableCell } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import SingleHighlightedSaying from './SingleHighlightedSaying';
import ResponseSettings from 'Components/ResponseSettings';

import messages from "../messages";

import playHelpIcon from "../../../images/play-help-icon.svg";
import singleQuotesIcon from "../../../images/single-quotes-icon.svg";
import trashIcon from '../../../images/trash-icon.svg';

const styles = {
  headerContainer: {
    backgroundColor: "#f6f7f8",
    border: "1px solid #c5cbd8",
    borderRadius: "5px",
    marginBottom: "60px"
  },
  titleContainer: {
    padding: "25px"
  },
  titleTextHelpContainer: {
    display: "inline",
    position: "relative",
    bottom: "6px"
  },
  title: {
    display: "inline",
    paddingRight: "25px",
  },
  formDescriptionContainer: {
    margin: '15px 0px'
  },
  formDescription: {
    fontSize: '14px',
    fontWeight: 300
  },
  helpButton: {
    display: "inline",
    width: "50px",
    height: "20px"
  },
  playIcon: {
    height: "10px"
  },
  helpText: {
    fontSize: "9px",
    fontWeight: 300,
    position: "relative",
    bottom: "2px",
    paddingLeft: "2px"
  },
  modalContent: {
    top: "50%",
    left: "50%",
    transform: `translate(-50%, -50%)`,
    position: "absolute",
    width: window.window.innerWidth < 675 ? 350 : 600,
    height: window.window.innerWidth < 675 ? 215 : 375,
    backgroundColor: "#fff",
    boxShadow:
      "0px 3px 5px -1px rgba(0, 0, 0, 0.2),0px 5px 8px 0px rgba(0, 0, 0, 0.14),0px 1px 14px 0px rgba(0, 0, 0, 0.12)"
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #c5cbd8',
    borderBottomLeftRadius: '5px',
    borderBottomRightRadius: '5px'
  },
  formSubContainer: {
    padding: '40px 25px'
  },
  singleQuotesIcon: {
    paddingRight: '10px'
  },
  table: {
    marginTop: '10px'
  },
  deleteCell: {
    width: '20px'
  },
  deleteIcon: {
    cursor: 'pointer'
  },
  postFormatLabel: {
    color: '#a2a7b1',
    marginBottom: '10px',
  },
  postFormatContainer: {
    marginTop: '20px'
  }
};

/* eslint-disable react/prefer-stateless-function */
class ResponseForm extends React.Component {
  state = {
    actionNameError: false,
    openModal: false
  };

  handleOpen = () => {
    this.setState({
      openModal: true
    });
  };

  handleClose = () => {
    this.setState({
      openModal: false
    });
  };

  render() {
    const { classes, intl, action, postFormat } = this.props;
    return (
      <Grid className={classes.headerContainer} container item xs={12}>
        <Grid className={classes.titleContainer} item xs={12}>
          <Grid className={classes.titleTextHelpContainer} container>
            <Typography className={classes.title} variant="display3">
              <FormattedMessage {...messages.responseFormTitle} />
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
                  width={styles.modalContent.width}
                  height={styles.modalContent.height}
                  src="https://www.youtube.com/embed/o807YDeK6Vg"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </Grid>
            </Modal>
          </Grid>
          <Grid className={classes.formDescriptionContainer} container>
            <Typography className={classes.formDescription}>
              <img className={classes.singleQuotesIcon} src={singleQuotesIcon} />
              <SingleHighlightedSaying
                agentKeywords={this.props.agentKeywords}
                keywords={this.props.saying.keywords}
                text={this.props.saying.userSays}
                keywordIndex={0}
                lastStart={0}
              />
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid className={classes.formContainer} container item xs={12}>
            <Grid className={classes.formSubContainer} id='formContainer' container item xs={12}>
              <Grid container spacing={24} item xs={12}>
                <Grid item xs={12}>
                  <TextField
                    id='newResponse'
                    label={intl.formatMessage(messages.responseTextField)}
                    placeholder={intl.formatMessage(messages.responseTextFieldPlaceholder)}
                    onKeyPress={(ev) => {
                      if (ev.key === 'Enter') {
                        ev.preventDefault();
                        this.props.onAddResponse(ev.target.value)
                        ev.target.value = '';
                      }
                    }}
                    margin='normal'
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    helperText={intl.formatMessage(messages.responseHelperText)}
                  />
                  {action.responses.length > 0 ?
                    <Table className={classes.table}>
                      <TableBody>
                        {action.responses.map((response, index) => {
                          return (
                            <TableRow key={`${response}_${index}`}>
                              <TableCell>
                                {response}
                              </TableCell>
                              <TableCell className={classes.deleteCell}>
                                <img onClick={() => { this.props.onDeleteResponse(index) }} className={classes.deleteIcon} src={trashIcon} />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table> :
                    null
                  }
                </Grid>
                <Grid item xs={12}>
                  <Typography className={classes.postFormatLabel} variant='caption'>
                    <FormattedMessage {...messages.postFormatTitle} />
                  </Typography>
                  <ResponseSettings
                    postFormat={postFormat}
                    usePostFormat={action.usePostFormat}
                    onChangeUsePostFormatData={this.props.onChangeActionData}
                    onChangePostFormatData={this.props.onChangePostFormatData}
                    responseSettingDescription={messages.responseFormDescription}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

ResponseForm.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  action: PropTypes.object,
  postFormat: PropTypes.object,
  saying: PropTypes.object,
  agentKeywords: PropTypes.object,
  onChangeActionData: PropTypes.func,
  onChangePostFormatData: PropTypes.func,
  onAddResponse: PropTypes.func,
  onDeleteResponse: PropTypes.func,
};

export default injectIntl(withStyles(styles)(ResponseForm));
