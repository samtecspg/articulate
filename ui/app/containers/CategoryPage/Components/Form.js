import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import PropTypes from 'prop-types';
import { Grid, Typography, Button, Modal, Tabs, Tab } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import messages from '../messages';

import playHelpIcon from '../../../images/play-help-icon.svg';

import CategoryDataForm from './CategoryDataForm';
import CategoryParametersForm from './CategoryParametersForm';
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
  agentTabs: {
    paddingLeft: '5px',
  },
  modalContent: {
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%)`,
    position: 'absolute',
    width: window.window.innerWidth < 675 ? 350 : 600,
    height: window.window.innerWidth < 675 ? 215 : 375,
    backgroundColor: '#fff',
    boxShadow:
      '0px 3px 5px -1px rgba(0, 0, 0, 0.2),0px 5px 8px 0px rgba(0, 0, 0, 0.14),0px 1px 14px 0px rgba(0, 0, 0, 0.12)',
  },
  searchForm: {
    display: 'inline',
    paddingLeft: '25px',
  },
  searchInputField: {
    width: '250px',
    paddingLeft: '5px',
    fontSize: '14px',
  },
  formDescriptionContainer: {
    margin: '15px 0px',
  },
  formDescription: {
    fontSize: '14px',
    fontWeight: 300,
  },
  categoryTabs: {
    paddingLeft: "5px",
  },
  tabLabel: {
    padding: '0px 10px',
  },
  notificationDot: {
    backgroundColor: '#Cb2121',
    height: '12px',
    width: '12px',
    borderRadius: '50%',
    position: 'absolute',
    top: '10px',
    left: '5px'
  },
  numOfErrorsLabel: {
    fontSize: '10px',
    color: 'white',
    position: 'relative',
    bottom: '4.5px',
    left: '0.5px'
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
          <Grid className={classes.titleTextHelpContainer} container>
            <Typography className={classes.title} variant='h2'>
              <FormattedMessage {...messages.formTitle} />
            </Typography>
            <Button
              className={classes.helpButton}
              variant='outlined'
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
                  src='https://www.youtube.com/watch?v=WoZkMN0m1oA'
                  frameBorder='0'
                  allow='autoplay; encrypted-media'
                  allowFullScreen
                />
              </Grid>
            </Modal>
          </Grid>
          <Grid className={classes.formDescriptionContainer} container>
            <Typography className={classes.formDescription}>
              <FormattedMessage {...messages.categoryEditDescription} />
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Tabs
            className={classes.categoryTabs}
            value={this.state.selectedTab}
            indicatorColor="primary"
            textColor="secondary"
            scrollable
            scrollButtons="off"
            onChange={(evt, value) => {
              this.handleChange(evt, value);
            }}
          >
            <Tab 
              label={
                <span className={classes.tabLabel}>
                  <span>{intl.formatMessage(messages.main)}</span>
                </span>
              }	
              icon={
                this.props.errorState.tabs.indexOf(0) > -1 ? 
                  <div id='notificationDot' className={classes.notificationDot}>
                    <span className={classes.numOfErrorsLabel}>
                      {(this.props.errorState.tabs.filter((element) => { return element === 0 })).length}
                    </span>
                  </div> : 
                  null
              }
            />
            <Tab 
              label={
                <span className={classes.tabLabel}>
                  <span>{intl.formatMessage(messages.parameters)}</span>
                </span>
              }
              icon={
                this.props.errorState.tabs.indexOf(1) > -1 ? 
                  <div id='notificationDot' className={classes.notificationDot}>
                    <span className={classes.numOfErrorsLabel}>
                      {(this.props.errorState.tabs.filter((element) => { return element === 1 })).length}
                    </span>
                  </div> : 
                  null
              }
            />
          </Tabs>
          {this.state.selectedTab === 0 && (
            <CategoryDataForm
              category={this.props.category}
              onChangeCategoryData={this.props.onChangeCategoryData}
              onChangeActionThreshold={this.props.onChangeActionThreshold}
              errorState={this.props.errorState}
            />
          )}
          {this.state.selectedTab === 1 && (
            <CategoryParametersForm
              category={this.props.category}
              errorState={this.props.errorState}
              onAddNewParameter={this.props.onAddNewParameter}
              onDeleteParameter={this.props.onDeleteParameter}
              onChangeParameterName={this.props.onChangeParameterName}
              onChangeParameterValue={this.props.onChangeParameterValue}
            />
          )}
        </Grid>
        {this.props.newCategory ? null : 
          <DeleteFooter
            onDelete={this.props.onDelete}
            type={intl.formatMessage(messages.instanceName)}
          />
        }
      </Grid>
    );
  }
}

Form.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  category: PropTypes.object,
  onChangeCategoryData: PropTypes.func.isRequired,
  onChangeActionThreshold: PropTypes.func,
  errorState: PropTypes.object,
  onDelete: PropTypes.func,
  newCategory: PropTypes.bool,
  onAddNewParameter: PropTypes.func,
  onDeleteParameter: PropTypes.func,
  onChangeParameterName: PropTypes.func,
  onChangeParameterValue: PropTypes.func,
};

export default injectIntl(withStyles(styles)(Form));
