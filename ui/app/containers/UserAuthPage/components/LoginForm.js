import { Button, Grid, TextField, Typography, withStyles } from '@material-ui/core';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { Link } from 'react-router-dom';
import messages from '../messages';

const styles = theme => ({
  root: {},
  formSubContainer: {
    padding: '40px 25px',
  },
  separator: {
    width: '100%',
    color: theme.palette.text.hint,
  },
  button: {
    margin: theme.spacing.unit,
  },
  error: {
    color: theme.palette.error.light,
  },
});

function LoginForm(props) {
  const { intl, classes, onInputChange, username, password, onLogin, error, isLoading, errorState, authProviders } = props;
  const onFormSubmit = e => {
    e.preventDefault();
    onLogin();
  };
  return (
    <form className={classes.root} onSubmit={onFormSubmit}>
      <Grid className={classes.formSubContainer} container item xs={12}>
        <TextField
          label={intl.formatMessage(messages.username)}
          placeholder={intl.formatMessage(messages.username)}
          margin="normal"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          autoComplete="username"
          onChange={evt => onInputChange({ field: 'username', value: evt.target.value })}
          value={username}
          error={errorState.username}
        />
        <TextField
          label={intl.formatMessage(messages.password)}
          placeholder={intl.formatMessage(messages.password)}
          margin="normal"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          type="password"
          autoComplete="current-password"
          onChange={evt => onInputChange({ field: 'password', value: evt.target.value })}
          value={password}
          error={errorState.password}
        />
        <Button color="primary" variant="contained" fullWidth type="submit" disabled={isLoading}>
          Login
        </Button>
        <Typography className={classes.error} variant="caption" gutterBottom>
          {_.isString(error) ? error : ''}
        </Typography>
        {authProviders.length > 0 && (
          <React.Fragment>
            <Typography className={classes.separator} align="center" variant="overline" gutterBottom>
              &mdash;&mdash;&mdash;&nbsp;OR&nbsp;&mdash;&mdash;&mdash;
            </Typography>
            {authProviders.map(provider => (
              <Button variant="contained" className={classes.button} component={Link} to={`/api/auth/${provider}`} target="_self">
                {provider}
              </Button>
            ))}
          </React.Fragment>
        )}
      </Grid>
    </form>
  );
}

LoginForm.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  onLogin: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
  password: PropTypes.string,
  username: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.bool]),
  isLoading: PropTypes.bool,
  authProviders: PropTypes.array,
  errorState: PropTypes.shape({
    username: PropTypes.bool,
    lastName: PropTypes.bool,
    password: PropTypes.bool,
  }),
};
LoginForm.defaultProps = {
  authProviders: [],
};
export default injectIntl(withStyles(styles)(LoginForm));
