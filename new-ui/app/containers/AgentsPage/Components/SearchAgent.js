import React from 'react';
import {intlShape, injectIntl } from 'react-intl';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Input }  from '@material-ui/core';

import messages from '../messages';
import searchIcon from '../../../images/search-icon.svg';

const styles = {
  searchForm: {
    display: 'inline',
    paddingLeft: '25px',
  },
  searchInputField: {
    width: '250px',
    paddingLeft: '5px',
    fontSize: '14px',
  },
};

/* eslint-disable react/prefer-stateless-function */
function SearchAgent(props) {
  const { classes, intl } = props;
  return (
    <form className={classes.searchForm}>
      <img src={searchIcon} alt={intl.formatMessage(messages.searchAgentsAlt)} />
      <Input
        inputProps={{
          style: {
            border: 'none',
          },
        }}
        disableUnderline
        className={classes.searchInputField}
        id="name"
        placeholder={intl.formatMessage(messages.searchAgentPlaceholder)}
        onChange={() => {}}
      />
    </form>
  )
}

SearchAgent.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(withStyles(styles)(SearchAgent));
