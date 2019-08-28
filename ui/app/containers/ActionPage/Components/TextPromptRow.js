import React from 'react';

import PropTypes from 'prop-types';
import { Grid, Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import ContentEditable from 'react-contenteditable';

import { intlShape, injectIntl } from 'react-intl';
import trashIcon from '../../../images/trash-icon.svg';
import copyIcon from '../../../images/icon-copy.svg';
import messages from '../messages';

const styles = {
  icon: {
    '&:hover': {
      filter: 'invert(0)',
    },
    filter: 'invert(1)',
    height: '15px',
    cursor: 'pointer',
    verticalAlign: 'middle',
    paddingLeft: '5px',
  },
  textPrompt: {
    paddingRight: '5px',
    lineHeight: '1.5',
    '&:focus': {
      outline: '0px solid transparent',
    },
  },
  textPromptInput: {
    border: 'none',
    padding: '0px',
  },
};

/* eslint-disable react/prefer-stateless-function */
class TextPromptRow extends React.Component {
  constructor() {
    super();
    this.contentEditable = React.createRef();
  }

  render() {
    const { classes, textPrompt, textPromptIndex, intl } = this.props;
    return (
      <Grid container>
        <Grid item xs={12}>
          <ContentEditable
            className={classes.textPrompt}
            innerRef={this.contentEditable}
            html={textPrompt} // innerHTML of the editable div
            onBlur={evt => {
              this.props.onEditSlotTextPrompt(textPromptIndex, evt.currentTarget.textContent);
            }} // handle innerHTML change
            tagName="span" // Use a custom HTML tag (uses a div by default)
          />
          <Tooltip
            title={intl.formatMessage(messages.copyTextPrompt)}
            placement="top"
          >
            <img
              onClick={() => {
                this.props.onCopyTextPrompt(textPrompt);
              }}
              className={classes.icon}
              src={copyIcon}
            />
          </Tooltip>
          <img
            style={{
              position: 'relative',
              bottom: '1px'
            }}
            onClick={() => {
              this.props.onDeleteTextPrompt(textPromptIndex);
            }}
            className={classes.icon}
            src={trashIcon}
          />
        </Grid>
      </Grid>
    );
  }
}

TextPromptRow.propTypes = {
  intl: intlShape,
  classes: PropTypes.object,
  textPrompt: PropTypes.string,
  textPromptIndex: PropTypes.number,
  onEditSlotTextPrompt: PropTypes.func,
  onDeleteTextPrompt: PropTypes.func,
  onCopyTextPrompt: PropTypes.func,
  agentId: PropTypes.string,
};

export default injectIntl(withStyles(styles)(TextPromptRow));
