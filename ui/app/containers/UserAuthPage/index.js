import { Grid, Paper, Tab, Tabs } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import PropTypes from 'prop-types';
import qs from 'query-string';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { locationShape } from 'react-router-props';
import { push } from 'react-router-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectSaga from '../../utils/injectSaga';
import { loginUser, signUpUser } from '../App/actions';
import { makeSelectError, makeSelectLoading, makeSelectSettings } from '../App/selectors';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import saga from './saga';

const styles = theme => ({
  root: {
    width: 500,
    backgroundColor: theme.palette.background.paper,
  },
});
const TAB_SIGN_UP = 'signUp';
const TAB_LOGIN = 'login';

/* eslint-disable react/prefer-stateless-function */
export class UserAuthPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onInputChange = this.onInputChange.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
  }

  state = {
    selectedTab:
      qs.parse(this.props.location.search, {
        ignoreQueryPrefix: true,
      }).tab && this.props.settings.allowNewUsersSignUps
        ? qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).tab
        : TAB_LOGIN,
    ref: qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    }).ref
      ? qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).ref
      : '',
    name: '',
    errorState: {
      username: false,
      lastName: false,
      password: false,
    },
    lastName: '',
    username: '',
    password: '',
  };

  handleTabChange = (event, selectedTab) => {
    this.setState({ selectedTab });
  };

  onInputChange({ field, value }) {
    this.setState({ [field]: value });
  }

  onLogin() {
    const { username, password } = this.state;
    if (!(_.isEmpty(password) || _.isEmpty(username))) {
      this.props.onLogin(username, password);
    } else {
      this.setState({
        errorState: {
          username: _.isEmpty(username),
          password: _.isEmpty(password),
        },
      });
    }
  }

  onSignUp() {
    const { name, lastName, username, password, ref } = this.state;
    this.props.onSignUp(name, lastName, username, password, ref);
  }

  render() {
    const { classes, onGoToUrl, error, isLoading, settings } = this.props;
    const { selectedTab, username, password, name, lastName, ref, errorState } = this.state;
    return (
      <Grid container justify="center">
        <Paper square className={classes.root}>
          <Tabs value={selectedTab} indicatorColor="primary" textColor="secondary" onChange={this.handleTabChange} centered fullWidth>
            <Tab value={TAB_LOGIN} label="Login" />
            {settings.allowNewUsersSignUps ? <Tab value={TAB_SIGN_UP} label="Sign Up" /> : null}
          </Tabs>
          {selectedTab === TAB_LOGIN && (
            <LoginForm
              errorState={errorState}
              onLogin={this.onLogin}
              onInputChange={this.onInputChange}
              username={username}
              password={password}
              error={error}
              isLoading={isLoading}
              authProviders={settings.authProviders}
            />
          )}
          {selectedTab === TAB_SIGN_UP && settings.allowNewUsersSignUps && (
            <SignUpForm
              onSignUp={this.onSignUp}
              onInputChange={this.onInputChange}
              username={username}
              password={password}
              name={name}
              lastName={lastName}
              refUrl={ref}
              onGoToUrl={onGoToUrl}
              error={error}
              isLoading={isLoading}
            />
          )}
        </Paper>
      </Grid>
    );
  }
}

UserAuthPage.propTypes = {
  location: locationShape.isRequired,
  classes: PropTypes.object.isRequired,
  onLogin: PropTypes.func.isRequired,
  onSignUp: PropTypes.func.isRequired,
  onGoToUrl: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.bool]),
  isLoading: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  settings: makeSelectSettings(),
  error: makeSelectError(),
  isLoading: makeSelectLoading(),
});

function mapDispatchToProps(dispatch) {
  return {
    onGoToUrl: url => {
      dispatch(push(url));
    },
    onLogin: (username, password) => {
      dispatch(loginUser(username, password));
    },
    onSignUp: (name, lastName, username, password, ref) => {
      dispatch(signUpUser(name, lastName, username, password, ref));
    },
  };
}

const withSaga = injectSaga({ key: 'user', saga });
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default injectIntl(
  withStyles(styles)(
    compose(
      withSaga,
      withConnect,
    )(UserAuthPage),
  ),
);
