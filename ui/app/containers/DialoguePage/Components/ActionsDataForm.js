import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';
import { Grid, TextField, Table, TableBody, TableRow, TableCell, Typography, Button, MenuItem  } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import messages from '../messages';

const styles = {
  formContainer: {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #c5cbd8',
    borderBottomLeftRadius: '5px',
    borderBottomRightRadius: '5px',
  },
  formSubContainer: {
    padding: '40px 25px',
  },
  actionsLabel: {
    marginTop: '20px',
    marginBottom: '10px',
    color: '#a2a7b1',
    fontWeight: 400,
    fontSize: '12px',
  },
  pagesLabel: {
    color: '#a2a7b1',
    display: 'inline',
    padding: '5px',
    top: '39px',
    position: 'relative',
  },
  pageControl: {
    marginTop: '5px',
    webkitTouchCallout: 'none',
    webkitUserSelect: 'none',
    khtmlUserSelect: 'none',
    mozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
  },
  pageSubControl: {
    display: 'inline',
  },
  pageNumberSubControl: {
    display: 'inline',
    float: 'right',
  },
  pageTextfield: {
    width: '75px',
    margin: '5px',
    marginTop: '0px !important',
    direction: 'ltr',
  },
  pageCursors: {
    cursor: 'pointer',
    display: 'inline',
    padding: '5px',
    top: '39px',
    position: 'relative',
  },
  pageCursorsDisabled: {
    display: 'inline',
    padding: '5px',
    color: '#a2a7b1',
    top: '39px',
    position: 'relative',
  },
  actionsPageSizeLabels: {
    display: 'inline',
    margin: '0px 5px',
    top: '39px',
    position: 'relative',
  },
  actionRow: {
    cursor: 'pointer',
  },
};

/* eslint-disable react/prefer-stateless-function */
class ActionsDataForm extends React.Component {

  constructor(){
    super();
  }

    state = {
      agentNameError: false,
    };

    render(){
      const { classes, actionsPage } = this.props;
      return (
        <Grid className={classes.formContainer} container item xs={12}>
          <Grid className={classes.formSubContainer} id='formContainer' container item xs={12}>
            <Grid container spacing={24} item xs={12}>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Button
                  variant='contained'
                  onClick={() => {this.props.onCreateAction(`/agent/${this.props.agentId}/action/create?tab=actions`)}}
                >
                  <FormattedMessage {...messages.create} />
                </Button>
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                {actionsPage.length > 0 ?
                  <Grid container>
                    <Typography className={classes.actionsLabel}>
                      <FormattedMessage {...messages.actionsLabel} />
                    </Typography>
                    <Table>
                      <TableBody>
                        {actionsPage.map((action, index) => (
                          <TableRow className={classes.actionRow} onClick={() => { this.props.onGoToUrl(`/agent/${this.props.agentId}/action/${action.id}`) }} key={`${action}_${index}`}>
                            <TableCell>
                              <span>{action.actionName}</span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <Grid className={classes.pageControl} item xs={12}>
                      <Grid className={classes.pageSubControl}>
                        <Typography className={classes.actionsPageSizeLabels}>
                          <FormattedMessage {...messages.show} />
                        </Typography>
                        <TextField
                          select
                          className={classes.pageTextfield}
                          id='actionsPageSize'
                          value={this.props.actionsPageSize}
                          onChange={(evt) => { this.props.changeActionsPageSize(evt.target.value) }}
                          margin='normal'
                          InputLabelProps={{
                            shrink: true,
                          }}
                        >
                          <MenuItem key={5} value={5}>
                            5
                          </MenuItem>
                          <MenuItem key={10} value={10}>
                            10
                          </MenuItem>
                          <MenuItem key={25} value={25}>
                            25
                          </MenuItem>
                          <MenuItem key={50} value={50}>
                            50
                          </MenuItem>
                        </TextField>
                        <Typography className={classes.actionsPageSizeLabels}>
                          <FormattedMessage {...messages.entries} />
                        </Typography>
                      </Grid>
                      <Grid className={classes.pageNumberSubControl}>
                        <Typography onClick={this.props.currentActionsPage > 1 ? this.props.moveActionsPageBack : null} className={this.props.currentActionsPage > 1 ? classes.pageCursors : classes.pageCursorsDisabled}>
                          <FormattedMessage {...messages.backPage} />
                        </Typography>
                        <TextField
                          id='page'
                          margin='normal'
                          value={this.props.currentActionsPage}
                          onChange={(evt) => {
                            evt.target.value === '' ?
                              this.props.changeActionsPage(0) :
                              (evt.target.value <= this.props.numberOfActionsPages && evt.target.value >= 0 ?
                                this.props.changeActionsPage(evt.target.value) :
                                false) }}
                          fullWidth
                          InputLabelProps={{
                            shrink: true,
                          }}
                          inputProps={{
                            style: {
                              textAlign: 'center',
                            },
                            min: 1,
                            max: this.props.numberOfActionsPages,
                            step: 1,
                          }}
                          className={classes.pageTextfield}
                          type='number'
                        />
                        <Typography className={classes.pagesLabel}>
                                                / {this.props.numberOfActionsPages}
                        </Typography>
                        <Typography onClick={this.props.currentActionsPage < this.props.numberOfActionsPages ? this.props.moveActionsPageForward : null} className={this.props.currentActionsPage < this.props.numberOfActionsPages ? classes.pageCursors : classes.pageCursorsDisabled}>
                          <FormattedMessage {...messages.nextPage} />
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid> :
                  null
                }
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      );
    }
}

ActionsDataForm.propTypes = {
  classes: PropTypes.object.isRequired,
  actionsPage: PropTypes.array,
  agentId: PropTypes.string,
  onCreateAction: PropTypes.func.isRequired,
  currentActionsPage: PropTypes.number,
  actionsPageSize: PropTypes.number,
  numberOfActionsPages: PropTypes.number,
  changeActionsPage: PropTypes.func,
  changeActionsPageSize: PropTypes.func,
  moveActionsPageBack: PropTypes.func,
  moveActionsPageForward: PropTypes.func,
  onGoToUrl: PropTypes.func,
};

export default withStyles(styles)(ActionsDataForm);
