import React from 'react';

import PropTypes from 'prop-types';
import { Grid, FormControl, MenuItem, Select } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import addActionIcon from '../../../images/add-action-icon.svg';

const styles = {
  actionBackgroundContainer: {
    '&:hover': {
      backgroundColor: '#4e4e4e',
      color: '#fff',
    },
    margin: '0px 5px 0px 5px',
    fontSize: '12px',
    padding: '4px 8px 4px 10px',
    backgroundColor: '#e2e5e7',
    display: 'inline-block',
    position: 'relative',
    borderRadius: '5px',
    marginTop: '2px',
  },
  actionLabel: {
    textDecoration: 'none',
    color: 'inherit',
  },
  deleteActionX: {
    '&:hover': {
      fontWeight: 'bold',
    },
    paddingLeft: '5px',
    fontWeight: 300,
    cursor: 'pointer',
  },
  addActionIcon: {
    '&:hover': {
      filter: 'invert(1)',
    },
    cursor: 'pointer',
    verticalAlign: 'middle',
  },
  response: {
    paddingRight: '5px',
    lineHeight: '1.5',
  },
};

/* eslint-disable react/prefer-stateless-function */
class ResponseRow extends React.Component {

  state = {
    openActions: false,
    anchorEl: null,
  };

  render(){
    const { classes, action, response, responseIndex } = this.props;
    return (
      <Grid container>
        <Grid item xs={12}>
          <span className={classes.response}>
            {response.textResponse}
          </span>
          {response.actions.map((action, actionIndex) => {
            return (
              <div key={`responseAction_${actionIndex}`} className={classes.actionBackgroundContainer}>
                <span
                  className={classes.actionLabel}
                >{action}</span>
                <a onClick={() => { this.props.onUnchainActionFromResponse(responseIndex, actionIndex) }} className={classes.deleteActionX}>x</a>
              </div>
            )
          })}
          <img
            onClick={(evt) => this.setState({
              anchorEl: evt.target,
              openActions: true,
            })}
            className={classes.addActionIcon} src={addActionIcon}
          />
          <FormControl>
            <Select
              style={{
                display:'none',
              }}
              open={this.state.openActions}
              onClose={() => this.setState({
                openActions: false,
                anchorEl: null,
              })}
              onOpen={(evt) => this.setState({
                anchorEl: evt.target,
                openActions: true,
              })}
              value={10}
              onChange={(evt) => { evt.preventDefault(); this.props.onChainActionToResponse(responseIndex, evt.target.value)}}
              MenuProps={{
                style:{
                  minHeight: '300px',
                  maxHeight: '300px',
                },
                anchorEl: this.state.anchorEl,
              }}
            >
              {
                this.props.agentActions.map((agentAction) => (
                  response.actions.indexOf(agentAction.actionName) === -1 && agentAction.actionName !== action.actionName ?
                    <MenuItem style={{width: '200px'}} key={`action_${agentAction.id}`} value={agentAction.actionName}>{agentAction.actionName}</MenuItem> :
                    null
                ))
              }
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    );
  }
}

ResponseRow.propTypes = {
  classes: PropTypes.object,
  response: PropTypes.object,
  action: PropTypes.object,
  responseIndex: PropTypes.number,
  agentActions: PropTypes.array,
  onChainActionToResponse: PropTypes.func,
  onUnchainActionFromResponse: PropTypes.func,
};

export default withStyles(styles)(ResponseRow);
