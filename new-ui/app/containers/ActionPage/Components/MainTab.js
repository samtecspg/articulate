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
    const { classes, intl, newAction } = this.props;
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
                <Tab value="action" className={classes.tab} label={<span><span>{intl.formatMessage(messages.action)}</span><span className={classes.subtitle}>{newAction ? <FormattedMessage { ...messages.createSubtitle } /> : this.props.actionName}</span></span>} />
                <Tab value="slots" className={classes.tab} label={intl.formatMessage(messages.slots)} />
                <Tab value="webhook" className={classes.tab} label={intl.formatMessage(messages.webhook)} />
                <Tab value="response" className={classes.tab} label={intl.formatMessage(messages.response)} />
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
            this.props.selectedTab === 'action' ?
              (this.props.actionForm) : null
          }
          {
            this.props.selectedTab === 'slots' ?
              (this.props.slotsForm) : null
          }
          {
            this.props.selectedTab === 'webhook' ?
              (this.props.webhookForm) : null
          }
          {
            this.props.selectedTab === 'response' ?
              (this.props.responseForm) : null
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
                <Tab value="action" icon={<Icon>play_arrow</Icon>} className={classes.tab} />
                <Tab value="slots" icon={<Icon>list</Icon>} className={classes.tab} />
                <Tab value="webhook" icon={<Icon>http</Icon>} className={classes.tab} />
                <Tab value="response" icon={<Icon>comment</Icon>} className={classes.tab} />
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
            this.props.selectedTab === 'action' ?
              (this.props.actionForm) : null
          }
          {
            this.props.selectedTab === 'slots' ?
              (this.props.slotsForm) : null
          }
          {
            this.props.selectedTab === 'webhook' ?
              (this.props.webhookForm) : null
          }
          {
            this.props.selectedTab === 'response' ?
              (this.props.responseForm) : null
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
  actionForm: PropTypes.node,
  slotsForm: PropTypes.node,
  webhookForm: PropTypes.node,
  responseForm: PropTypes.node,
  onChangeTab: PropTypes.func,
  onFinishAction: PropTypes.func.isRequired,
  onNextAction: PropTypes.func.isRequired,
  hideFinishButton: PropTypes.bool,
  isLastTab: PropTypes.bool,
  formError: PropTypes.bool,
  actionName: PropTypes.string,
  goBack: PropTypes.func,
  newAction: PropTypes.bool,
};

export default injectIntl(withStyles(styles)(MainTab));
