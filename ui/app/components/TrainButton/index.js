import {
  Button,
  IconButton,
  Grid,
  Tooltip,
  Typography
} from '@material-ui/core';
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import es from 'javascript-time-ago/locale/es';
import pl from 'javascript-time-ago/locale/pl';
import pt from 'javascript-time-ago/locale/pt';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';
import training from '../../images/training.svg';
import selectVersion from '../../images/select-version.svg';
import messages from './messages';
import VersionsModal from './../VersionsModal'

TimeAgo.addLocale(en);
TimeAgo.addLocale(es);
TimeAgo.addLocale(pt);
TimeAgo.addLocale(pl);

const tooltipTheme = createMuiTheme({
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: '14px',
        fontFamily: 'Montserrat',
        backgroundColor: 'none',
        color: '#4E4E4E',
        marginLeft: '-20px',
        marginRight: '10px',
      },
    },
  },
});

const styles = {
  button: {
    display: 'inline',
    borderRadius: '4px 0px 0px 4px'
  },
  versionButton: {
    width: '30px',
    minWidth: '2px',
    borderLeft: 'none',
    borderRadius: '0px 4px 4px 0px'
  },
  selectVersionImage: {
    height: '18px',
    position: 'relative',
    minWidth: '18px',
    width: '18px',
    marginLeft: '4px'
  },
  trainContainer: {
    display: 'inline-block',
    marginLeft: '15px',
    position: 'relative',
    bottom: '5px',
  },
  trainingStatusLabel: {
    fontSize: '12px',
    marginRight: '15px',
    display: 'inline',
  },
  trainingLabel: {
    color: '#4e4e4e',
    fontWeight: 'bold',
  },
  errorLabel: {
    color: '#de5e56',
    fontWeight: 'bold',
  },
  readyLabel: {
    color: '#00ca9f',
    fontWeight: 'bold',
  },
  trainingAnimation: {
    height: '24px',
    position: 'relative',
    bottom: '2px',
  },
  modalContent: {
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%)`,
    position: 'absolute',
    width: '80%',
    height: '80%',
    backgroundColor: '#fff',
    boxShadow:
      '0px 3px 5px -1px rgba(0, 0, 0, 0.2),0px 5px 8px 0px rgba(0, 0, 0, 0.14),0px 1px 14px 0px rgba(0, 0, 0, 0.12)',
  },
};

/* eslint-disable react/prefer-stateless-function */
export class TrainButton extends React.Component {

  state = {
    openVersionsModal: false
  };

  handleVersionsModalOpen = () => {
    this.setState({
      openVersionsModal: true,
    });
  };

  handleVersionsModalClose = () => {
    this.setState({
      openVersionsModal: false,
    });
  };

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({ time: Date.now() });
    }, 10000); // update the component every 10 seconds
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.agentStatus === 'Training' && this.props.agentStatus === 'Ready'
      && this.props.agentSettings && this.props.agentSettings.enableAgentVersions) {
      this.props.onAddAgentVersion(this.props.currentAgentId);
    }
  }

  getLastTrainingTime(lastTraining) {
    if (lastTraining) {
      return new TimeAgo(this.props.locale).format(new Date(lastTraining));
    }
    return this.props.intl.formatMessage(messages.neverTrained);
  }

  renderVersionsModal(classes, intl) {
    return <VersionsModal
      open={this.state.openVersionsModal}
      onClose={this.handleVersionsModalClose}
      agentVersions={this.props.agentVersions}
      selectedTab={this.props.selectedTab}
      onLoadAgentVersion={this.props.onLoadAgentVersion}
      onAddAgentVersion={this.props.onAddAgentVersion}
      onUpdateAgentVersion={this.props.onUpdateAgentVersion}
      onDeleteAgentVersion={this.props.onDeleteAgentVersion}
      loadedAgentVersionName={this.props.loadedAgentVersionName}
    />
  }

  render() {
    const { intl, classes, serverStatus, agentStatus, lastTraining, onTrain, isReadOnly, loadedAgentVersionName, agentSettings } = this.props;
    return (

      <Grid item className={classes.trainContainer}>
        {this.renderVersionsModal(classes, intl)}
        <Typography className={classes.trainingStatusLabel}>
          {agentStatus === 'Training' ? (
            <span className={classes.trainingLabel}>
              <FormattedMessage {...messages.statusTraining} />
            </span>
          ) : agentStatus === 'Error' ? (
            <span className={classes.errorLabel}>
              <FormattedMessage {...messages.statusError} />
            </span>
          ) : agentStatus === 'Out of Date' ? (
            <span className={classes.errorLabel}>
              <FormattedMessage {...messages.statusOutOfDate} />
            </span>
          ) : agentStatus === 'Ready' ? (
            <span className={classes.readyLabel}>
              <FormattedMessage {...messages.statusReady} />
              {` ${this.getLastTrainingTime(lastTraining)}`}
            </span>
          ) : null}
        </Typography>
        <Tooltip title={serverStatus === 'Training' && agentStatus !== 'Training' ? intl.formatMessage(messages.anotherAgentTraining) : ''} placement="top">
          <div style={{ display: 'inline', overflow: 'hidden' }}>
            <Button disabled={serverStatus === 'Training' || isReadOnly} className={classes.button} onClick={onTrain} key="btnFinish" variant="contained">
              {agentStatus !== 'Training' ? <FormattedMessage {...messages.trainButton} /> : <img src={training} className={classes.trainingAnimation} />}
            </Button>
            <Fragment>
              <Button disabled={(serverStatus === 'Training' || isReadOnly) || (agentSettings && !agentSettings.enableAgentVersions)} className={classes.versionButton} onClick={this.handleVersionsModalOpen} key="btnVersion" variant="contained">
                <MuiThemeProvider theme={tooltipTheme}>
                  <Tooltip title={loadedAgentVersionName ? loadedAgentVersionName : ''} placement="top">
                    <img src={selectVersion} className={classes.selectVersionImage} />
                  </Tooltip>
                </MuiThemeProvider>
              </Button>
            </Fragment>
          </div>
        </Tooltip>
      </Grid>
    );
  }
}

TrainButton.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  onTrain: PropTypes.func,
  agentStatus: PropTypes.string,
  serverStatus: PropTypes.string,
  lastTraining: PropTypes.string,
  locale: PropTypes.string,
  isReadOnly: PropTypes.bool,
  agentVersions: PropTypes.array,
  selectedTab: PropTypes.string,
  onLoadAgentVersion: PropTypes.func,
  onAddAgentVersion: PropTypes.func,
  onUpdateAgentVersion: PropTypes.func,
  onDeleteAgentVersion: PropTypes.func,
  onAddAgentVersion: PropTypes.func,
  currentAgentId: PropTypes.number
};

TrainButton.defaultProps = {
  isReadOnly: false,
};

export default injectIntl(withStyles(styles)(TrainButton));
