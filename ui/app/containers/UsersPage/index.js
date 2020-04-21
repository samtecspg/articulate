/**
 *
 * UsersPage
 *
 */

import { Grid, CircularProgress, Typography, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import injectSaga from '../../utils/injectSaga';
import {
  toggleChatButton,
  loadUsers,
  deleteUser,
  updateSetting
} from '../App/actions';
import { makeSelectUsers, makeSelectTotalUsers, makeSelectSettings } from '../App/selectors';
import ActionButtons from './Components/ActionButtons';
import Form from './Components/Form';
import messages from './messages';
import saga from './saga';
import { FormattedMessage } from 'react-intl';

const styles = {
  container: {
    display: 'inline',
    paddingTop: 50,
    paddingLeft: 25,
  },
  titleContainer: {
    display: 'inline',
    position: 'relative',
    top: '5px',
  },
  title: {
    paddingLeft: '5px',
    color: '#4e4e4e',
    fontWeight: 'bold',
    display: 'inline',
  },
}

/* eslint-disable react/prefer-stateless-function */
export class UsersPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.moveUsersPageBack = this.moveUsersPageBack.bind(this);
    this.moveUsersPageForward = this.moveUsersPageForward.bind(this);
    this.changeUsersPage = this.changeUsersPage.bind(this);
    this.changeUsersPageSize = this.changeUsersPageSize.bind(this);
  }

  componentWillMount() {
    this.props.onShowChatButton(false);
    this.props.onLoadUsers(this.state.currentUsersPage, this.state.usersPageSize);
  }


  componentDidUpdate(prevProps) {
    if (this.props.totalUsers !== prevProps.totalUsers) {
      this.setState({
        numberOfUsersPages: Math.ceil(
          this.props.totalUsers / this.state.usersPageSize,
        ),
      });
    }
  }

  state = {
    numberOfUsersPages: null,
    currentUsersPage: 1,
    usersPageSize: this.props.settings ? (this.props.settings.usersPageSize ? this.props.settings.usersPageSize : 5) : 5,
  };

  changeUsersPage(pageNumber) {
    this.setState({
      currentUsersPage: pageNumber,
    });
    this.props.onLoadUsers(
      pageNumber,
      this.state.usersPageSize,
    );
  }

  moveUsersPageBack() {
    const { currentUsersPage } = this.state;
    this.changeUsersPage(
      currentUsersPage > 1 ? currentUsersPage - 1 : currentUsersPage,
    );
  }

  moveUsersPageForward() {
    const { currentUsersPage, numberOfUsersPages } = this.state;
    this.changeUsersPage(
      currentUsersPage < numberOfUsersPages
        ? currentUsersPage + 1
        : currentUsersPage,
    );
  }

  changeUsersPageSize(usersPageSize) {
    this.setState({
      currentUsersPage: 1,
      usersPageSize,
    });
    this.setState({
      numberOfUsersPages: Math.ceil(
        this.props.totalUsers / usersPageSize,
      ),
    });
    this.props.onChangeUsersPageSize(usersPageSize);
    this.props.onLoadUsers(1, usersPageSize);
  }

  render() {
    const { classes } = this.props;
    return this.props.users && typeof this.props.totalUsers === 'number' ? (
      <Grid container>
        <Grid
          style={{paddingBottom: this.props.settings.allowNewUsersSignUps ? null : 20 }}
          className={classes.container}
          item
          xs={12}
        >
          <Grid className={classes.titleContainer}>
            <Typography className={classes.title}>
              <FormattedMessage {...messages.title} />
            </Typography>
          </Grid>
          {this.props.settings.allowNewUsersSignUps ?
            <ActionButtons
              onFinishAction={() => {
                this.props.onGoToUrl('/login?tab=signUp&ref=users')
              }}
            />
          : null}
        </Grid>
        <Form
          users={this.props.users}
          totalUsers={this.props.totalUsers}
          usersPageSize={this.state.usersPageSize}
          numberOfUsersPages={this.state.numberOfUsersPages}
          currentUsersPage={this.state.currentUsersPage}
          changeUsersPage={this.changeUsersPage}
          moveUsersPageForward={this.moveUsersPageForward}
          moveUsersPageBack={this.moveUsersPageBack}
          changeUsersPageSize={this.changeUsersPageSize}
          onDeleteUser={this.props.onDeleteUser.bind(null, this.state.currentUsersPage, this.state.usersPageSize)}
          onGoToUrl={this.props.onGoToUrl}
        />
      </Grid>
    ) : (
      <CircularProgress
        style={{ position: 'absolute', top: '40%', left: '49%' }}
      />
    );
  }
}

UsersPage.propTypes = {
  classes: PropTypes.object,
  users: PropTypes.array,
  totalUsers: PropTypes.any,
  onShowChatButton: PropTypes.func,
  settings: PropTypes.object
};

const mapStateToProps = createStructuredSelector({
  users: makeSelectUsers(),
  totalUsers: makeSelectTotalUsers(),
  settings: makeSelectSettings(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadUsers: (page, pageSize) => {
      dispatch(loadUsers(page, pageSize));
    },
    onShowChatButton: value => {
      dispatch(toggleChatButton(value));
    },
    onDeleteUser: (page, pageSize, id) => {
      dispatch(deleteUser(page, pageSize, id));
    },
    onChangeUsersPageSize: (pageSize) => {
      dispatch(updateSetting('usersPageSize', pageSize));
    },
    onGoToUrl: (url) => {
      dispatch(push(url));
    }
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga({ key: 'users', saga });

export default compose(
  withSaga,
  withConnect,
  withStyles(styles)
)(UsersPage);
