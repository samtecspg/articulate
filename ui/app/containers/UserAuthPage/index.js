import { Grid, Paper, Tab, Tabs } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectSaga from '../../utils/injectSaga';
import { loginUser, signUpUser } from '../App/actions';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import saga from './saga';
import qs from 'query-string';
import { makeSelectSettings } from '../App/selectors';

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
    selectedTab: qs.parse(this.props.location.search, {
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
    this.props.onLogin(username, password);
  }

  onSignUp() {
    const { name, lastName, username, password, ref } = this.state;
    this.props.onSignUp(name, lastName, username, password, ref);
  }

  render() {
    const { classes, onGoToUrl, settings } = this.props;
    const { selectedTab, username, password, name, lastName, ref } = this.state;
    return (
      <Grid container justify="center">
        <Paper square className={classes.root}>
          <Tabs
            value={selectedTab}
            indicatorColor="primary"
            textColor="secondary"
            onChange={this.handleTabChange}
            centered
            fullWidth
          >
            <Tab value={TAB_LOGIN} label="Login" />
            {this.props.settings.allowNewUsersSignUps ? <Tab value={TAB_SIGN_UP} label="Sign Up" /> : null}
          </Tabs>
          {selectedTab === TAB_LOGIN && (
            <LoginForm
              onLogin={this.onLogin}
              onInputChange={this.onInputChange}
              username={username}
              password={password}
            />
          )}
          {selectedTab === TAB_SIGN_UP && this.props.settings.allowNewUsersSignUps && (
            <SignUpForm
              onSignUp={this.onSignUp}
              onInputChange={this.onInputChange}
              username={username}
              password={password}
              name={name}
              lastName={lastName}
              refUrl={ref}
              onGoToUrl={onGoToUrl}
            />
          )}
        </Paper>
      </Grid>
    );
  }
}

UserAuthPage.propTypes = {
  classes: PropTypes.object.isRequired,
  onLogin: PropTypes.func.isRequired,
  onSignUp: PropTypes.func.isRequired,
  onGoToUrl: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  settings: makeSelectSettings(),
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
