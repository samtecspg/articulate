import {
  Grid,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';
import { useShallowEqual } from 'shouldcomponentupdate-children';

import _ from 'lodash';

import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Immutable from 'seamless-immutable';

import trashIcon from '../../../images/trash-icon.svg';

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
  deleteCell: {
    width: '20px',
  },
  deleteIcon: {
    '&:hover': {
      filter: 'invert(0)',
    },
    filter: 'invert(1)',
    cursor: 'pointer',
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
  pageSizeLabels: {
    display: 'inline',
    margin: '0px 5px',
    top: '39px',
    position: 'relative',
  },
};

/* eslint-disable react/prefer-stateless-function */
class UsersListForm extends React.Component {
  state = {
    changedPage: false,
  };

  scrollToNextPageCursor() {
    const pageControl = document.querySelector('#pageControl');
    if (pageControl) {
      pageControl.scrollIntoView(true);
    }
  }

  componentWillUpdate(nextProps) {
    if (
      this.props.currentUsersPage !== nextProps.currentUsersPage ||
      this.props.usersPageSize !== nextProps.usersPageSize
    ) {
      this.setState({
        changedPage: true,
      });
    } else if (
      !_.isEqual(
        Immutable.asMutable(this.props.users, { deep: true }),
        Immutable.asMutable(nextProps.users, { deep: true }),
      )
    ) {
      this.setState({
        changedPage: false,
      });
    }
  }

  componentDidUpdate() {
    if (this.state.changedPage) {
      this.scrollToNextPageCursor();
    }
  }

  render() {
    const { classes, users } = this.props;
    return (
      <Grid className={classes.formContainer} container item xs={12}>
        <Grid
          className={classes.formSubContainer}
          id="formContainer"
          container
          item
          xs={12}
        >
          <Grid container item xs={12}>
            <Grid item xs={12}>

            </Grid>
          </Grid>
          <Grid container item xs={12}>
            {users.length > 0 ? (
              <Grid container>
                <Table>
                  <TableBody>
                    {users.map((user, index) => (
                      <TableRow key={`${user}_${index}`} onClick={() => {
                        this.props.onGoToUrl(`/user/${user.id}`);
                      }}>
                        <TableCell>
                          {`${user.name}${user.lastName ? ` ${user.lastName}` : ''} (${user.email})`}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Grid
                  id="pageControl"
                  className={classes.pageControl}
                  item
                  xs={12}
                >
                  <Grid className={classes.pageSubControl}>
                    <Typography className={classes.pageSizeLabels}>
                      <FormattedMessage {...messages.show} />
                    </Typography>
                    <TextField
                      select
                      className={classes.pageTextfield}
                      id="pageSize"
                      value={this.props.usersPageSize}
                      onChange={evt => {
                        this.props.changeUsersPageSize(evt.target.value);
                      }}
                      margin="normal"
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
                    <Typography className={classes.pageSizeLabels}>
                      <FormattedMessage {...messages.entries} />
                    </Typography>
                  </Grid>
                  <Grid className={classes.pageNumberSubControl}>
                    <Typography
                      onClick={
                        this.props.currentUsersPage > 1
                          ? this.props.moveUsersPageBack
                          : null
                      }
                      className={
                        this.props.currentUsersPage > 1
                          ? classes.pageCursors
                          : classes.pageCursorsDisabled
                      }
                    >
                      <FormattedMessage {...messages.backPage} />
                    </Typography>
                    <TextField
                      id="page"
                      margin="normal"
                      value={this.props.currentUsersPage}
                      onChange={evt => {
                        evt.target.value === ''
                          ? this.props.changeUsersPage(1)
                          : evt.target.value <=
                              this.props.numberOfUsersPages &&
                            evt.target.value >= 0
                          ? this.props.changeUsersPage(evt.target.value)
                          : false;
                      }}
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        style: {
                          textAlign: 'center',
                        },
                        min: 1,
                        max: this.props.numberOfUsersPages,
                        step: 1,
                      }}
                      className={classes.pageTextfield}
                      type="number"
                    />
                    <Typography className={classes.pagesLabel}>
                      / {this.props.numberOfUsersPages}
                    </Typography>
                    <Typography
                      onClick={
                        this.props.currentUsersPage <
                        this.props.numberOfUsersPages
                          ? this.props.moveUsersPageForward
                          : null
                      }
                      className={
                        this.props.currentUsersPage <
                        this.props.numberOfUsersPages
                          ? classes.pageCursors
                          : classes.pageCursorsDisabled
                      }
                    >
                      <FormattedMessage {...messages.nextPage} />
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            ) :
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <FormattedMessage {...messages.noUsersFound} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            }
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

UsersListForm.propTypes = {
  classes: PropTypes.object.isRequired,
  users: PropTypes.array,
  totalUsers: PropTypes.any,
  usersPageSize: PropTypes.number,
  numberOfUsersPages: PropTypes.number,
  currentUsersPage: PropTypes.number,
  changeUsersPage: PropTypes.func,
  moveUsersPageForward: PropTypes.func,
  moveUsersPageBack: PropTypes.func,
  onDeleteUser: PropTypes.func,
  changeUsersPageSize: PropTypes.func,
  onGoToUrl: PropTypes.func,
};

export default useShallowEqual(withStyles(styles)(UsersListForm));
