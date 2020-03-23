import { Grid, Hidden, Icon, Tab, Tabs, Tooltip, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import TrainButton from '../../../components/TrainButton';
import agentIcon from '../../../images/agents-icon.svg';
import reviewIcon from '../../../images/icon-review.svg';
import analyticsIcon from '../../../images/icon-analytics.svg';
import dialogueIcon from '../../../images/sayings-icon.svg';
import vDivider from '../../../images/v-divider.svg';
import messages from './../messages';
import gravatars from '../../../components/Gravatar';

import SaveButton from '../../../components/SaveButton';

const styles = {
  mainTabContainer: {
    marginTop: '45px',
  },
  tabs: {
    paddingLeft: '5px',
  },
  tab: {
    paddingLeft: '10px',
    paddingRight: '10px',
  },
  agentTab: {
    paddingLeft: '0px',
    paddingRight: '10px',
    minWidth: 'fit-content',
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
    fontWeight: 'bold',
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
    width: '100%',
    textAlign: 'right'
  },
  icon: {
    padding: '0px 10px',
    cursor: 'pointer',
  },
  agentIcon: {
    height: '20px',
    padding: '0px 5px',
    cursor: 'pointer',
  },
  button: {
    display: 'inline',
  },
  backButtonContainer: {
    display: 'inline',
    widht: '100%',
    bottom: '10px',
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
  container: {
    display: 'inline',
    float: 'right',
  },
};

/* eslint-disable react/prefer-stateless-function */
export class MainTab extends React.Component {
  state = {
    selectedTab: this.props.selectedTab,
  };

  handleChange = value => {
    if (!this.props.touched || this.props.success) {
      this.setState({
        selectedTab: value,
      });
    }
  };

  render() {
    const {
      classes,
      intl,
    } = this.props;
    return (
      <Fragment>
        <Grid className={classes.container}>
          <Grid container className={classes.mainTabContainer}>
            <Grid className={classes.buttonContainer}>
              <Grid className={classes.backButtonContainer}>
                <span
                  className={classes.backArrow}
                  onClick={async () => {
                    await this.props.onGoToUrl(
                      `/agent/${this.props.agent.id}/dialogue`,
                    );
                  }}
                  key="backArrow"
                >
                  {'< '}
                </span>
                <a
                  key="backLink"
                  className={classes.backButton}
                  onClick={async () => {
                    await this.props.onGoToUrl(
                      `/agent/${this.props.agent.id}/dialogue`,
                    );
                  }}
                >
                  <FormattedMessage {...messages.backButton} />
                </a>
              </Grid>
            </Grid>
          </Grid>
          <Hidden only={['sm', 'xs', 'md']}>
            {!this.props.dialogueURL
              ? this.state.selectedTab === 'dialogue'
                ? this.props.dialogueForm
                : null
              : null}
          </Hidden>
          <Hidden only={['xl', 'lg']}>
            {!this.props.dialogueURL
              ? this.state.selectedTab === 'dialogue'
                ? this.props.dialogueForm
                : null
              : null}
          </Hidden>
        </Grid>
      </Fragment>
    );
  }
}

MainTab.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  enableTabs: PropTypes.bool,
  selectedTab: PropTypes.string,
  agentForm: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  agentURL: PropTypes.string,
  dialogueForm: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  dialogueURL: PropTypes.string,
  keywordsURL: PropTypes.string,
  reviewForm: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  reviewURL: PropTypes.string,
  agentName: PropTypes.string,
  currentAgent: PropTypes.object,
  onFinishAction: PropTypes.func,
  onTrain: PropTypes.func,
  onLoadAgentVersion: PropTypes.func,
  onAddAgentVersion: PropTypes.func,
  onUpdateAgentVersion: PropTypes.func,
  onDeleteAgentVersion: PropTypes.func,
  agentStatus: PropTypes.string,
  lastTraining: PropTypes.string,
  formError: PropTypes.bool,
  newAgent: PropTypes.bool,
  disableSave: PropTypes.bool,
  touched: PropTypes.bool,
  locale: PropTypes.string,
  serverStatus: PropTypes.string,
  isReadOnly: PropTypes.bool,
  agentVersions: PropTypes.array,

  onGoToUrl: PropTypes.func
};

MainTab.defaultProps = {
  isReadOnly: false,
};

export default injectIntl(withStyles(styles)(MainTab));
