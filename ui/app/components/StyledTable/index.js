import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import CopyImageCell from './components/CopyImageCell';
import CopyToClipboardImageCell from './components/CopyToClipboardImageCell';
import DeleteImageCell from './components/DeleteImageCell';
import DropdownCell from './components/DropdownCell';
import ImageCell from './components/ImageCell';
import PercentCell from './components/PercentCell';
import PlayImageCell from './components/PlayImageCell';
import StyledRow from './components/StyledRow';
import TextCell from './components/TextCell';
// import PropTypes from 'prop-types';
const styles = {
  body: {
    'border': '1px solid #a2a7b1',
  },
  tr: {
    '&:hover': {
      backgroundColor: 'transparent'
    }
  }
};

function StyledTable(props) {
  const {
    classes,
    sortField,
    sortDirection,
    rows,
    headers,
    onRequestSort,
    noBorder,
    id
  } = props;
  return <Grid container item xs={12}>
    <Grid container>
      <Table id={id} style={{border: noBorder ? 'none' : '1px solid #a2a7b1'}}>
        <TableHead>
          {headers.length > 0 ?
            <TableRow className={classes.tr}>
              {
                headers.map(({ id, width, label, sort }) => {
                  return (
                    <TableCell key={`tableCell_${id}`} style={{ width, color: '#A2A7B1' }}>
                      {
                        sort ?
                          <TableSortLabel
                            active={sortField === id}
                            direction={sortDirection.toLowerCase()}
                            onClick={() => onRequestSort(id)}
                          >{label}</TableSortLabel>
                          :
                          <div>{label}</div>
                      }

                    </TableCell>
                  );
                })
              }
            </TableRow> : null}
        </TableHead>
        <TableBody>
          {rows}
        </TableBody>
      </Table>
    </Grid>
  </Grid>;
}

StyledTable.propTypes = {
  classes: PropTypes.object,
  headers: PropTypes.array,
  sortField: PropTypes.string,
  sortDirection: PropTypes.string,
  rows: PropTypes.arrayOf(PropTypes.element),
  onRequestSort: PropTypes.func,
  noBorder: PropTypes.bool,
  id: PropTypes.string
};
StyledTable.defaultProps = {
  headers: [],
  onRequestSort: _.noop,
  noBorder: false
};

export default withStyles(styles)(StyledTable);
export {
  StyledRow,
  ImageCell,
  CopyToClipboardImageCell,
  DeleteImageCell,
  PlayImageCell,
  DropdownCell,
  TextCell,
  PercentCell,
  CopyImageCell,
};
