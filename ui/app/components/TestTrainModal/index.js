import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import {
  Grid,
  Modal,
  TextField,
  MenuItem,
  Button,
  CircularProgress
} from '@material-ui/core';
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from './messages';
import trashIcon from '../../images/trash-icon.svg';
import pencilIcon from '../../images/pencil-icon.svg';
import Immutable from 'seamless-immutable';
import SayingsDataForm from './components/SayingsDataForm';

const styles = {
  modalContent: {
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%)`,
    position: 'absolute',
    width: '40%',
    height: '60%',
    backgroundColor: '#fff',
    outline: 'none',
    border: '1px solid',
    boxShadow:
      '0px 3px 5px -1px rgba(0, 0, 0, 0.2),0px 5px 8px 0px rgba(0, 0, 0, 0.14),0px 1px 14px 0px rgba(0, 0, 0, 0.12)',
    overflow: 'scroll'
  },
  headerGrid: {
    backgroundColor: '#F6F7F8',
    borderBottom: 'solid 1px',
    paddingBottom: '15px',
    marginBottom: '15px',
  },
  titleLabel: {
    color: '#4E4E4E',
    fontSize: '18px',
    paddingTop: '16px',
    paddingLeft: '16px',
    display: 'inline-block',
    fontFamily: 'Montserrat',
    marginBottom: '32px'
  },
  headerDescriptionLabel: {
    color: '#4E4E4E',
    fontSize: '14px',
    paddingLeft: '16px',
    display: 'inline-block',
    fontFamily: 'Montserrat',
    marginBottom: '16px'
  },
  filterNamesLabels: {
    color: '#A2A7B1',
    fontSize: '12px',
    paddingLeft: '16px',
    display: 'inline-block',
    fontFamily: 'Montserrat',
  },
  dropDown: {
    marginTop: '0px',
    marginBottom: '0px',
    paddingLeft: '16px',
    paddingRight: '16px'
  },
  dropDownInput: {
    borderRadius: '5px',
    borderColor: '#A2A7B1',
    height: '100%',
    color: '#A2A7B1',
    '&:focus': {
      borderRadius: '5px',
      borderColor: '#A2A7B1',
      height: '100%',
      color: '#A2A7B1',
    }
  },
  dropDownMainOption: {
    '&:hover': {
      textDecoration: 'none',
      backgroundColor: '#fff',
    },
    minWidth: '335px',
    borderBottom: '1px solid #4e4e4e',
    cursor: 'default',
  },
  icon: {
    '&:hover': {
      filter: 'invert(0)',
    },
    filter: 'invert(1)',
    cursor: 'pointer',
    position: 'relative',
    top: '4px',
    float: 'right',
    marginRight: '16px',
    height: '18px'
  },
  button: {
    marginRight: '16px',
    marginTop: '16px'
  },
  profileMainLoader: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: '5px',
  },
  loader: {
    position: 'relative',
    justifyContent: 'center',
    flexDirection: 'column',
    textAlign: 'center',
    width: '20px',
    height: '20px',
  },
  circularLoader: {
    WebkitAnimation: 'rotate 2s linear infinite',
    animation: 'rotate 2s linear infinite',
    height: '100%',
    WebkitTransformOrigin: 'center center',
    msTransformOrigin: 'center center',
    transformOrigin: 'center center',
    width: '100%',
    position: 'absolute',
    top: -3,
    left: 0,
    margin: 'auto',
  },
  loaderPath: {
    strokeDasharray: '150,200',
    strokeDashoffset: -10,
    WebkitAnimation:
      'dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite',
    animation: 'dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite',
    strokeLinecap: 'round',
  },
  '@global': {
    '@keyframes rotate': {
      '100%': {
        WebkitTransform: 'rotate(360deg)',
        transform: 'rotate(360deg)',
      },
      '30%': {
        opacity: 0.15,
      },
    },
    '@keyframes dash': {
      '0%': {
        strokeDasharray: '1,200',
        strokeDashoffset: 0,
      },
      '50%': {
        strokeDasharray: '89,200',
        strokeDashoffset: -35,
      },
      '100%': {
        strokeDasharray: '89,200',
        strokeDashoffset: -124,
      },
    },
    '@keyframes color': {
      '0%': {
        stroke: '#4e4e4e',
      },
      '40%': {
        stroke: '#4e4e4e',
      },
      '60%': {
        stroke: '#4e4e4e',
      },
      '80%': {
        stroke: '#4e4e4e',
      },
    },
  },
};

class TestTrainModal extends React.Component {

  constructor(props) {

    super(props);

    this.initialState = {
      hoverOnExit: false,
    };
    this.state = this.initialState;
  }

  componentDidUpdate(prevProps, prevState) {

  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    });
  }

  renderMainHeader(classes, intl) {
    return <Fragment>
      <Grid
        container
        direction="row"
        alignItems="stretch"
      >
        <Grid item xs={6}>
          <span className={classes.titleLabel}>
            {//intl.formatMessage(messages.headerTitle)
              'Scaned training'
            }
          </span>
        </Grid>
        <Grid item xs={6}
          style={{
            textAlign: 'end'
          }} >
          <Button className={classes.button} onClick={() => {
            this.updateVersion();
          }} key="btnEdit" variant="contained">
            {'Edit Done'}
          </Button>

        </Grid>
      </Grid>
    </Fragment>
  }

  renderHeaderDescription(classes, intl) {
    return <Grid
      container
      item xs={12}
      direction="row"
      alignItems="stretch"
      style={{
        paddingBottom: '5px'
      }}
    >
      <Grid item xs>
        <span
          className={classes.headerDescriptionLabel}>
          {'Choose to ignore or edit'
            //intl.formatMessage(messages.headerDescription)
          }
        </span>
      </Grid>
    </Grid>
  }

  renderSayings(classes, intl) {
    return <SayingsDataForm
      isReadOnly={false}
      agentId={this.props.agent.id}
      sayings={this.props.testTrain}
      agentKeywords={this.props.agentKeywords}
      agentActions={this.props.agentActions}
      //agentCategories={this.props.agentCategories}
      //agentFilteredCategories={this.props.agentFilteredCategories}
      //agentFilteredActions={this.props.agentFilteredActions}
      //onAddSaying={this.props.onAddSaying}
      onDeleteSaying={this.props.onDeleteSaying}
      //onChangeSayingCategory={this.props.onChangeSayingCategory}
      //onTagKeyword={this.props.onTagKeyword}
      onUntagKeyword={this.props.onUntagKeyword}
    //onAddAction={this.props.onAddAction}
    //onDeleteAction={this.props.onDeleteAction}
    //onAddNewSayingAction={this.props.onAddNewSayingAction}
    //onDeleteNewSayingAction={this.props.onDeleteNewSayingAction}
    //onGoToUrl={this.props.onGoToUrl.bind(
    //  null,
    //  this.props.selectedTab,
    //)}
    //onSendSayingToAction={this.props.onSendSayingToAction}
    //currentSayingsPage={this.props.currentSayingsPage}
    //numberOfSayingsPages={this.props.numberOfSayingsPages}
    //changeSayingsPage={this.props.changeSayingsPage}
    //moveSayingsPageBack={this.props.moveSayingsPageBack}
    //moveSayingsPageForward={this.props.moveSayingsPageForward}
    //changeSayingsPageSize={this.props.changeSayingsPageSize}
    //onSelectCategory={this.props.onSelectCategory}
    //category={this.props.category}
    //userSays={this.props.userSays}
    //onSearchCategory={this.props.onSearchCategory}
    //onSearchActions={this.props.onSearchActions}
    //newSayingActions={this.props.newSayingActions}
    //onClearSayingToAction={this.props.onClearSayingToAction}
    />
  }

  render() {
    const { classes, intl } = this.props;
    return (
      this.props.agentKeywords /* && this.props.agentKeywords.length > 0 */ ? (
        <Grid container>
          <div>
            <Modal
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={this.props.open}
              onClose={async () => {
                if (!this.props.loadingAgentVersion) {
                  await this.setStateAsync(this.initialState);
                  this.props.onClose();
                }
              }
              }
              style={{ overflow: 'scroll' }}
            >
              <div className={classes.modalContent}>
                <Grid
                  className={classes.headerGrid}>
                  {this.renderMainHeader(classes, intl)}
                  {this.renderHeaderDescription(classes, intl)}
                </Grid>
                {this.renderSayings(classes, intl)}
              </div>
            </Modal>
          </div>
        </Grid>
      ) : (
          <CircularProgress style={{ position: 'absolute', top: '40%', left: '49%' }} />
        ))
  }
}

TestTrainModal.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool,
  agentVersions: PropTypes.array,
  selectedTab: PropTypes.string,
  onLoadAgentVersion: PropTypes.func,
  onAddAgentVersion: PropTypes.func,
  onUpdateAgentVersion: PropTypes.func,
  onDeleteAgentVersion: PropTypes.func,
};

export default injectIntl(withStyles(styles)(TestTrainModal));