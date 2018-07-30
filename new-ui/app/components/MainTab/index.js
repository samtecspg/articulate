import React from "react";
import { injectIntl, intlShape } from "react-intl";

import PropTypes from "prop-types";
import { Grid, Hidden, Tabs, Tab } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import messages from "./messages";

import agentIcon from '../../images/agents-icon.svg';
import vDivider from '../../images/v-divider.svg';
import sayingsIcon from '../../images/sayings-icon.svg';
import keywordsIcon from '../../images/keywords-icon.svg';

const styles = {
  tabs: {
    paddingLeft: '15px'
  },
  tab: {
    paddingLeft: '20px',
    paddingRight: '20px'
  },
  icon: {
    height: '18px',
    paddingRight: '5px'
  },
  vDividerIconTab: {
    minWidth: '25px'
  },
  vDividerIcon: {
    height: '12px'
  }
}

/* eslint-disable react/prefer-stateless-function */
export class MainTab extends React.Component {

  state = {
    selectedTab: this.props.selectedTab,
  };

  handleChange = (event, value) => {
    this.setState({
      selectedTab: value
    });
  };

  render() {
    const { classes, intl, enableTabs } = this.props;
    return (
      <Grid container>
        <Hidden only={['sm', 'xs']}>
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
            <Tab value={'agents'} className={classes.tab} icon={<img className={classes.icon} src={agentIcon} />} label={intl.formatMessage(messages.agents)} component={this.props.agentForm} to={this.props.agentURL} /> :
            <Tab value={'agents'} className={classes.tab} icon={<img className={classes.icon} src={agentIcon} />} label={intl.formatMessage(messages.agents)} />}
            <Tab className={classes.vDividerIconTab} icon={<img className={classes.vDividerIcon} src={vDivider} />} disabled />
            {this.props.sayingsURL ?
            <Tab value={'sayings'} className={classes.tab} icon={<img className={classes.icon} src={sayingsIcon} />} label={intl.formatMessage(messages.sayings)} component={this.props.sayingsForm} to={this.props.sayingsURL} disabled={!enableTabs} /> :
            <Tab value={'sayings'} className={classes.tab} icon={<img className={classes.icon} src={sayingsIcon} />} label={intl.formatMessage(messages.sayings)} disabled={!enableTabs} />}
            {this.props.keywordsURL?
            <Tab value={'keywords'} className={classes.tab} icon={<img className={classes.icon} src={keywordsIcon} />} label={intl.formatMessage(messages.keywords)} component={this.props.keywordsForm} to={this.props.keywordsURL} disabled={!enableTabs} /> :
            <Tab value={'keywords'} className={classes.tab} icon={<img className={classes.icon} src={keywordsIcon} />} label={intl.formatMessage(messages.keywords)} disabled={!enableTabs} />}
          </Tabs>
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
            <Tab value={'agents'} className={classes.tab} icon={<img className={classes.icon} src={agentIcon} />} component={this.props.agentForm} to={this.props.agentURL} /> :
            <Tab value={'agents'} className={classes.tab} icon={<img className={classes.icon} src={agentIcon} />} />}
            <Tab className={classes.vDividerIconTab} icon={<img className={classes.vDividerIcon} src={vDivider} />} disabled />
            {this.props.sayingsURL ?
            <Tab value={'sayings'} className={classes.tab} icon={<img className={classes.icon} src={sayingsIcon} />} component={this.props.sayingsForm} to={this.props.sayingsURL} disabled={!enableTabs} /> :
            <Tab value={'sayings'} className={classes.tab} icon={<img className={classes.icon} src={sayingsIcon} />} disabled={!enableTabs} />}
            {this.props.keywordsURL?
            <Tab value={'keywords'} className={classes.tab} icon={<img className={classes.icon} src={keywordsIcon} />} component={this.props.keywordsForm} to={this.props.keywordsURL} disabled={!enableTabs} /> :
            <Tab value={'keywords'} className={classes.tab} icon={<img className={classes.icon} src={keywordsIcon} />} disabled={!enableTabs} />}
          </Tabs>
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
    PropTypes.node
  ]),
  agentURL: PropTypes.string,
  sayingsForm: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node
  ]),
  sayingsURL: PropTypes.string,
  keywordsForm: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node
  ]),
  keywordsURL: PropTypes.string,
};

export default injectIntl(withStyles(styles)(MainTab));
