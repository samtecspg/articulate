import {
  Button,
  Grid,
  TextField,
  Typography,
  withStyles,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import {
  injectIntl,
  intlShape,
} from 'react-intl';
import { Link } from 'react-router-dom';
import messages from '../messages';

const styles = theme =>
  ({
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
  });

function SignUpForm(props) {
  const {
    intl,
    classes,
    onInputChange,
    username,
    password,
    name,
    lastName,
    onSignUp } = props;

  return (
    <form className={classes.root}>
      <Grid className={classes.formSubContainer} container item xs={12}>
        <TextField
          label={intl.formatMessage(messages.name)}
          placeholder={intl.formatMessage(messages.name)}
          margin='normal'
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          autoComplete="name"
          onChange={(evt) => onInputChange({ field: 'name', value: evt.target.value })}
          value={name}
        />
        <TextField
          label={intl.formatMessage(messages.lastName)}
          placeholder={intl.formatMessage(messages.lastName)}
          margin='normal'
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          autoComplete="lastName"
          onChange={(evt) => onInputChange({ field: 'lastName', value: evt.target.value })}
          value={lastName}
        />
        <TextField
          label={intl.formatMessage(messages.username)}
          placeholder={intl.formatMessage(messages.username)}
          margin='normal'
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          autoComplete="username"
          onChange={(evt) => onInputChange({ field: 'username', value: evt.target.value })}
          value={username}
        />
        <TextField
          label={intl.formatMessage(messages.password)}
          placeholder={intl.formatMessage(messages.password)}
          margin='normal'
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          type="password"
          autoComplete="current-password"
          onChange={(evt) => onInputChange({ field: 'password', value: evt.target.value })}
          value={password}
        />
        <Button
          color="primary"
          variant="contained"
          fullWidth
          onClick={onSignUp}
        >Sign Up</Button>
        <Typography
          className={classes.separator}
          align="center"
          variant="overline" gutterBottom
        >&mdash;&mdash;&mdash;&nbsp;OR&nbsp;&mdash;&mdash;&mdash;</Typography>
        <Button variant="contained" className={classes.button} component={Link} to="/auth/twitter" target="_self">twitter</Button>
        <Button variant="contained" className={classes.button} component={Link} to="/auth/github" target="_self">github</Button>
      </Grid>

    </form>
  );
}

SignUpForm.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  onSignUp: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
  password: PropTypes.string,
  username: PropTypes.string,
  name: PropTypes.string,
  lastName: PropTypes.string,
};

export default injectIntl(withStyles(styles)(SignUpForm));

