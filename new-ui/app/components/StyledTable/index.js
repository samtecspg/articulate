import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
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
  highlightLabel: {
    marginTop: '20px',
    marginBottom: '10px',
    color: '#a2a7b1',
    fontWeight: 400,
    fontSize: '12px',
  },
};

function StyledTable(props) {
  const {
    classes,
    headerMessage,
    rows,
    headers,
  } = props;
  return (<Grid container item xs={12}>
    <Grid container>
      <Typography className={classes.highlightLabel}>
        <FormattedMessage {...headerMessage} />
      </Typography>
      <Table>
        <TableHead>
          {headers.lenght > 0 ?
            <TableRow>
              {
                headers.map((header) => <TableCell>{header}</TableCell>)
              }
            </TableRow> : null}
        </TableHead>
        <TableBody>
          {rows}
        </TableBody>
      </Table>
    </Grid>
  </Grid>);
}

StyledTable.propTypes = {
  headers: PropTypes.array,
  headerMessage: PropTypes.object,
  rows: PropTypes.arrayOf(PropTypes.element),
  classes: PropTypes.object.isRequired,
};
StyledTable.defaultProps = {
  headers: [],
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
};
