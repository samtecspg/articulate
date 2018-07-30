import React from "react";
import { injectIntl, intlShape } from "react-intl";

import PropTypes from "prop-types";
import { Grid, Hidden, Tabs, Tab, Icon } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import messages from "../messages";

const styles = {
  tabs: {
    paddingLeft: '15px'
  },
  tab: {
    paddingLeft: '20px',
    paddingRight: '20px'
  },
}

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
    const { classes, intl, selectedTab } = this.props;
    return (
      <Grid container>
        <Hidden only={['sm', 'xs']}>
          <Tabs
            className={classes.tabs}
            value={this.props.selectedTab}
            indicatorColor='primary'
            textColor='secondary'
            scrollable
            scrollButtons="off"
            onChange={(evt, value) => { this.handleChange(value)}}
          >
            <Tab value={'action'} className={classes.tab} label={intl.formatMessage(messages.action)} />
            <Tab value={'slots'} className={classes.tab} label={intl.formatMessage(messages.slots)} />
            <Tab value={'webhook'} className={classes.tab} label={intl.formatMessage(messages.webhook)} />
            <Tab value={'response'} className={classes.tab} label={intl.formatMessage(messages.response)} />
          </Tabs>
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
          <Tabs
            className={classes.tabs}
            value={this.props.selectedTab}
            indicatorColor='primary'
            textColor='secondary'
            scrollable
            scrollButtons="off"
            onChange={(evt, value) => { this.handleChange(value)}}
          >
            <Tab value={'action'} icon={<Icon>play_arrow</Icon>} className={classes.tab} />
            <Tab value={'slots'} icon={<Icon>list</Icon>} className={classes.tab} />
            <Tab value={'webhook'} icon={<Icon>http</Icon>} className={classes.tab} />
            <Tab value={'response'} icon={<Icon>comment</Icon>} className={classes.tab} />
          </Tabs>
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
};

export default injectIntl(withStyles(styles)(MainTab));
