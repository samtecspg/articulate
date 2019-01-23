import React from "react";
import { FormattedMessage, injectIntl, intlShape } from "react-intl";

import PropTypes from "prop-types";
import { Grid, Hidden, Tabs, Tab, Icon, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import messages from "../messages";

const styles = {
  mainTabContainer: {
    marginTop: '45px',
  },
  tabs: {
    paddingLeft: '15px',
  },
  tab: {
    paddingLeft: '20px',
    paddingRight: '20px',
  },
  subtitle: {
    paddingLeft: '5px',
    color: '#4e4e4e',
    fontWeight: 'bold',
  },
  container: {
    display: 'inline',
    float: 'right',
  },
  buttonContainer: {
    position: 'relative',
    bottom: '10px',
  },
  icon: {
    padding: '0px 10px',
    cursor: 'pointer',
  },
  link: {
    color: '#4e4e4e',
    textDecoration: 'none',
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
  backButtonContainer: {
    display: 'inline',
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
  }
};

/* eslint-disable react/prefer-stateless-function */
export class MainTab extends React.Component {

  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (value) => {
    this.props.onChangeTab(value);
  };

  render() {
    const { classes, intl, newKeyword } = this.props;
    return (
      <Grid container className={classes.mainTabContainer}>
        <Hidden only={['sm', 'xs']}>
          <Grid container justify='space-between'>
            <Grid className={classes.tabsContainer}>
              <Tabs
                className={classes.tabs}
                value={this.props.selectedTab}
                indicatorColor='primary'
                textColor='secondary'
                scrollable
                scrollButtons="off"
                onChange={(evt, value) => { this.handleChange(value)}}
              >
                <Tab value="keyword"
                  className={classes.tab}
                  label={
                    <span>
                      <span>
                        {intl.formatMessage(messages.keyword)}
                      </span>
                      <span className={classes.subtitle}>
                        {newKeyword && this.props.keywordName === '' ? 
                          <FormattedMessage { ...messages.createSubtitle } /> : 
                          this.props.keywordName ? this.props.keywordName : intl.formatMessage(messages.noName)}
                      </span>
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
                <Tab value="values"
                  className={classes.tab}
                  label={intl.formatMessage(messages.values)}
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
                <Tab value="modifiers"
                  className={classes.tab}
                  label={intl.formatMessage(messages.modifiers)}
                  icon={
                    this.props.errorState.tabs.indexOf(2) > -1 ? 
                      <div id='notificationDot' className={classes.notificationDot}>
                        <span className={classes.numOfErrorsLabel}>
                          {(this.props.errorState.tabs.filter((element) => { return element === 2 })).length}
                        </span>
                      </div> : 
                      null
                  }
                  disabled={!newKeyword}
                />
              </Tabs>
            </Grid>
            <Grid className={classes.container}>
              <Hidden only={['xl', 'lg', 'md']}>
                <Grid className={classes.buttonContainer}>
                  <Grid className={classes.backButtonContainer}>
                    <span className={classes.backArrow} onClick={this.props.goBack} key='backArrow'>{'< '}</span>
                    <a key='backLink' className={classes.backButton} onClick={this.props.goBack}>
                      <FormattedMessage {...messages.backButton} />
                    </a>
                  </Grid>
                  <a style={{color: this.props.formError ? '#f44336' : ''}} onClick={this.props.onFinishAction} className={`${classes.icon} ${classes.link}`}>
                    <Icon>save</Icon>
                  </a>
                </Grid>
              </Hidden>
              <Hidden only={['sm', 'xs']}>
                <Grid className={classes.buttonContainer}>
                  <Grid className={classes.backButtonContainer}>
                    <span className={classes.backArrow} onClick={this.props.goBack} key='backArrow'>{'< '}</span>
                    <a key='backLink' className={classes.backButton} onClick={this.props.goBack}>
                      <FormattedMessage {...messages.backButton} />
                    </a>
                  </Grid>
                  <Button style={{color: this.props.formError ? '#f44336' : ''}} onClick={this.props.onFinishAction} key='btnFinish' variant='contained'>
                    <FormattedMessage {...messages.finishButton} />
                  </Button>
                </Grid>
              </Hidden>
            </Grid>
          </Grid>
          {
            this.props.selectedTab === 'keyword' ?
              (this.props.keywordForm) : null
          }
          {
            this.props.selectedTab === 'values' ?
              (this.props.valuesForm) : null
          }
          {
            this.props.selectedTab === 'modifiers' ?
              (this.props.modifiersForm) : null
          }
        </Hidden>
        <Hidden only={['xl', 'lg', 'md']}>
          <Grid container justify='space-between'>
            <Grid>
              <Tabs
                className={classes.tabs}
                value={this.props.selectedTab}
                indicatorColor='primary'
                textColor='secondary'
                scrollable
                scrollButtons="off"
                onChange={(evt, value) => { this.handleChange(value)}}
              >
                <Tab value="keyword" icon={<Icon>play_arrow</Icon>} className={classes.tab} />
                <Tab value="values" icon={<Icon>list</Icon>} className={classes.tab} />
                <Tab value="modifiers" icon={<Icon>comment</Icon>} className={classes.tab} disabled={!newKeyword} />
              </Tabs>
            </Grid>
            <Grid className={classes.container}>
              <Hidden only={['xl', 'lg', 'md']}>
                {this.props.hideFinishButton ?
                  (
                    <a key='btnNext' onClick={this.props.onNextAction} className={`${classes.icon} ${classes.link}`}>
                      <Icon>arrow_forward</Icon>
                    </a>
                  )
                  :
                  (
                    this.props.isLastTab ?
                      <a style={{color: this.props.formError ? '#f44336' : ''}} onClick={this.props.onFinishAction} className={`${classes.icon} ${classes.link}`}>
                        <Icon>save</Icon>
                      </a>
                      :
                      [<a style={{color: this.props.formError ? '#f44336' : ''}} key='btnFinish' onClick={this.props.onFinishAction} className={`${classes.icon} ${classes.link}`}>
                        <Icon>save</Icon>
                      </a>,
                      <a key='btnNext' onClick={this.props.onNextAction} className={`${classes.icon} ${classes.link}`}>
                        <Icon>arrow_forward</Icon>
                      </a>]
                  )
                }
              </Hidden>
              <Hidden only={['sm', 'xs']}>
                <Grid className={classes.buttonContainer}>
                  {this.props.hideFinishButton ?
                    (
                      <Button onClick={this.props.onNextAction} key='btnNext' variant='contained'>
                        <FormattedMessage {...messages.nextButton} />
                      </Button>
                    )
                    :
                    (
                      this.props.isLastTab ?
                        <Button style={{color: this.props.formError ? '#f44336' : ''}} onClick={this.props.onFinishAction} key='btnFinish' variant='contained'>
                          <FormattedMessage {...messages.finishButton} />
                        </Button>
                        :
                        [<Button style={{color: this.props.formError ? '#f44336' : ''}} onClick={this.props.onFinishAction} key='btnFinish'>
                          <FormattedMessage {...messages.finishButton} />
                        </Button>,
                        <Button onClick={this.props.onNextAction} key='btnNext' variant='contained'>
                          <FormattedMessage {...messages.nextButton} />
                        </Button>]
                    )
                  }
                </Grid>
              </Hidden>
            </Grid>
          </Grid>
          {
            this.props.selectedTab === 'keyword' ?
              (this.props.keywordForm) : null
          }
          {
            this.props.selectedTab === 'values' ?
              (this.props.valuesForm) : null
          }
          {
            this.props.selectedTab === 'modifiers' ?
              (this.props.modifiersForm) : null
          }
        </Hidden>
      </Grid>
    );
  }
}

MainTab.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  selectedTab: PropTypes.string,
  keywordForm: PropTypes.node,
  valuesForm: PropTypes.node,
  modifiersForm: PropTypes.node,
  onChangeTab: PropTypes.func,
  onFinishAction: PropTypes.func.isRequired,
  onNextAction: PropTypes.func.isRequired,
  hideFinishButton: PropTypes.bool,
  isLastTab: PropTypes.bool,
  formError: PropTypes.bool,
  keywordName: PropTypes.string,
  goBack: PropTypes.func,
  newKeyword: PropTypes.bool,
  errorState: PropTypes.object
};

export default injectIntl(withStyles(styles)(MainTab));
