import {
  MenuItem,
  TableCell,
  TextField,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import es from 'javascript-time-ago/locale/es';
import pt from 'javascript-time-ago/locale/pt';
import _ from 'lodash';
import { PropTypes } from 'prop-types';
import React, { Fragment } from 'react';
import {
  injectIntl,
  intlShape,
} from 'react-intl';
import Immutable from 'seamless-immutable';
import { ACTION_INTENT_SPLIT_SYMBOL } from '../../../../common/constants';
import {
  CopyImageCell,
  PercentCell,
  PlayImageCell,
} from '../../../components/StyledTable';
import messages from '../messages';
import HighlightedSaying from './HighlightedSaying';

TimeAgo.addLocale(en);
TimeAgo.addLocale(es);
TimeAgo.addLocale(pt);

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
    margin: '0px 5px 0px 5px',
    fontSize: '12px',
    padding: '4px 8px 4px 8px',
    backgroundColor: '#e2e5e7',
    display: 'inline-block',
    position: 'relative',
    borderRadius: '5px',
    marginTop: '2px',
  },
  actionLabel: {
    textDecoration: 'none',
    color: 'inherit',
    position: 'relative',
    bottom: '1px',
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
    fontSize: '12px',
    textAlign: 'center',
  },
  rowCategory: {
    color: 'red',
  },
};

/* eslint-disable react/prefer-stateless-function */
class SayingRow extends React.Component {

  state = {
    selectedCategory: '-1',
    categoryError: false,
  };

  constgetDocTime(timestamp) {
    if (timestamp) {
      const timeAgo = new TimeAgo(this.props.locale).format(new Date(timestamp), 'twitter');
      return timeAgo ? timeAgo : '< 1m';
    }
    return '';
  };

  render() {
    const {
      classes,
      document,
      agentKeywords,
      agentCategories,
      intl,
    } = this.props;
    const saying = _.maxBy(document.rasa_results, 'categoryScore');
    return (
      <Fragment>
        <TableCell className={classes.rowCategory}>
          {saying.categoryScore !== 0 &&
          <TextField
            className={classes.categorySelectContainer}
            value={saying.category.indexOf('modifiers') > -1 ? 'Modifier' : saying.category}
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
            {agentCategories.map((category) =>
              // TODO: return the category id in the API to be able to select the category id of the saying in
              (
                <MenuItem key={`${document.id}_category_${category.id}`} value={category.id}>
                  <span className={classes.categoryLabel}>{category.categoryName.indexOf('modifiers') ? 'Modifier' : category.categoryName}</span>
                </MenuItem>
              ),
            )}
          </TextField>
          }
        </TableCell>
        <TableCell className={classes.rowCategory}>
          {saying.categoryScore !== 0 &&
          <TextField
            select
            className={classes.categorySelectContainer}
            value={this.state.selectedCategory}
            margin='normal'
            fullWidth
            InputProps={{
              className: classes.categorySelectInputContainer,
            }}
            inputProps={{
              className: classes.categorySelect,
            }}
            onChange={(evt) => {
              evt.target.value !== '-1' ?
                this.setState({
                  selectedCategory: evt.target.value,
                  categoryError: false,
                }) : null;
            }}
            error={this.state.categoryError}
            helperText={this.state.categoryError ? intl.formatMessage(messages.required) : null}
          >
            {this.state.selectedCategory === '-1' ?
              <MenuItem key={`newSayingCategory`} value={'-1'}>
                <span className={classes.categoryLabel}>{intl.formatMessage(messages.selectNewCategory)}</span>
              </MenuItem>
              : null}
            {agentCategories.map((category) =>
              // TODO: return the category id in the API to be able to select the category id of the saying in
              (
                <MenuItem key={`${document.id}_category_${category.id}`} value={category.categoryName}>
                  <span className={classes.categoryLabel}>{category.categoryName}</span>
                </MenuItem>
              ),
            )}
          </TextField>
          }
        </TableCell>
        <TableCell>
          <Typography variant='body1' style={{ fontSize: '10px', color: '#4e4e4e' }}>
            {this.constgetDocTime(document.time_stamp)}
          </Typography>
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
          {
            saying.action.name !== '' &&
            saying.action.name.split(ACTION_INTENT_SPLIT_SYMBOL).map((action) => {
              return <div key={`${document.id}_action_${action}`} className={classes.actionBackgroundContainer}>
                <span className={classes.actionLabel}>{action}</span>
              </div>;
            })
          }

        </TableCell>
        <PercentCell value={document.maximum_category_score} align="center" />
        <PercentCell value={document.maximum_action_score} align="center" />
        <CopyImageCell
          tooltip={'Copy to your list of Sayings'}
          disabled={document.id === 'noData'}
          onClick={() => {
            if (this.state.selectedCategory === '-1') {
              this.setState({
                categoryError: true,
              });
            }
            else {
              const sayingCopy = Immutable.asMutable(saying, { deep: true });
              sayingCopy.category = this.state.selectedCategory;
              this.props.onCopySaying(document.document, sayingCopy);
            }
          }}
        />
        <PlayImageCell
          tooltip={'Test on chat window'}
          disabled={document.id === 'noData'}
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
  intl: intlShape,
  classes: PropTypes.object,
  document: PropTypes.object,
  agentKeywords: PropTypes.array,
  agentCategories: PropTypes.array,
  onToggleConversationBar: PropTypes.func,
  onSendMessage: PropTypes.func,
  onCopySaying: PropTypes.func,
  locale: PropTypes.string,
};

export default injectIntl(withStyles(styles)(SayingRow));
