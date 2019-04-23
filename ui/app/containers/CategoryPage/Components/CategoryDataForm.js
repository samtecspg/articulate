import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import PropTypes from 'prop-types';
import { Grid, TextField, Typography, FormControlLabel, Switch, Icon, Tooltip } from '@material-ui/core';
import Slider from '@material-ui/lab/Slider'
import { withStyles } from '@material-ui/core/styles';


import messages from '../messages';

const styles = {
  formContainer: {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #c5cbd8',
    borderBottomLeftRadius: '5px',
    borderBottomRightRadius: '5px',
  },
  formSubContainer: {
    padding: '40px 25px',
  },
  categoryValueInputContainer: {
    padding: '0px 12px !important',
  },
  categoryValueInput: {
    marginTop: '0px',
  },
  sliderLabel: {
    paddingTop: '20px',
    fontSize: '12px',
    color: '#a2a7b1',
  },
  sliderTextField: {
    width: '100%',
  },
  spanLabelExamples: {
    position: 'relative',
    bottom: '2px',
  },
  infoIcon: {    
    color: '#4e4e4e',
    position: 'relative',
    top: '4px',
    left: '2px',
    fontSize: '18px'
  }
};

/* eslint-disable react/prefer-stateless-function */
class CategoryDataForm extends React.Component {

    state = {
      newCategory: '',
      newSyonynm: '',
      displayColorPicker: false,
    };

    handleOpen = () => {
      this.setState({
        displayColorPicker: true,
      });
    };

    handleClose = () => {
      this.setState({
        displayColorPicker: false,
      });
    };

    render(){
      const { classes, intl, category } = this.props;
      return (
        <Grid className={classes.formContainer} container item xs={12}>
          <Grid className={classes.formSubContainer} id='formContainer' container item xs={12}>
            <Grid container spacing={24} item xs={12}>
              <Grid item md={6} sm={12}>
                <TextField
                  id='categoryName'
                  label={intl.formatMessage(messages.categoryNameTextField)}
                  value={category.categoryName}
                  placeholder={intl.formatMessage(messages.categoryNameTextFieldPlaceholder)}
                  onChange={(evt) => { this.props.onChangeCategoryData('categoryName', evt.target.value) }}
                  margin='normal'
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  helperText={intl.formatMessage(messages.requiredField)}
                  error={this.props.errorState.categoryName}
                />
              </Grid>
              <Grid item lg={4} md={10} sm={9} xs={8}>
                <Typography className={classes.sliderLabel} id='actionThreshold'>
                  <FormattedMessage {...messages.sliderActionThresholdLabel} />
                </Typography>
                <Slider
                  style={{
                    position: 'relative',
                    top: '10px'
                  }}
                  value={category.actionThreshold}
                  min={0}
                  max={100}
                  step={1}
                  aria-labelledby='actionThreshold'
                  onChange={(evt, value) => { this.props.onChangeActionThreshold(value) }} />
              </Grid>
              <Grid item lg={2} md={2} sm={3} xs={4}>
                <TextField
                  id='name'
                  margin='normal'
                  value={category.actionThreshold}
                  onChange={(evt) => {
                    evt.target.value === '' ?
                      this.props.onChangeActionThreshold(0) :
                      (evt.target.value <= 100 && evt.target.value >= 0 ?
                        this.props.onChangeActionThreshold(evt.target.value) :
                        false) }}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    style: {
                      textAlign: 'center',
                    },
                    min: 0,
                    max: 100,
                    step: 1,
                  }}
                  className={classes.sliderTextField}
                  helperText={intl.formatMessage(messages.requiredField)}
                  type='number'
                />
              </Grid>
            </Grid>
            <Grid container spacing={24} item xs={12}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={category.extraTrainingData}
                      onChange={() => {
                        this.props.onChangeCategoryData(
                          "extraTrainingData",
                          !category.extraTrainingData
                        );
                      }}
                      value="extraTrainingData"
                      color="primary"
                    />
                  }
                  label={<span className={classes.spanLabelExamples}>{intl.formatMessage(messages.extraTrainingData)}<Tooltip placement='top' title={intl.formatMessage(messages.extraTrainingDataHelp)}><Icon className={classes.infoIcon}>info</Icon></Tooltip></span>}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      );
    }
}

CategoryDataForm.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  category: PropTypes.object,
  onChangeCategoryData: PropTypes.func.isRequired,
  onChangeActionThreshold: PropTypes.func,
  errorState: PropTypes.object,
};

export default injectIntl(withStyles(styles)(CategoryDataForm));
