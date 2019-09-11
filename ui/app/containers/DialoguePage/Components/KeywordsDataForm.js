import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';
import {
  Grid,
  TextField,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Button,
  MenuItem,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import messages from '../messages';

const styles = {
  formContainer: {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #c5cbd8',
    borderBottomLeftRadius: '5px',
    borderBottomRightRadius: '5px',
  },
  formSubContainer: {
    padding: '40px 25px',
  },
  keywordsLabel: {
    marginTop: '20px',
    marginBottom: '10px',
    color: '#a2a7b1',
    fontWeight: 400,
    fontSize: '12px',
  },
  pagesLabel: {
    color: '#a2a7b1',
    display: 'inline',
    padding: '5px',
    top: '39px',
    position: 'relative',
  },
  pageControl: {
    marginTop: '5px',
    webkitTouchCallout: 'none',
    webkitUserSelect: 'none',
    khtmlUserSelect: 'none',
    mozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
  },
  pageSubControl: {
    display: 'inline',
  },
  pageNumberSubControl: {
    display: 'inline',
    float: 'right',
  },
  pageTextfield: {
    width: '75px',
    margin: '5px',
    marginTop: '0px !important',
    direction: 'ltr',
  },
  pageCursors: {
    cursor: 'pointer',
    display: 'inline',
    padding: '5px',
    top: '39px',
    position: 'relative',
  },
  pageCursorsDisabled: {
    display: 'inline',
    padding: '5px',
    color: '#a2a7b1',
    top: '39px',
    position: 'relative',
  },
  keywordsPageSizeLabels: {
    display: 'inline',
    margin: '0px 5px',
    top: '39px',
    position: 'relative',
  },
  keywordRow: {
    cursor: 'pointer',
  },
  dot: {
    marginRight: 5,
    height: 10,
    width: 10,
    borderRadius: '50%',
    display: 'inline-block',
  },
};

/* eslint-disable react/prefer-stateless-function */
class KeywordsDataForm extends React.Component {
  constructor() {
    super();
  }

  state = {
    agentNameError: false,
  };

  render() {
    const { classes, keywords } = this.props;
    return (
      <Grid className={classes.formContainer} container item xs={12}>
        <Grid
          className={classes.formSubContainer}
          id="formContainer"
          container
          item
          xs={12}
        >
          <Grid container spacing={24} item xs={12}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Button
                variant="contained"
                onClick={() => {
                  this.props.onCreateKeyword(
                    `/agent/${this.props.agentId}/keyword/create?tab=keywords`,
                  );
                }}
              >
                <FormattedMessage {...messages.create} />
              </Button>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              {keywords.length > 0 ? (
                <Grid container>
                  <Typography className={classes.keywordsLabel}>
                    <FormattedMessage {...messages.keywordsLabel} />
                  </Typography>
                  <Table>
                    <TableBody>
                      {keywords.map((keyword, index) => (
                        <TableRow
                          className={classes.keywordRow}
                          onClick={() => {
                            this.props.onGoToUrl(
                              `/agent/${this.props.agentId}/keyword/${
                              keyword.id
                              }`,
                            );
                          }}
                          key={`${keyword}_${index}`}
                        >
                          <TableCell>
                            <span
                              style={{ backgroundColor: keyword.uiColor }}
                              className={classes.dot}
                            />
                            <span>{keyword.keywordName}</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Grid className={classes.pageControl} item xs={12}>
                    <Grid className={classes.pageSubControl}>
                      <Typography className={classes.keywordsPageSizeLabels}>
                        <FormattedMessage {...messages.show} />
                      </Typography>
                      <TextField
                        select
                        className={classes.pageTextfield}
                        id="keywordsPageSize"
                        value={this.props.keywordsPageSize}
                        onChange={evt => {
                          this.props.changeKeywordsPageSize(evt.target.value);
                        }}
                        margin="normal"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      >
                        <MenuItem key={5} value={5}>
                          5
                        </MenuItem>
                        <MenuItem key={10} value={10}>
                          10
                        </MenuItem>
                        <MenuItem key={25} value={25}>
                          25
                        </MenuItem>
                        <MenuItem key={50} value={50}>
                          50
                        </MenuItem>
                      </TextField>
                      <Typography className={classes.keywordsPageSizeLabels}>
                        <FormattedMessage {...messages.entries} />
                      </Typography>
                    </Grid>
                    <Grid className={classes.pageNumberSubControl}>
                      <Typography
                        onClick={
                          this.props.currentKeywordsPage > 1
                            ? this.props.moveKeywordsPageBack
                            : null
                        }
                        className={
                          this.props.currentKeywordsPage > 1
                            ? classes.pageCursors
                            : classes.pageCursorsDisabled
                        }
                      >
                        <FormattedMessage {...messages.backPage} />
                      </Typography>
                      <TextField
                        id="page"
                        margin="normal"
                        value={this.props.currentKeywordsPage}
                        onChange={evt => {
                          evt.target.value = evt.target.value.replace(/^0+/, '');
                          evt.target.value === ''
                            ? this.props.changeKeywordsPage(1)
                            : evt.target.value <=
                              this.props.numberOfKeywordsPages &&
                              evt.target.value >= 1
                              ? this.props.changeKeywordsPage(Number(evt.target.value))
                              : false;
                        }}
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          style: {
                            textAlign: 'center',
                          },
                          min: 1,
                          max: this.props.numberOfKeywordsPages,
                          step: 1,
                        }}
                        className={classes.pageTextfield}
                        type="number"
                      />
                      <Typography className={classes.pagesLabel}>
                        / {this.props.numberOfKeywordsPages}
                      </Typography>
                      <Typography
                        onClick={
                          this.props.currentKeywordsPage <
                            this.props.numberOfKeywordsPages
                            ? this.props.moveKeywordsPageForward
                            : null
                        }
                        className={
                          this.props.currentKeywordsPage <
                            this.props.numberOfKeywordsPages
                            ? classes.pageCursors
                            : classes.pageCursorsDisabled
                        }
                      >
                        <FormattedMessage {...messages.nextPage} />
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              ) : null}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

KeywordsDataForm.propTypes = {
  classes: PropTypes.object.isRequired,
  keywords: PropTypes.array,
  agentId: PropTypes.string,
  onCreateKeyword: PropTypes.func.isRequired,
  currentKeywordsPage: PropTypes.number,
  keywordsPageSize: PropTypes.number,
  numberOfKeywordsPages: PropTypes.number,
  changeKeywordsPage: PropTypes.func,
  changeKeywordsPageSize: PropTypes.func,
  moveKeywordsPageBack: PropTypes.func,
  moveKeywordsPageForward: PropTypes.func,
  onGoToUrl: PropTypes.func,
};

export default withStyles(styles)(KeywordsDataForm);
