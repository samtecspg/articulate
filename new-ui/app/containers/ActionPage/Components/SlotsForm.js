import React from "react";
import { FormattedMessage, injectIntl, intlShape } from "react-intl";
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import PropTypes from "prop-types";
import { Grid, Typography, Button, Modal } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import SingleHighlightedSaying from './SingleHighlightedSaying';
import SortableSlotsTabs from './SortableSlotsTabs';
import SlotForm from './SlotForm';

import messages from "../messages";

import playHelpIcon from "../../../images/play-help-icon.svg";
import singleQuotesIcon from "../../../images/single-quotes-icon.svg";
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
    width: window.window.innerWidth < 675 ? 350 : 600,
    height: window.window.innerWidth < 675 ? 215 : 375,
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
  singleQuotesIcon: {
    paddingRight: '10px',
  },
  actionTabs: {
    paddingLeft: '0px',
  },
  slotTabLabel: {
    padding: '0px 10px',
  },
  dot: {
    marginRight: 5,
    height: 10,
    width: 10,
    borderRadius: '50%',
    display: 'inline-block',
  },
};

/* eslint-disable react/prefer-stateless-function */
class SlotsForm extends React.Component {

  state = {
    selectedTab: 0,
    actionNameError: false,
    openModal: false,
  };

  handleChange = (value) => {
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
    const { classes, intl, action } = this.props;
    return (
      <Grid className={classes.headerContainer} container item xs={12}>
        <Grid className={classes.titleContainer} item xs={12}>
          <Grid className={classes.titleTextHelpContainer} container>
            <Typography className={classes.title} variant="h2">
              <FormattedMessage {...messages.slotsFormTitle} />
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
          {
            this.props.saying.userSays ?
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
              </Grid> : null
          }
        </Grid>
        <Grid item xs={12}>
          <SortableSlotsTabs
            action={action}
            onAddNewSlot={this.props.onAddNewSlot}
            onSortSlots={this.props.onSortSlots}
            handleTabChange={this.handleChange}
            selectedTab={this.state.selectedTab}
            onDeleteSlot={this.props.onDeleteSlot}
            errorState={this.props.errorState}
          />
          {action.slots.map((slot, index) => (
            this.state.selectedTab === index ?
              <SlotForm
                slot={slot}
                key={`slotForm_${index}`}
                agentKeywords={this.props.agentKeywords}
                onAddTextPrompt={this.props.onAddTextPrompt.bind(null, index)}
                onDeleteTextPrompt={this.props.onDeleteTextPrompt.bind(null, index)}
                onChangeSlotData={this.props.onChangeSlotData.bind(null, index)}
                onChangeSlotName={this.props.onChangeSlotName.bind(null, index)}
                saying={this.props.saying}
                errorState={this.props.errorState.slots[index]}
              />
              : null
          ))}
        </Grid>
        {this.props.newAction ? 
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

SlotsForm.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  action: PropTypes.object,
  newSlot: PropTypes.object,
  saying: PropTypes.object,
  agentKeywords: PropTypes.array,
  onChangeSlotData: PropTypes.func,
  onAddTextPrompt: PropTypes.func,
  onDeleteTextPrompt: PropTypes.func,
  onAddNewSlot: PropTypes.func,
  onChangeSlotName: PropTypes.func,
  errorState: PropTypes.object,
  onSortSlots: PropTypes.func,
	onDeleteSlot: PropTypes.func,
};

export default DragDropContext(HTML5Backend)(injectIntl(withStyles(styles)(SlotsForm)));
