import React from 'react';

import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import ContentEditable from 'react-contenteditable';

import { intlShape, injectIntl } from 'react-intl';
import trashIcon from '../../../images/trash-icon.svg';

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
    const { classes, textPrompt, textPromptIndex } = this.props;
    return (
      <Grid container>
        <Grid item xs={12}>
          <ContentEditable
            className={classes.textPrompt}
            innerRef={this.contentEditable}
            html={textPrompt} // innerHTML of the editable div
            onChange={evt => {
              this.props.onEditSlotTextPrompt(textPromptIndex, evt.target.value);
            }} // handle innerHTML change
            tagName="span" // Use a custom HTML tag (uses a div by default)
          />
          <img
            key="deleteTextPrompt"
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
  agentId: PropTypes.string,
};

export default injectIntl(withStyles(styles)(TextPromptRow));
