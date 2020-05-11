/**
 *
 * UsersPage
 *
 */

import { CircularProgress, DialogTitle, Grid, Typography, withStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectSaga from '../../utils/injectSaga';
import { deleteUser, loadUsers, signUpUser, toggleChatButton, updateSetting } from '../App/actions';
import {
  makeSelectError,
  makeSelectLoading,
  makeSelectSettings,
  makeSelectTotalUsers,
  makeSelectUsers,
  makeUserSignupError,
  makeUserSignupLoading,
  makeUserSignupSuccess,
} from '../App/selectors';
import SignUpForm from '../UserAuthPage/components/SignUpForm';
import ActionButtons from './Components/ActionButtons';
import Form from './Components/Form';
import messages from './messages';
import saga from './saga';

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
};

const defaultNewUser = {
  username: '',
  password: '',
  name: '',
  lastName: '',
};

/* eslint-disable react/prefer-stateless-function */
export class UsersPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.moveUsersPageBack = this.moveUsersPageBack.bind(this);
    this.moveUsersPageForward = this.moveUsersPageForward.bind(this);
    this.changeUsersPage = this.changeUsersPage.bind(this);
    this.changeUsersPageSize = this.changeUsersPageSize.bind(this);
    this.handleOpenSignUpDialog = this.handleOpenSignUpDialog.bind(this);
    this.handleCloseSignUpDialog = this.handleCloseSignUpDialog.bind(this);
    this.onSubmitSignUp = this.onSubmitSignUp.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  componentWillMount() {
    this.props.onShowChatButton(false);
    this.props.onLoadUsers(this.state.currentUsersPage, this.state.usersPageSize);
  }

  componentDidUpdate(prevProps) {
    // Signup dialog
    if (!this.props.userSignupLoading && this.props.userSignupSuccess) {
      if (this.props.userSignupSuccess) {
        this.setState({
          signUpDialogOpen: false,
          newUser: defaultNewUser,
        });
      }
    }
    if (this.props.totalUsers !== prevProps.totalUsers) {
      this.setState({
        numberOfUsersPages: Math.ceil(this.props.totalUsers / this.state.usersPageSize),
      });
    }
  }

  state = {
    signUpDialogOpen: false,
    numberOfUsersPages: null,
    currentUsersPage: 1,
    usersPageSize: this.props.settings ? (this.props.settings.usersPageSize ? this.props.settings.usersPageSize : 5) : 5,
    newUser: defaultNewUser,
  };

  changeUsersPage(pageNumber) {
    this.setState({
      currentUsersPage: pageNumber,
    });
    this.props.onLoadUsers(pageNumber, this.state.usersPageSize);
  }

  moveUsersPageBack() {
    const { currentUsersPage } = this.state;
    this.changeUsersPage(currentUsersPage > 1 ? currentUsersPage - 1 : currentUsersPage);
  }

  moveUsersPageForward() {
    const { currentUsersPage, numberOfUsersPages } = this.state;
    this.changeUsersPage(currentUsersPage < numberOfUsersPages ? currentUsersPage + 1 : currentUsersPage);
  }

  changeUsersPageSize(usersPageSize) {
    this.setState({
      currentUsersPage: 1,
      usersPageSize,
    });
    this.setState({
      numberOfUsersPages: Math.ceil(this.props.totalUsers / usersPageSize),
    });
    this.props.onChangeUsersPageSize(usersPageSize);
    this.props.onLoadUsers(1, usersPageSize);
  }

  handleOpenSignUpDialog = () => {
    this.setState({
      signUpDialogOpen: true,
      newUser: defaultNewUser,
    });
  };

  handleCloseSignUpDialog = () => {
    this.setState({
      signUpDialogOpen: false,
      newUser: defaultNewUser,
    });
  };

  onSubmitSignUp() {
    const { name, lastName, username, password } = this.state.newUser;
    this.props.onSubmitSignUp(name, lastName, username, password);
  }

  onInputChange({ field, value }) {
    const { newUser } = this.state;
    this.setState({ newUser: { ...newUser, [field]: value } });
  }

  render() {
    const { newUser } = this.state;
    const { classes } = this.props;
    return this.props.users && typeof this.props.totalUsers === 'number' ? (
      <Grid container>
        <Grid className={classes.container} item xs={12}>
          <Grid className={classes.titleContainer}>
            <Typography className={classes.title}>
              <FormattedMessage {...messages.title} />
            </Typography>
          </Grid>
          <ActionButtons onFinishAction={() => this.handleOpenSignUpDialog()} />
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
        <Dialog open={this.state.signUpDialogOpen} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle>
            <FormattedMessage {...messages.addUserDialogTittle} />
          </DialogTitle>
          <DialogContent>
            <SignUpForm
              onSignUp={this.onSubmitSignUp}
              onInputChange={this.onInputChange}
              username={newUser.username}
              password={newUser.password}
              name={newUser.name}
              lastName={newUser.lastName}
              onGoToUrl={this.props.onGoToUrl}
              error={this.props.error}
            />
          </DialogContent>
        </Dialog>
      </Grid>
    ) : (
      <CircularProgress style={{ position: 'absolute', top: '40%', left: '49%' }} />
    );
  }
}

UsersPage.propTypes = {
  classes: PropTypes.object,
  users: PropTypes.array,
  totalUsers: PropTypes.any,
  onShowChatButton: PropTypes.func,
  onSubmitSignUp: PropTypes.func,
  settings: PropTypes.object,
  isLoading: PropTypes.bool,
  userSignupLoading: PropTypes.bool,
  userSignupSuccess: PropTypes.bool,
  userSignupError: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.bool]),
};

const mapStateToProps = createStructuredSelector({
  users: makeSelectUsers(),
  totalUsers: makeSelectTotalUsers(),
  settings: makeSelectSettings(),
  isLoading: makeSelectLoading(),
  userSignupLoading: makeUserSignupLoading(),
  userSignupSuccess: makeUserSignupError(),
  userSignupError: makeUserSignupSuccess(),
  error: makeSelectError(),
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
    onChangeUsersPageSize: pageSize => {
      dispatch(updateSetting('usersPageSize', pageSize));
    },
    onGoToUrl: url => {
      dispatch(push(url));
    },
    onSubmitSignUp: (name, lastName, username, password) => {
      dispatch(signUpUser(name, lastName, username, password));
    },
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
  withStyles(styles),
)(UsersPage);
