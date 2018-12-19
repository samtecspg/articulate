import React from "react";
import { FormattedMessage, injectIntl, intlShape } from "react-intl";

import PropTypes from "prop-types";
import { Grid, Hidden, Tabs, Tab, Typography, Icon, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import TrainButton from 'components/TrainButton';

import messages from "./messages";

import agentIcon from '../../images/agents-icon.svg';
import vDivider from '../../images/v-divider.svg';
import sayingsIcon from '../../images/sayings-icon.svg';
import keywordsIcon from '../../images/keywords-icon.svg';

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
  agentTab: {
    paddingLeft: '20px',
    paddingRight: '20px',
    minWidth: 'fit-content'
  },
  icon: {
    height: '18px',
    paddingRight: '5px',
  },
  vDividerIconTab: {
    minWidth: '25px',
  },
  vDividerIcon: {
    height: '12px',
  },
  subtitle: {
    paddingLeft: '5px',
    color: '#4e4e4e',
  },
  actionsContainer: {
    display: 'inline',
  },
  actionContainer: {
    marginLeft: '5px',
    display: 'inline',
    float: 'right',
  },
  buttonContainer: {
    position: 'relative',
    bottom: '5px',
  },
  icon: {
    padding: '0px 10px',
    cursor: 'pointer',
  },
  button: {
    display: 'inline',
  },
};

/* eslint-disable react/prefer-stateless-function */
export class MainTab extends React.Component {

  state = {
    selectedTab: this.props.selectedTab,
  };

  handleChange = (event, value) => {
    this.setState({
      selectedTab: value,
    });
  };

