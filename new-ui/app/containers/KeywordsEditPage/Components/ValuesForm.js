import React from "react";
import Immutable from 'seamless-immutable';
import { FormattedMessage, injectIntl, intlShape } from "react-intl";

import PropTypes from "prop-types";
import { Grid, Typography, Button, Modal, TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import ChipInput from 'components/ChipInput'

import messages from "../messages";

import playHelpIcon from "../../../images/play-help-icon.svg";

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
  keywordValueInputContainer: {
    padding: '0px 12px !important',
  },
  keywordValueInput: {
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
class ValuesForm extends React.Component {
  state = {
    openModal: false,
    newKeyword: '',
    newSyonynm: '',
    lastExampleEdited: false,
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

  componentDidUpdate() {
    if (this.state.lastExampleEdited) {
      this.state.lastExampleEdited = false;
      this.scrollToBottom();
    }
  }

  scrollToBottom = () => {
    this.lastExample.scrollIntoView({ block: 'end', behavior: 'smooth' });
  };

  render() {
    const { classes, intl, keyword } = this.props;
    return (
      <Grid className={classes.headerContainer} container item xs={12}>
        <Grid className={classes.titleContainer} item xs={12}>
          <Grid className={classes.titleTextHelpContainer} container>
            <Typography className={classes.title} variant="h2">
              <FormattedMessage {...messages.valuesFormTitle} />
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
              <FormattedMessage {...messages.valuesFormDescription} />
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid className={classes.formContainer} container item xs={12}>
            <Grid className={classes.formSubContainer} id='formContainer' container item xs={12}>
              {keyword.examples.map((example, exampleIndex) => (
                <Grid key={`value_${exampleIndex}`} container justify='space-between' spacing={24} item xs={12}>
                  <Grid className={classes.keywordValueInputContainer} item xs={3}>
                    <TextField
                      id='exampleValue'
                      className={exampleIndex !== 0 ? classes.keywordValueInput : ''}
                      value={example.value}
                      label={exampleIndex === 0 ? intl.formatMessage(messages.newKeywordValueTextField) : null}
                      placeholder={keyword.type === 'learned' ? intl.formatMessage(messages.newKeywordValueTextFieldPlaceholder) : intl.formatMessage(messages.newKeywordRegexTextFieldPlaceholder)}
                      onChange={(evt) => { this.props.onChangeExampleName(exampleIndex, evt.target.value) }}
                      margin='normal'
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid className={classes.keywordValueInputContainer} item xs={9}>
                    <ChipInput
                      defaultValue={Immutable.asMutable(example.synonyms, {deep:true})}
                      onChange={(synonyms) => { this.props.onChangeExampleSynonyms(exampleIndex, synonyms) } }
                      fullWidth
                      disableUnderline
                      classes={{
                        root: exampleIndex !== 0 ? classes.chipInputRoot : classes.chipInputRootFirst,
                        chipContainer: classes.chipContainer,
                        inputRoot: classes.inputRoot,
                        chip: classes.chip,
                        input: classes.chipInput,
                      }}
                      onDeleteAll={() => {
                        this.props.onDeleteKeywordExample(exampleIndex);
                      }}
                    />
                  </Grid>
                </Grid>
              ))}
              <Grid container justify='space-between' spacing={24} item xs={12}>
                <Grid className={classes.keywordValueInputContainer} item xs={3}>
                  <TextField
                    id='newExampleValue'
                    label={keyword.examples.length === 0 ? intl.formatMessage(messages.newKeywordValueTextField) : null}
                    value={this.state.newKeyword}
                    className={classes.keywordValueInput}
                    placeholder={keyword.type === 'learned' ? intl.formatMessage(messages.newKeywordValueTextFieldPlaceholder) : intl.formatMessage(messages.newKeywordRegexTextFieldPlaceholder)}
                    onKeyPress={(evt) => {
                      if(evt.key === 'Enter'){
                        evt.preventDefault();
                        this.setState({
                          newKeyword: '',
                          lastExampleEdited: true
                        });
                        this.props.onAddKeywordExample({ value: evt.target.value, synonyms: [evt.target.value] });
                      }
                    }}
                    onChange={(evt) => {
                      this.setState({
                        newKeyword: evt.target.value,
                      });
                    }}
                    margin='normal'
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    className={keyword.examples.length !== 0 ? classes.keywordValueInput : ''}
                    helperText={this.props.errorState.keywordName ? intl.formatMessage(messages.keywordValuesError) : ''}
                    error={this.props.errorState.examples}
                  />
                </Grid>
                  <div
                    ref={(el) => {
                      this.lastExample = el;
                    }}
                  >
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

ValuesForm.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  keyword: PropTypes.object,
  onChangeKeywordData: PropTypes.func.isRequired,
  onAddKeywordExample: PropTypes.func,
  onDeleteKeywordExample: PropTypes.func,
  onChangeExampleSynonyms: PropTypes.func,
  onChangeExampleName: PropTypes.func, 
  errorState: PropTypes.object,
};

export default injectIntl(withStyles(styles)(ValuesForm));
