import React from "react";
import { FormattedMessage, injectIntl, intlShape } from "react-intl";

import PropTypes from "prop-types";
import { Grid, Typography, Button, Modal} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import messages from "../messages";

import settingsIcon from "../../../images/settings-icon.svg";
import playHelpIcon from "../../../images/play-help-icon.svg";

import SettingsDataForm from "./SettingsDataForm";

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
  settingsIcon: {
    display: "inline",
    paddingRight: "10px",
    height: "30px",
  },
  title: {
    display: "inline",
    paddingRight: "25px",
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
};

/* eslint-disable react/prefer-stateless-function */
class Form extends React.Component {
  state = {
    selectedTab: 0,
    openModal: false,
  };

  handleChange = (event, value) => {
    this.setState({
      selectedTab: value,
    });
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
    const { classes, intl } = this.props;
    return (
      <Grid className={classes.headerContainer} container item xs={12}>
        <Grid className={classes.titleContainer} item xs={12}>
          <img className={classes.settingsIcon} src={settingsIcon} />
          <Grid className={classes.titleTextHelpContainer} container>
            <Typography className={classes.title} variant="h2">
              <FormattedMessage {...messages.title} />
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
          <SettingsDataForm
            settings={this.props.settings}
            onChangeSettingsData={this.props.onChangeSettingsData}
            onAddFallbackResponse={this.props.onAddFallbackResponse}
            onDeleteFallbackResponse={this.props.onDeleteFallbackResponse}
            errorState={this.props.errorState}
          />
        </Grid>
      </Grid>
    );
  }
}

Form.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  settings: PropTypes.object,
  onChangeSettingsData: PropTypes.func,
  onAddFallbackResponse: PropTypes.func.isRequired,
  onDeleteFallbackResponse: PropTypes.func.isRequired,
  errorState: PropTypes.object,
};

export default injectIntl(withStyles(styles)(Form));
