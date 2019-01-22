import {
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';
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
    padding: '40px 25px',
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
};

/* eslint-disable react/prefer-stateless-function */
class SayingsDataForm extends React.Component {

  state = {
    filterInput: '',
    filteringCategories: false,
    categoriesDropdownOpen: false,
    errorCategory: false,
    openActions: false,
    anchorEl: null,
  };

  render() {
    const { classes, documents } = this.props;
    if (_.isNil(documents)) {
      return null;
    }
    return (
      <div>
        <Grid className={classes.formContainer} container item xs={12}>
          <Grid className={classes.formSubContainer} container item xs={12}>
            <StyledTable
              headers={['', '', 'Category', 'Action', 'Copy', 'Try']}
              headersWidth={['30%', '70%', '', '', '', '']}
              headerMessage={messages.highlightTooltip}
              rows={
                documents.map((document) => (
                  <StyledRow key={`document_${document.id}`}>
                    <SayingRow
                      document={document}
                      agentKeywords={this.props.agentKeywords}
                      agentCategories={this.props.agentCategories}
                      onToggleConversationBar={this.props.onToggleConversationBar}
                      agentActions={this.props.agentActions}
                      onSendMessage={this.props.onSendMessage}
                      onCopySaying={this.props.onCopySaying}
                    />
                  </StyledRow>
                ))}
            />
            <Grid className={classes.pageControl} item xs={12}>
              <Grid className={classes.pageSubControl}>
                <Typography className={classes.pageSizeLabels}>
                  <FormattedMessage {...messages.show} />
                </Typography>
                <TextField
                  select
                  className={classes.pageTextfield}
                  id='pageSize'
                  value={this.props.pageSize}
                  onChange={(evt) => {
                    this.props.changePageSize(evt.target.value);
                  }}
                  margin='normal'
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
                <Typography onClick={this.props.currentPage > 1 ? this.props.movePageBack : null} className={this.props.currentPage > 1 ? classes.pageCursors : classes.pageCursorsDisabled}>
                  <FormattedMessage {...messages.backPage} />
                </Typography>
                <TextField
                  id='page'
                  margin='normal'
                  value={this.props.currentPage}
                  onChange={(evt) => {
                    evt.target.value === '' ?
                      this.props.changePage(0) :
                      (evt.target.value <= this.props.numberOfPages && evt.target.value >= 0 ?
                        this.props.changePage(evt.target.value) :
                        false);
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
                    max: this.props.numberOfPages || 1,
                    step: 1,
                  }}
                  className={classes.pageTextfield}
                  type='number'
                />
                <Typography className={classes.pagesLabel}>
                  / {this.props.numberOfPages}
                </Typography>
                <Typography onClick={this.props.currentPage < this.props.numberOfPages ? this.props.movePageForward : null} className={this.props.currentPage < this.props.numberOfPages ? classes.pageCursors : classes.pageCursorsDisabled}>
                  <FormattedMessage {...messages.nextPage} />
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

      </div>
    );
  }
}

SayingsDataForm.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  documents: PropTypes.array,
  agentId: PropTypes.string,
  agentKeywords: PropTypes.array,
  agentActions: PropTypes.array,
  agentCategories: PropTypes.array,
  agentFilteredCategories: PropTypes.array,
  onCopySaying: PropTypes.func.isRequired,
  onDeleteSaying: PropTypes.func.isRequired,
  onDeleteAction: PropTypes.func.isRequired,
  onTagKeyword: PropTypes.func,
  onUntagKeyword: PropTypes.func,
  onAddAction: PropTypes.func,
  onGoToUrl: PropTypes.func,
  onSendSayingToAction: PropTypes.func,
  currentPage: PropTypes.number,
  pageSize: PropTypes.number,
  numberOfPages: PropTypes.number,
  changePage: PropTypes.func,
  movePageBack: PropTypes.func,
  movePageForward: PropTypes.func,
  changePageSize: PropTypes.func,
  onSelectCategory: PropTypes.func,
  category: PropTypes.string,
  onSearchCategory: PropTypes.func,
  newSayingActions: PropTypes.array,
  onAddNewSayingAction: PropTypes.func,
  onDeleteNewSayingAction: PropTypes.func,
  onClearSayingToAction: PropTypes.func,
  onToggleConversationBar: PropTypes.func,
  onSendMessage: PropTypes.func.isRequired,

};

export default injectIntl(withStyles(styles)(SayingsDataForm));
