import { Grid, MenuItem, TextField, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import StyledTable, { StyledRow } from '../../../components/StyledTable';
import messages from '../messages';
import SayingRow from './SayingRow';

const styles = {
  formContainer: {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #c5cbd8',
    borderBottomLeftRadius: '5px',
    borderBottomRightRadius: '5px',
  },
  formSubContainer: {
    padding: '0px 25px 40px 25px',
  },
  deleteCell: {
    width: '20px',
  },
  deleteIcon: {
    '&:hover': {
      filter: 'invert(0)',
    },
    filter: 'invert(1)',
    cursor: 'pointer',
  },
  highlightLabel: {
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
  pageSizeLabels: {
    display: 'inline',
    margin: '0px 5px',
    top: '39px',
    position: 'relative',
  },
  categorySelect: {
    '&:hover': {
      backgroundColor: '#fff',
      borderTopRightRadius: '0px',
      borderBottomRightRadius: '0px',
      borderRight: 'none',
    },
    '&:focus': {
      borderTopRightRadius: '0px',
      borderBottomRightRadius: '0px',
      borderRight: 'none',
    },
    backgroundColor: '#f6f7f8',
    borderTopRightRadius: '0px',
    borderBottomRightRadius: '0px',
    borderRight: 'none',
  },
  sayingInput: {
    borderTopLeftRadius: '0px',
    borderBottomLeftRadius: '0px',
  },
  searchCategoryContainer: {
    minWidth: '288px',
    borderBottom: '1px solid #4e4e4e',
  },
  searchCategoryField: {
    width: '200px',
    paddingLeft: '5px',
    fontSize: '14px',
  },
  addCategoryButton: {
    width: '62px',
    height: '26px',
    marginTop: '6px',
  },
  categoryDataContainer: {
    display: 'inline',
  },
  editCategoryIcon: {
    '&:hover': {
      filter: 'invert(1)',
    },
    position: 'relative',
    top: '2px',
    marginLeft: '10px',
  },
  clearIconContainer: {
    display: 'inline',
    width: '100px',
  },
  clearIcon: {
    position: 'relative',
    top: '15px',
    left: '60px',
  },
  sayingInputContainer: {
    border: '1px solid #a2a7b1',
    borderTopRightRadius: '5px',
    borderBottomRightRadius: '5px',
  },
  addActionIcon: {
    height: '15px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  actionBackgroundContainer: {
    '&:hover': {
      backgroundColor: '#4e4e4e',
      color: '#fff',
    },
    cursor: 'pointer',
    margin: '0px 5px 0px 5px',
    fontSize: '12px',
    padding: '4px 8px 4px 10px',
    backgroundColor: '#e2e5e7',
    display: 'inline-block',
    position: 'relative',
    borderRadius: '5px',
  },
  actionLabel: {
    textDecoration: 'none',
    color: 'inherit',
  },
  deleteActionX: {
    '&:hover': {
      fontWeight: 'bold',
    },
    paddingLeft: '5px',
    fontWeight: 300,
    cursor: 'pointer',
  },
  '@global': {
    '#reviewsTable > tbody > tr > td:first-child': {
      borderLeft: '1px solid #a2a7b1',
    },
    '#reviewsTable > tbody > tr > td:last-child': {
      borderRight: '1px solid #a2a7b1',
    },
    '#reviewsTable > tbody > tr:first-child > td:first-child': {
      borderTop: '1px solid #a2a7b1',
      borderTopLeftRadius: '5px',
    },
    '#reviewsTable > tbody > tr:first-child > td': {
      borderTop: '1px solid #a2a7b1',
    },
    '#reviewsTable > tbody > tr:first-child > td:last-child': {
      borderTop: '1px solid #a2a7b1',
      borderTopRightRadius: '5px',
    },
    '#reviewsTable > tbody > tr:last-child > td:first-child': {
      borderBottom: '1px solid #a2a7b1',
      borderBottomLeftRadius: '5px',
    },
    '#reviewsTable > tbody > tr:last-child > td': {
      borderBottom: '1px solid #a2a7b1',
    },
    '#reviewsTable > tbody > tr:last-child > td:last-child': {
      borderBottom: '1px solid #a2a7b1',
      borderBottomRightRadius: '5px',
    },
    '#reviewsTable > tbody > tr > td:nth-child(3)': {
      borderLeft: '1px solid #a2a7b1',
    },
  },
  dateSelectContainer: {
    position: 'relative',
    top: '41px',
    left: '10px',
    marginTop: '0px',
    height: '20px',
  },
  dateSelectLabel: {
    '&:hover': {
      color: '#000000de',
    },
    color: '#a2a7b1',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.75rem',
    fontWeight: '500',
    paddingRight: '20px',
  },
};

const tableHeaders = [
  { id: 'category', disablePadding: true, label: '', width: '10%' },
  { id: 'time_stamp', disablePadding: true, label: '', width: '5%' },
  { id: 'document', disablePadding: true, label: '', width: '60%' },
  {
    id: 'maximum_category_score',
    disablePadding: true,
    label: 'Category',
    width: '5%',
    sort: true,
  },
  {
    id: 'maximum_action_score',
    disablePadding: true,
    label: 'Action',
    width: '5%',
    sort: true,
  },
  { id: 'copy', disablePadding: true, label: 'Copy', width: '5%' },
  { id: 'try', disablePadding: true, label: 'Try', width: '5%' },
];

/**
 * @return {null}
 */
function SayingsDataForm(props) {
  const { classes, documents, intl, locale, timeSort } = props;
  if (_.isNil(documents)) {
    return null;
  }
  return (
    <div>
      <Grid className={classes.formContainer} container item xs={12}>
        <Grid className={classes.formSubContainer} container item xs={12}>
          {documents.length > 0 ? (
            <a
              className={classes.dateSelectContainer}
              onClick={evt => {
                props.onRequestSort('time_stamp');
              }}
            >
              <Typography className={classes.dateSelectLabel}>
                {timeSort === 'DESC'
                  ? intl.formatMessage(messages.newest)
                  : intl.formatMessage(messages.oldest)}
              </Typography>
            </a>
          ) : null}
          <StyledTable
            id="reviewsTable"
            noBorder
            headers={tableHeaders}
            rows={
              documents.length === 0
                ? [
                  <StyledRow key="document_0">
                    <SayingRow
                      locale={locale}
                      document={{
                        id: 'noData',
                        document: intl.formatMessage(messages.noData),
                        rasa_results: [
                          {
                            keywords: [],
                            action: {
                              name: '',
                            },
                            categoryScore: 0,
                          },
                        ],
                        maximum_action_score: null,
                        maximum_category_score: null,
                      }}
                      agentKeywords={props.agentKeywords}
                      agentCategories={props.agentCategories}
                      onToggleConversationBar={props.onToggleConversationBar}
                      agentActions={props.agentActions}
                      onSendMessage={props.onSendMessage}
                      onCopySaying={props.onCopySaying}
                    />
                  </StyledRow>,
                ]
                : documents.map(document => (
                  <StyledRow key={`document_${document.id}`}>
                    <SayingRow
                      document={document}
                      agentKeywords={props.agentKeywords}
                      agentCategories={props.agentCategories}
                      onToggleConversationBar={props.onToggleConversationBar}
                      agentActions={props.agentActions}
                      onSendMessage={props.onSendMessage}
                      onCopySaying={props.onCopySaying}
                    />
                  </StyledRow>
                ))
            }
            onRequestSort={props.onRequestSort}
            sortField={props.sortField}
            sortDirection={props.sortDirection}
          />
          <Grid className={classes.pageControl} item xs={12}>
            <Grid className={classes.pageSubControl}>
              <Typography className={classes.pageSizeLabels}>
                <FormattedMessage {...messages.show} />
              </Typography>
              <TextField
                select
                className={classes.pageTextfield}
                id="pageSize"
                value={props.pageSize}
                onChange={evt => {
                  props.changePageSize(evt.target.value);
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
              <Typography className={classes.pageSizeLabels}>
                <FormattedMessage {...messages.entries} />
              </Typography>
            </Grid>
            <Grid className={classes.pageNumberSubControl}>
              <Typography
                onClick={props.currentPage > 1 ? props.movePageBack : null}
                className={
                  props.currentPage > 1
                    ? classes.pageCursors
                    : classes.pageCursorsDisabled
                }
              >
                <FormattedMessage {...messages.backPage} />
              </Typography>
              <TextField
                id="page"
                margin="normal"
                value={props.currentPage}
                onChange={evt => {
                  evt.target.value = evt.target.value.replace(/^0+/, '');
                  evt.target.value === ''
                    ? props.changePage(1)
                    : evt.target.value <= props.numberOfPages &&
                      evt.target.value >= 1
                      ? props.changePage(Number(evt.target.value))
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
                  max: props.numberOfPages || 1,
                  step: 1,
                }}
                className={classes.pageTextfield}
                type="number"
              />
              <Typography className={classes.pagesLabel}>
                / {props.numberOfPages}
              </Typography>
              <Typography
                onClick={
                  props.currentPage < props.numberOfPages
                    ? props.movePageForward
                    : null
                }
                className={
                  props.currentPage < props.numberOfPages
                    ? classes.pageCursors
                    : classes.pageCursorsDisabled
                }
              >
                <FormattedMessage {...messages.nextPage} />
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

SayingsDataForm.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  documents: PropTypes.array,
  agentId: PropTypes.string,
  agentKeywords: PropTypes.array,
  agentActions: PropTypes.array,
  agentCategories: PropTypes.array,
  onCopySaying: PropTypes.func.isRequired,
  onSendSayingToAction: PropTypes.func,
  currentPage: PropTypes.number,
  pageSize: PropTypes.number,
  numberOfPages: PropTypes.number,
  changePage: PropTypes.func,
  movePageBack: PropTypes.func,
  movePageForward: PropTypes.func,
  changePageSize: PropTypes.func,
  category: PropTypes.string,
  onSearchCategory: PropTypes.func,
  newSayingActions: PropTypes.array,
  onAddNewSayingAction: PropTypes.func,
  onDeleteNewSayingAction: PropTypes.func,
  onClearSayingToAction: PropTypes.func,
  onToggleConversationBar: PropTypes.func,
  onSendMessage: PropTypes.func.isRequired,
  onRequestSort: PropTypes.func,
  sortField: PropTypes.string,
  sortDirection: PropTypes.string,
  locale: PropTypes.string,
  timeSort: PropTypes.string,
};

export default injectIntl(withStyles(styles)(SayingsDataForm));
