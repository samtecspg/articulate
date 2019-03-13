import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from "react-intl";
import { withRouter } from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, Hidden, Button, Modal }  from '@material-ui/core';

import playHelpIcon from "../../../images/play-help-icon.svg";
import messages from "../messages";

const styles = {
  container: {
    display: 'inline',
    paddingTop: 40,
    paddingBottom: 30,
    paddingLeft: 25,
    height: '115px',
  },
  containerElement: {
    display: 'inline',
  },
  subtitle: {
    paddingLeft: '5px',
    color: '#4e4e4e',
  },
  backArrow: {
    cursor: 'pointer',
    left: -15,
    fontSize: '14px',
    fontFamily: 'Montserrat',
    fontWeight: 400,
    position: 'relative',
  },
  backButton: {
    cursor: 'pointer',
    left: -15,
    fontSize: '14px',
    fontFamily: 'Montserrat',
    fontWeight: 400,
    position: 'relative',
    textDecoration: 'underline',
  },
  helpButton: {
    marginLeft: '5px',
    display: "inline",
    width: "50px",
    height: "20px",
    position: 'relative',
    bottom: '3px'
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
export class ContentHeader extends React.Component {
  
  state = {
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

  render(){
    const { classes, intl } = this.props;
    return (
      <Grid className={classes.container} item xs={12}>
        {this.props.backButton ?
          [<span className={classes.backArrow} key='backArrow'>{'< '}</span>,
            <a key='backLink' className={classes.backButton} onClick={this.props.goBack}>
              <FormattedMessage {...this.props.backButton} />
            </a>] :
          null}
        <Typography variant='h1'>
          <FormattedMessage {...this.props.title} />&nbsp;
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
              src="https://www.youtube.com/embed/pWjaslx94J0"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </Grid>
        </Modal>
        <Hidden only={this.props.sizesForHideInlineElement}>
          {this.props.inlineElement ? this.props.inlineElement : null}
        </Hidden>
      </Grid>
    )
  }
}

ContentHeader.propTypes = {
  intl: intlShape.isRequired,
  title: PropTypes.object.isRequired,
  inlineElement: PropTypes.node,
  classes: PropTypes.object.isRequired,
  sizesForHideInlineElement: PropTypes.array,
  goBack: PropTypes.func,
};

ContentHeader.defaultProps = {
  sizesForHideInlineElement: [],
};

export default injectIntl(withRouter(withStyles(styles)(ContentHeader)));