  render() {
    const { classes, intl, enableTabs, agentStatus, lastTraining, onTrain, newAgent, disableSave  } = this.props;
    return (
      <Grid container className={classes.mainTabContainer}>
        <Hidden only={['sm', 'xs']}>
          <Grid container justify='space-between'>
            <Grid>
              <Tabs
                fullWidth={true}
                className={classes.tabs}
                value={this.state.selectedTab}
                indicatorColor='primary'
                textColor='secondary'
                scrollable
                scrollButtons="off"
                onChange={(evt, value) => { this.handleChange(evt, value)}}
              >
                {this.props.agentURL ?
                  <Tab value="agents" className={classes.agentTab} icon={<img className={classes.icon} src={agentIcon} />} label={<span><span>{intl.formatMessage(messages.agent)}</span><Typography className={classes.subtitle} variant='h1'>{newAgent ? <FormattedMessage { ...messages.createSubtitle } /> : this.props.agentName}</Typography></span>} component={this.props.agentForm} to={this.props.agentURL} /> :
                  <Tab value="agents" className={classes.agentTab} icon={<img className={classes.icon} src={agentIcon} />} label={<span><span>{intl.formatMessage(messages.agent)}</span><Typography className={classes.subtitle} variant='h1'>{newAgent ? <FormattedMessage { ...messages.createSubtitle } /> : this.props.agentName}</Typography></span>} />}
                <Tab className={classes.vDividerIconTab} icon={<img className={classes.vDividerIcon} src={vDivider} />} disabled />
                {this.props.sayingsURL ?
                  <Tab value="sayings" className={classes.tab} icon={<img className={classes.icon} src={sayingsIcon} />} label={intl.formatMessage(messages.sayings)} component={this.props.sayingsForm} to={this.props.sayingsURL} disabled={!enableTabs} /> :
                  <Tab value="sayings" className={classes.tab} icon={<img className={classes.icon} src={sayingsIcon} />} label={intl.formatMessage(messages.sayings)} disabled={!enableTabs} />}
                {this.props.keywordsURL?
                  <Tab value="keywords" className={classes.tab} icon={<img className={classes.icon} src={keywordsIcon} />} label={intl.formatMessage(messages.keywords)} component={this.props.keywordsForm} to={this.props.keywordsURL} disabled={!enableTabs} /> :
                  <Tab value="keywords" className={classes.tab} icon={<img className={classes.icon} src={keywordsIcon} />} label={intl.formatMessage(messages.keywords)} disabled={!enableTabs} />}
              </Tabs>
            </Grid>
            <Grid className={classes.actionsContainer}>
              { newAgent ? null :
                <TrainButton
                  agentStatus={agentStatus}
                  lastTraining={lastTraining}
                  onTrain={onTrain}
                />
              }
              {
                disableSave ? null :
                <Grid item className={classes.actionContainer}>
                  <Hidden only={['xl', 'lg', 'md']}>
                    <a onClick={this.props.onFinishAction} className={`${classes.icon} ${classes.link}`}>
                      <Icon>save</Icon>
                    </a>
                  </Hidden>
                  <Hidden only={['sm', 'xs']}>
                    <Grid className={classes.buttonContainer}>
                      <Button style={{color: this.props.formError ? '#f44336' : ''}} onClick={this.props.onFinishAction} key='btnFinish' variant='contained'>
                        <FormattedMessage {...messages.finishButton} />
                      </Button>
                    </Grid>
                  </Hidden>
                </Grid>
              }
            </Grid>
          </Grid>
          {
            !this.props.agentURL ?
              this.state.selectedTab === 'agents' ?
                (this.props.agentForm) : null
              : null
          }
          {
            !this.props.sayingsURL ?
              this.state.selectedTab === 'sayings' ?
                (this.props.sayingsForm) : null
              : null
          }
          {
            !this.props.keywordsURL ?
              this.state.selectedTab === 'keywords' ?
                (this.props.keywordsForm) : null
              : null
          }
        </Hidden>
        <Hidden only={['xl', 'lg', 'md']}>
          <Grid container justify='space-between'>
            <Grid>
              <Tabs
                className={classes.tabs}
                value={this.state.selectedTab}
                indicatorColor='primary'
                textColor='secondary'
                scrollable
                scrollButtons="off"
                onChange={(evt, value) => { this.handleChange(evt, value)}}
              >
                {this.props.agentURL ?
                  <Tab value="agents" className={classes.tab} icon={<img className={classes.icon} src={agentIcon} />} component={this.props.agentForm} to={this.props.agentURL} /> :
                  <Tab value="agents" className={classes.tab} icon={<img className={classes.icon} src={agentIcon} />} />}
                <Tab className={classes.vDividerIconTab} icon={<img className={classes.vDividerIcon} src={vDivider} />} disabled />
                {this.props.sayingsURL ?
                  <Tab value="sayings" className={classes.tab} icon={<img className={classes.icon} src={sayingsIcon} />} component={this.props.sayingsForm} to={this.props.sayingsURL} disabled={!enableTabs} /> :
                  <Tab value="sayings" className={classes.tab} icon={<img className={classes.icon} src={sayingsIcon} />} disabled={!enableTabs} />}
                {this.props.keywordsURL?
                  <Tab value="keywords" className={classes.tab} icon={<img className={classes.icon} src={keywordsIcon} />} component={this.props.keywordsForm} to={this.props.keywordsURL} disabled={!enableTabs} /> :
                  <Tab value="keywords" className={classes.tab} icon={<img className={classes.icon} src={keywordsIcon} />} disabled={!enableTabs} />}
              </Tabs>
            </Grid>
            <Grid className={classes.actionsContainer}>
              { newAgent ? null :
                <TrainButton
                  agentStatus={agentStatus}
                  lastTraining={lastTraining}
                  onTrain={onTrain}
                />
              }
              <Grid item className={classes.actionContainer}>
                <Hidden only={['xl', 'lg', 'md']}>
                  <a onClick={this.props.onFinishAction} className={`${classes.icon} ${classes.link}`}>
                    <Icon>save</Icon>
                  </a>
                </Hidden>
                <Hidden only={['sm', 'xs']}>
                  <Grid className={classes.buttonContainer}>
                    <Button style={{color: this.props.formError ? '#f44336' : ''}} onClick={this.props.onFinishAction} key='btnFinish' variant='contained'>
                      <FormattedMessage {...messages.finishButton} />
                    </Button>
                  </Grid>
                </Hidden>
              </Grid>
            </Grid>
          </Grid>
          {
            !this.props.agentURL ?
              this.state.selectedTab === 'agents' ?
                (this.props.agentForm) : null
              : null
          }
          {
            !this.props.sayingsURL ?
              this.state.selectedTab === 'sayings' ?
                (this.props.sayingsForm) : null
              : null
          }
          {
            !this.props.keywordsURL ?
              this.state.selectedTab === 'keywords' ?
                (this.props.keywordsForm) : null
              : null
          }
        </Hidden>
      </Grid>
    );
  }
}

MainTab.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  enableTabs: PropTypes.bool,
  selectedTab: PropTypes.string,
  agentForm: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
  ]),
  agentURL: PropTypes.string,
  sayingsForm: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
  ]),
  sayingsURL: PropTypes.string,
  keywordsForm: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
  ]),
  keywordsURL: PropTypes.string,
  agentName: PropTypes.string,
  onFinishAction: PropTypes.func.isRequired,
  onTrain: PropTypes.func,
  agentStatus: PropTypes.string,
  lastTraining: PropTypes.string,
  formError: PropTypes.bool,
  newAgent: PropTypes.bool,
  disableSave: PropTypes.bool,
};

export default injectIntl(withStyles(styles)(MainTab));
