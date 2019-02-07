import { withStyles } from '@material-ui/core/styles';
import { TextField, MenuItem }  from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import expandTtrimmedSingleIcon from '../../images/expand-trimmed-single-icon.svg';

const styles = {
    languageDropdown: {
      float: 'right',
    },
    languageDropdownIcon: {
      top: 'calc(50% - 5px)',
      right: '0',
      position: 'absolute',
      pointerEvents: 'none',
      width: '0.75em',
      display: 'inline-block',
      fontSize: '14px',
      userSelect: 'none',
      flexShrink: '0',
    },
    languageDropdownInput: {
      marginTop: '0px !important',
    },
    languageDropdownInputField: {
      '&:focus': {
        background: 'none',
      },
      paddingTop: 10,
      paddingRight: 20,
      fontSize: '12px',
      border: 'none',
    },
};

function LanguageSelect(props) {
  const {
    classes,
    uiLanguage,
    uiLanguages,
    onChangeLanguage,
    ...rest
  } = props;
  return <TextField
    {...rest}
    select
    id='uiLanguage'
    className={classes.languageDropdown}
    value={uiLanguage}
    SelectProps={{
        IconComponent: () => { return (<img className={classes.languageDropdownIcon} src={expandTtrimmedSingleIcon}/>)}
    }}
    InputProps={{
        className: classes.languageDropdownInput,
    }}
    inputProps={{
        className: classes.languageDropdownInputField
    }}
    onChange={(evt) => { onChangeLanguage(evt.target.value) }}
    >
    {uiLanguages.map((language) => {
        return (
        <MenuItem key={language.text} value={language.value}>
            {language.text}
        </MenuItem>
        )
    })}
    </TextField>;
}

LanguageSelect.propTypes = {
    classes: PropTypes.object.isRequired,
    onChangeLanguage: PropTypes.func,
    uiLanguage: PropTypes.string,
    uiLanguages: PropTypes.array,
};

export default withStyles(styles)(LanguageSelect);
