import { CircularProgress, Grid, TextField, Typography, withStyles } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { GROUP_ACCESS_CONTROL } from '../../../common/constants';
import DeleteFooter from '../../components/DeleteFooter';
import SaveButton from '../../components/SaveButton';
import AC from '../../utils/accessControl';
import injectSaga from '../../utils/injectSaga';
import { changeUserData, deleteUser, loadAccessPolicyGroups, loadUser, updateUser } from '../App/actions';
import {
  makeSelectAccessPolicyGroups,
  makeSelectCurrentUser,
  makeSelectLoading,
  makeSelectSuccessAgent,
  makeSelectUser,
  makeSelectUserDataTouched,
} from '../App/selectors';
import messages from './messages';
import saga from './saga';

const styles = {
  headerContainer: {
    backgroundColor: '#f6f7f8',
    border: '1px solid #c5cbd8',
    borderRadius: '5px',
    marginBottom: '60px',
  },
  titleContainer: {
    padding: '25px',
  },
  titleTextHelpContainer: {
    display: 'inline',
    position: 'relative',
  },
  title: {
    display: 'inline',
    paddingRight: '25px',
    marginTop: '30px',
  },
  selected: {
    color: '#4e4e4e',
    border: '1px solid #C5CBD8',
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
    backgroundColor: '#fff',
    borderBottom: '0px',
  },
  modalContent: {
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%)`,
    position: 'absolute',
    width: '80%',
    height: '80%',
    backgroundColor: '#fff',
    boxShadow: '0px 3px 5px -1px rgba(0, 0, 0, 0.2),0px 5px 8px 0px rgba(0, 0, 0, 0.14),0px 1px 14px 0px rgba(0, 0, 0, 0.12)',
  },
  tabLabel: {
    padding: '0px 10px',
    position: 'relative',
    top: '5px',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #c5cbd8',
    borderBottomLeftRadius: '5px',
    borderBottomRightRadius: '5px',
  },
  formSubContainer: {
    padding: '40px 25px',
  },
  divider: {
    'margin-bottom': '10px',
  },
  actionContainer: {
    marginLeft: '5px',
    display: 'inline',
    float: 'right',
  },
  buttonContainer: {
    position: 'relative',
    bottom: '5px',
  },
};

/* eslint-disable react/prefer-stateless-function */
export class UserPage extends React.PureComponent {
  componentWillMount() {
    this.props.onLoadUser({ id: this.props.match.params.id });
    this.props.onLoadAccessPolicyGroups();
  }

  render() {
    const { intl, classes, user, currentUser, accessPolicyGroups, onChangeUserData, userDataTouched, success, loading, onUpdateUser } = this.props;
    const isReadOnly = !AC.validate({ userPolicies: currentUser.simplifiedGroupPolicies, requiredPolicies: [GROUP_ACCESS_CONTROL.AGENT_WRITE] });
    const GroupCheckBox = ({ id, name, checked, onChange }) => {
      return <FormControlLabel control={<Checkbox checked={checked} onChange={onChange} value={id} color="primary" />} label={name} />;
    };

    return user ? (
      <React.Fragment>
        <Grid item className={classes.actionContainer}>
          <Grid className={classes.buttonContainer}>
            {!isReadOnly && userDataTouched && (
              <SaveButton
                touched={userDataTouched}
                success={success}
                loading={loading}
                label={messages.saveButton}
                onClick={() => onUpdateUser({ user: this.props.user })}
              />
            )}
          </Grid>
        </Grid>
        <Grid className={classes.headerContainer} container item xs={12}>
          <Grid className={classes.titleContainer} item xs={12}>
            <Grid className={classes.titleTextHelpContainer} container>
              <Typography className={classes.title} variant="h2">
                {user.name} {user.lastName} ({user.email})
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid className={classes.formContainer} container item xs={12}>
              <Grid className={classes.formSubContainer} id="formContainer" container item xs={12}>
                <Grid container spacing={24} item xs={12}>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <TextField
                      disabled={isReadOnly}
                      label={intl.formatMessage(messages.userNameField)}
                      value={user.name}
                      placeholder={intl.formatMessage(messages.userNameFieldPlaceholder)}
                      onChange={evt => onChangeUserData({ field: 'name', value: evt.target.value })}
                      margin="normal"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      helperText={intl.formatMessage(messages.requiredField)}
                      /* error={this.props.errorState.agentName}*/
                    />
                  </Grid>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <TextField
                      disabled={isReadOnly}
                      label={intl.formatMessage(messages.userLastNameField)}
                      value={user.lastName}
                      placeholder={intl.formatMessage(messages.userLastNameFieldPlaceholder)}
                      onChange={evt => onChangeUserData({ field: 'lastName', value: evt.target.value })}
                      margin="normal"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      helperText={intl.formatMessage(messages.requiredField)}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={24} item xs={12}>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <TextField
                      disabled={isReadOnly}
                      label={intl.formatMessage(messages.userPasswordField)}
                      value={user.email}
                      placeholder={intl.formatMessage(messages.userEmailPlaceholder)}
                      onChange={evt => onChangeUserData({ field: 'email', value: evt.target.value })}
                      margin="normal"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      helperText={intl.formatMessage(messages.requiredField)}
                    />
                  </Grid>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <TextField
                      type="password"
                      disabled={isReadOnly}
                      label={intl.formatMessage(messages.userPasswordField)}
                      value={user.password || ''}
                      placeholder={intl.formatMessage(messages.userPasswordPlaceholder)}
                      onChange={evt => onChangeUserData({ field: 'password', value: evt.target.value })}
                      margin="normal"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      helperText={intl.formatMessage(messages.requiredField)}
                    />
                  </Grid>
                </Grid>
                <Typography className={classes.title} variant="h2">
                  <FormattedMessage {...messages.groupTitle} />
                </Typography>
                <Grid container spacing={24} item xs={12}>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <FormGroup row>
                      {accessPolicyGroups.map(group => {
                        const isChecked = user.groups.indexOf(group.name) >= 0;
                        return (
                          <GroupCheckBox
                            key={group.id}
                            checked={isChecked}
                            id={group.id}
                            name={group.name}
                            onChange={evt => {
                              if (evt.target.checked) {
                                onChangeUserData({ field: 'groups', value: _.uniq(user.groups.concat([group.name])) });
                              } else {
                                onChangeUserData({ field: 'groups', value: _.without(user.groups, group.name) });
                              }
                            }}
                          />
                        );
                      })}
                    </FormGroup>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {isReadOnly ? null : <DeleteFooter onDelete={this.props.onDeleteUser} type={intl.formatMessage(messages.instanceName)} />}
        </Grid>
      </React.Fragment>
    ) : (
      <CircularProgress style={{ position: 'absolute', top: '40%', left: '49%' }} />
    );
  }
}

UserPage.propTypes = {
  intl: intlShape.isRequired,
  classes: PropTypes.object,
  user: PropTypes.object,
  onLoadUser: PropTypes.func,
  onDeleteUser: PropTypes.func,
  currentUser: PropTypes.object,
  onLoadAccessPolicyGroups: PropTypes.func,
  match: PropTypes.object,
  accessPolicyGroups: PropTypes.array,
  onChangeUserData: PropTypes.func,
  onUpdateUser: PropTypes.func,
  loading: PropTypes.bool,
  success: PropTypes.bool,
  userDataTouched: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  user: makeSelectUser(),
  currentUser: makeSelectCurrentUser(),
  accessPolicyGroups: makeSelectAccessPolicyGroups(),
  loading: makeSelectLoading(),
  success: makeSelectSuccessAgent(),
  userDataTouched: makeSelectUserDataTouched(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadUser: ({ id }) => {
      dispatch(loadUser({ id }));
    },
    onDeleteUser: (page, pageSize, id) => {
      dispatch(deleteUser(page, pageSize, id));
    },
    onGoToUrl: url => {
      dispatch(push(url));
    },
    onLoadAccessPolicyGroups: () => {
      dispatch(loadAccessPolicyGroups());
    },
    onChangeUserData: ({ field, value }) => {
      dispatch(changeUserData({ field, value }));
    },
    onUpdateUser: ({ user }) => {
      const { id, isActive, modificationDate, creationDate, ...data } = user;
      dispatch(updateUser({ id, data }));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga({ key: 'users', saga });

export default injectIntl(
  compose(
    withSaga,
    withConnect,
    withStyles(styles),
  )(UserPage),
);
