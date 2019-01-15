import React from "react";
import { FormattedMessage, injectIntl, intlShape } from "react-intl";
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import PropTypes from "prop-types";
import { Grid, Typography, Button, Modal } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import SortableModifiersTabs from './SortableModifiersTabs';
import ModifierForm from './ModifierForm';

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
  keywordTabs: {
    paddingLeft: '0px',
  },
  modifierTabLabel: {
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
class ModifiersForm extends React.Component {

  state = {
    selectedTab: 0,
    keywordNameError: false,
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
    const { classes, intl, keyword } = this.props;
    return (
      <Grid className={classes.headerContainer} container item xs={12}>
        <Grid className={classes.titleContainer} item xs={12}>
          <Grid className={classes.titleTextHelpContainer} container>
            <Typography className={classes.title} variant="h2">
              <FormattedMessage {...messages.modifiersFormTitle} />
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
              <FormattedMessage {...messages.modifierFormDescription} />
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <SortableModifiersTabs
            keyword={keyword}
            onAddNewModifier={this.props.onAddNewModifier}
            onSortModifiers={this.props.onSortModifiers}
            handleTabChange={this.handleChange}
            selectedTab={this.state.selectedTab}
            onDeleteModifier={this.props.onDeleteModifier}
            errorState={this.props.errorState}
          />
          {keyword.modifiers.map((modifier, index) => (
            this.state.selectedTab === index ?
              <ModifierForm
                modifier={modifier}
                settings={this.props.settings}
                key={`modifierForm_${index}`}
                onAddModifierSaying={this.props.onAddModifierSaying.bind(null, index)}
                onDeleteModifierSaying={this.props.onDeleteModifierSaying.bind(null, index)}
                onChangeModifierData={this.props.onChangeModifierData.bind(null, index)}
                onChangeModifierName={this.props.onChangeModifierName.bind(null, index)}
                saying={this.props.saying}
                errorState={this.props.errorState.modifiers[index]}
                agentKeywords={this.props.agentKeywords}
                onUntagModifierKeyword={this.props.onUntagModifierKeyword.bind(null, index)}
                onTagModifierKeyword={this.props.onTagModifierKeyword.bind(null, index)}
                modifierSayingsPageSize={this.props.modifierSayingsPageSize}
              />
              : null
          ))}
        </Grid>
        {this.props.newKeyword ? 
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

ModifiersForm.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  keyword: PropTypes.object,
  newKeyword: PropTypes.bool,
  onChangeModifierData: PropTypes.func,
  onAddUserSayingForModifier: PropTypes.func,
  onDeleteUserSayingForModifier: PropTypes.func,
  onAddNewModifier: PropTypes.func,
  onChangeModifierName: PropTypes.func,
  onAddModifierSaying: PropTypes.func,
  onDeleteModifierSaying: PropTypes.func,
  errorState: PropTypes.object,
  onSortModifiers: PropTypes.func,
	onDeleteModifier: PropTypes.func,
  settings: PropTypes.object,
  agentKeywords: PropTypes.array,
  onUntagModifierKeyword: PropTypes.func,
  onTagModifierKeyword: PropTypes.func,
  modifierSayingsPageSize: PropTypes.number,
};

export default DragDropContext(HTML5Backend)(injectIntl(withStyles(styles)(ModifiersForm)));
