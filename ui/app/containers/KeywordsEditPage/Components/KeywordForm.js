import { Button, Grid, MenuItem, Modal, TextField, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import ColorPicker from '../../../components/ColorPicker';
import DeleteFooter from '../../../components/DeleteFooter';
import playHelpIcon from '../../../images/play-help-icon.svg';
import messages from '../messages';

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
    boxShadow: '0px 3px 5px -1px rgba(0, 0, 0, 0.2),0px 5px 8px 0px rgba(0, 0, 0, 0.14),0px 1px 14px 0px rgba(0, 0, 0, 0.12)',
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
  uiColorLabel: {
    marginTop: '13px',
    marginBottom: '10px',
    color: '#a2a7b1',
    fontWeight: 400,
    fontSize: '12px',
  },
};

/* eslint-disable react/prefer-stateless-function */
class KeywordForm extends React.Component {
  state = {
    openModal: false,
    displayColorPicker: false,
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
    const { classes, intl, keyword, isReadOnly } = this.props;
    return (
      <Grid className={classes.headerContainer} container item xs={12}>
        <Grid className={classes.titleContainer} item xs={12}>
          <Grid className={classes.titleTextHelpContainer} container>
            <Typography className={classes.title} variant="h2">
              <FormattedMessage {...messages.keywordFormTitle} />
            </Typography>
            <Button className={classes.helpButton} variant="outlined" onClick={this.handleOpen}>
              <img className={classes.playIcon} src={playHelpIcon} alt={intl.formatMessage(messages.playHelpAlt)} />
              <span className={classes.helpText}>
                <FormattedMessage {...messages.help} />
              </span>
            </Button>
            <Modal open={this.state.openModal} onClose={this.handleClose}>
              <Grid className={classes.modalContent} container>
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/Gus06Z1-cNw"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </Grid>
            </Modal>
          </Grid>
          <Grid className={classes.formDescriptionContainer} container>
            <Typography className={classes.formDescription}>
              <FormattedMessage {...messages.keywordFormDescription} />
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid className={classes.formContainer} container item xs={12}>
            <Grid className={classes.formSubContainer} id="formContainer" container item xs={12}>
              <Grid container spacing={24} item xs={12}>
                <Grid item md={9} sm={8} xs={12}>
                  <TextField
                    disabled={isReadOnly}
                    id="keywordName"
                    label={intl.formatMessage(messages.keywordNameTextField)}
                    value={keyword.keywordName}
                    placeholder={intl.formatMessage(messages.keywordNameTextFieldPlaceholder)}
                    onChange={evt => {
                      this.props.onChangeKeywordData('keywordName', evt.target.value);
                    }}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    helperText={intl.formatMessage(messages.requiredField)}
                    error={this.props.errorState.keywordName}
                  />
                </Grid>
                <Grid item md={3} sm={4} xs={12}>
                  <Typography className={classes.uiColorLabel}>
                    <FormattedMessage {...messages.uiColorLabel} />
                  </Typography>
                  <ColorPicker
                    disabled={isReadOnly}
                    isKeyword
                    handleClose={() => {
                      this.setState({
                        displayColorPicker: false,
                      });
                    }}
                    handleOpen={() => {
                      this.setState({
                        displayColorPicker: true,
                      });
                    }}
                    handleColorChange={color => {
                      this.setState({ displayColorPicker: false });
                      this.props.onChangeKeywordData('uiColor', color.hex);
                    }}
                    color={keyword.uiColor}
                    displayColorPicker={this.state.displayColorPicker}
                  />
                </Grid>
              </Grid>
              <Grid container justify="space-between" spacing={24} item xs={12}>
                <Grid item lg={6} md={12} sm={12} xs={12}>
                  <TextField
                    disabled={isReadOnly}
                    select
                    id="type"
                    value={keyword.type}
                    label={intl.formatMessage(messages.typeSelect)}
                    onChange={evt => {
                      this.props.onChangeKeywordData('type', evt.target.value);
                    }}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    helperText={intl.formatMessage(messages.requiredField)}
                  >
                    <MenuItem key="learned" value="learned">
                      <FormattedMessage {...messages.learned} />
                    </MenuItem>
                    <MenuItem key="regex" value="regex">
                      <FormattedMessage {...messages.regex} />
                    </MenuItem>
                  </TextField>
                </Grid>
                <Grid item lg={6} md={12} sm={12} xs={12}>
                  <TextField
                    disabled={isReadOnly}
                    id="regex"
                    label={intl.formatMessage(messages.regexTextField)}
                    value={keyword.regex}
                    placeholder={intl.formatMessage(messages.regexTextFieldPlaceholder)}
                    onChange={evt => {
                      this.props.onChangeKeywordData('regex', evt.target.value);
                    }}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {this.props.newKeyword || isReadOnly ? null : <DeleteFooter onDelete={this.props.onDelete} type={intl.formatMessage(messages.instanceName)} />}
      </Grid>
    );
  }
}

KeywordForm.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  keyword: PropTypes.object,
  onChangeKeywordData: PropTypes.func,
  errorState: PropTypes.object,
  onDelete: PropTypes.func,
  newKeyword: PropTypes.bool,
  isReadOnly: PropTypes.bool,
};

KeywordForm.defaultProps = {
  isReadOnly: false,
};
export default injectIntl(withStyles(styles)(KeywordForm));
