import { MenuItem, TableCell, TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

const styles = {
  categorySelectContainer: {
    margin: '0px',
  },
  categorySelectInputContainer: {
    margin: '0px !important',
  },
  categorySelect: {
    padding: '5px',
    backgroundColor: '#f6f7f8',
    border: 'none',
  },
};

function DropdownCell(props) {
  const { onChange, options, selected, enabled, classes, ...rest } = props;
  return (
    <TableCell {...rest}>
      <TextField
        className={classes.categorySelectContainer}
        select
        value={selected}
        onChange={onChange}
        margin="normal"
        fullWidth
        enabled={enabled}
        inputProps={{
          className: classes.categorySelect,
        }}
      >
        {options.map(option => (
          <MenuItem
            key={`dropdown_cell_${option.id}`}
            style={{ minWidth: '150px' }}
            value={option.id}
          >
            <span className={classes.categoryLabel}>{option.categoryName}</span>
          </MenuItem>
        ))}
      </TextField>
    </TableCell>
  );
}

DropdownCell.propTypes = {
  onChange: PropTypes.func,
  options: PropTypes.array,
  selected: PropTypes.object,
  enabled: PropTypes.bool,
  classes: PropTypes.object,
};

DropdownCell.defaultProps = {
  onChange: _.noop,
  options: [],
  enabled: true,
};

export default withStyles(styles)(DropdownCell);
