import React from 'react';
import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
import Autosuggest from 'react-autosuggest';

import { TextField, InputAdornment, IconButton, Paper, MenuItem } from '@material-ui/core';
import { Cancel } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

function renderInputComponent(inputProps) {
  const { value, classes, onChange, inputRef = () => {}, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      InputLabelProps={{
        shrink: true,
      }}
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
        classes: {
          input: classes.input,
        },
        endAdornment: (
          <InputAdornment
            style={{
              display: 'inline',
              position: 'absolute',
              left: '90%',
              marginLeft: '0px',
            }}
            position="end"
          >
            <IconButton
              style={{
                bottom: '12px',
                padding: '0px',
              }}
              onClick={(evt) => { evt.target.value = ''; onChange(evt, '') }}
            >
              {value ? <Cancel /> : null}
            </IconButton>
          </InputAdornment>
        ),   
      }}
      value={value}
      onChange={onChange}
      {...other}
      margin='normal'
    />
  );
}

function renderSuggestion(suggestion, { isHighlighted }) {
  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {suggestion.label}
      </div>
    </MenuItem>
  );
}

function getSuggestionValue(suggestion) {
  return suggestion.label;
}

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  container: {
    position: 'relative',
  },
  suggestionsContainerOpen: {
    marginTop: '-20px',
    position: 'absolute',
    zIndex: 1,
    left: 0,
    right: 0,
    borderRadius: '5px',
    border: '1px solid #4e4e4e',
    backgroundColor: '#fafafa',
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
});

class Autocomplete extends React.Component {

  constructor(props) {
    super(props);
    this.getSuggestions = this.getSuggestions.bind(this);
  }

  state = {
    suggestions: [],
  };

  getSuggestions(value) {
    const inputValue = deburr(value.trim()).toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    const transformedSuggestions = this.props.suggestions.map((suggestion) => ({
      label: suggestion,
    }));

    return inputLength === 0
      ? []
      : transformedSuggestions.filter(suggestion => {
        const keep =
            count < 5 && suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;

        if (keep) {
          count += 1;
        }

        return keep;
      });
  }


  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value),
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  handleChange = (event, { newValue }) => {
    if (newValue || newValue === ''){
      this.props.onChange(newValue);
    }
  };

  render() {
    const { classes, placeholder, value, label, helperText } = this.props;

    const autosuggestProps = {
      renderInputComponent,
      suggestions: this.state.suggestions,
      onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
      getSuggestionValue,
      renderSuggestion,
    };

    return (
      <div className={classes.root}>
        <Autosuggest
          {...autosuggestProps}
          inputProps={{
            classes,
            placeholder,
            value,
            onChange: this.handleChange,
            label,
            helperText,
          }}
          theme={{
            container: classes.container,
            suggestionsContainerOpen: classes.suggestionsContainerOpen,
            suggestionsList: classes.suggestionsList,
            suggestion: classes.suggestion,
          }}
          renderSuggestionsContainer={options => (
            <Paper {...options.containerProps} square>
              {options.children}
            </Paper>
          )}
        />
      </div>
    );
  }
}

Autocomplete.propTypes = {
  classes: PropTypes.object.isRequired,
  suggestions: PropTypes.array,
  value: PropTypes.any,
  label: PropTypes.any,
  helperText: PropTypes.any,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
};

export default withStyles(styles)(Autocomplete);