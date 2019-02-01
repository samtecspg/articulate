import {
  MenuItem,
  TableCell,
  TextField,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { PropTypes } from 'prop-types';
import React, { Fragment } from 'react';
import {
  CopyImageCell,
  PercentCell,
  PlayImageCell,
} from '../../../components/StyledTable';
import HighlightedSaying from './HighlightedSaying';

const styles = {
  userSays: {
    paddingRight: '5px',
    lineHeight: '1.5',
  },
  addActionIcon: {
    '&:hover': {
      filter: 'invert(1)',
    },
    cursor: 'pointer',
    verticalAlign: 'middle',
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
    marginTop: '2px',
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
  categoryBackgroundContainer: {
    margin: '0px 5px 0px 0px',
    fontSize: '12px',
    padding: '4px 8px 4px 10px',
    backgroundColor: '#f6f7f8',
    display: 'inline-block',
    position: 'relative',
    borderRadius: '5px',
    marginTop: '2px',
  },
  categoryLabel: {
    textDecoration: 'none',
    color: 'inherit',
    fontSize: '12px',
  },
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
  tableCellSaying: {},
  rowCategory: {
    color: 'red',
  },
};

/* eslint-disable react/prefer-stateless-function */
class SayingRow extends React.Component {
  render() {
    const {
      classes,
      document,
      agentKeywords,
      agentCategories,
    } = this.props;
    console.log(document);
    const saying = _.maxBy(document.rasa_results, 'categoryScore');
    return (
      <Fragment>
        <TableCell className={classes.rowCategory}>
          {saying.categoryScore !== 0 &&
          <TextField
            className={classes.categorySelectContainer}
            value={saying.category}

            margin='normal'
            fullWidth
            InputProps={{
              className: classes.categorySelectInputContainer,
            }}
            inputProps={{
              className: classes.categorySelect,
            }}
            disabled
          >
            {agentCategories.map((category, index) =>
              // TODO: return the category id in the API to be able to select the category id of the saying in
              (
                <MenuItem key={`category_${index}`} style={{ minWidth: '150px' }} value={category.id}>
                  <span className={classes.categoryLabel}>{category.categoryName}</span>
                </MenuItem>
              ),
            )}
          </TextField>
          }
        </TableCell>
        <TableCell>
          <span className={classes.userSays}>
            <HighlightedSaying
              agentKeywords={agentKeywords}
              keywords={saying.keywords}
              text={document.document}
              keywordIndex={0}
              lastStart={0}
            />
          </span>
          {saying.action.name !== '' &&
          <div className={classes.actionBackgroundContainer}>
            <span className={classes.actionLabel}>{saying.action.name}</span>
          </div>
          }

        </TableCell>
        <PercentCell value={document.maximum_category_score} align="center" />
        <PercentCell value={document.maximum_saying_score} align="center" />
        <CopyImageCell
          onClick={() => {
            this.props.onCopySaying(document);
          }}
        />
        <PlayImageCell
          onClick={() => {
            this.props.onToggleConversationBar(true);
            this.props.onSendMessage({
              author: 'User',
              message: document.document,
            });
          }}
        />
      </Fragment>
    );
  }
}

SayingRow.propTypes = {
  classes: PropTypes.object,
  document: PropTypes.object,
  agentKeywords: PropTypes.array,
  agentCategories: PropTypes.array,
  onToggleConversationBar: PropTypes.func,
  onSendMessage: PropTypes.func,
  onCopySaying: PropTypes.func,
};

export default withStyles(styles)(SayingRow);
