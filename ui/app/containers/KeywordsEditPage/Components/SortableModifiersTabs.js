import React from 'react';
import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';
import { Tabs, Tab } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import SortableModifierTab from './SortableModifierTab';

import messages from '../messages';
import trashIcon from '../../../images/trash-icon.svg';

const styles = {
  keywordTabs: {
    paddingLeft: '0px',
  },
  modifierTabLabel: {
    padding: '0px 10px',
  },
  sortModifiers: {
    height: 20,
    width: 20,
  },
  deleteHighlight: {
    cursor: 'pointer',
    fontSize: '12px',
    position: 'relative',
    top: '-1px',
    right: '8px',
    webkitTouchCallout: 'none',
    webkitUserSelect: 'none',
    khtmlUserSelect: 'none',
    mozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
  },
  notificationDot: {
    backgroundColor: '#Cb2121',
    height: '12px',
    width: '12px',
    borderRadius: '50%',
    position: 'absolute',
    top: '10px',
    left: '0px',
  },
  numOfErrorsLabel: {
    fontSize: '10px',
    color: 'white',
    position: 'relative',
    bottom: '4.5px',
    left: '0.5px',
  },
};

class SortableModifiersTabs extends React.Component {
  constructor(props) {
    super(props);
    this.moveModifier = this.moveModifier.bind(this);
  }

  state = {
    modifierHovered: null,
  };

  moveModifier(dragIndex, hoverIndex) {
    this.props.handleTabChange(hoverIndex);
    this.props.onSortModifiers(dragIndex, hoverIndex);
  }

  render() {
    const { keyword, classes } = this.props;

    return (
      <Tabs
        className={classes.keywordTabs}
        value={this.props.selectedTab}
        indicatorColor="primary"
        textColor="secondary"
        scrollable
        onChange={(evt, value) => {
          evt.preventDefault();
          if (value === keyword.modifiers.length) {
            this.props.handleTabChange(keyword.modifiers.length);
            this.props.onAddNewModifier();
          } else if (value < keyword.modifiers.length) {
            this.props.handleTabChange(value);
          }
        }}
      >
        {keyword.modifiers.map((modifier, index) => (
          <SortableModifierTab
            index={index}
            key={`modifierRow_${index}`}
            id={`modifierRow_${index}`}
            moveModifier={this.moveModifier}
            modifierRow={
              <div
                onMouseLeave={() => {
                  this.setState({ modifierHovered: null });
                }}
                onMouseOver={() => {
                  this.setState({ modifierHovered: index });
                }}
                onClick={evt => {
                  evt.target.id.indexOf('deleteModifier') === -1
                    ? this.props.handleTabChange(index)
                    : null;
                }}
              >
                <Tab
                  key={`modifier_${index}`}
                  label={
                    <span className={classes.modifierTabLabel}>
                      <span>{modifier.modifierName}</span>
                    </span>
                  }
                  icon={
                    this.props.errorState.modifiersTabs.indexOf(index) > -1 ? (
                      <div
                        id="notificationDot"
                        className={classes.notificationDot}
                      >
                        <span className={classes.numOfErrorsLabel}>
                          {
                            this.props.errorState.modifiersTabs.filter(
                              element => element === index,
                            ).length
                          }
                        </span>
                      </div>
                    ) : null
                  }
                />
                <img
                  id={`deleteModifier_${index}`}
                  style={{
                    display:
                      this.state.modifierHovered === index ? 'inline' : 'none',
                  }}
                  onClick={() => {
                    this.props.onDeleteModifier(index);
                  }}
                  className={classes.deleteHighlight}
                  src={trashIcon}
                />
              </div>
            }
          />
        ))}
        <Tab
          key="newModifier"
          label={
            <span className={classes.modifierTabLabel}>
              <FormattedMessage {...messages.newModifierTab} />
            </span>
          }
        />
      </Tabs>
    );
  }
}

SortableModifiersTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  keyword: PropTypes.object,
  onAddNewModifier: PropTypes.func,
  onSortModifiers: PropTypes.func,
  handleTabChange: PropTypes.func,
  selectedTab: PropTypes.number,
  onDeleteModifier: PropTypes.func,
  errorState: PropTypes.object,
};

export default withStyles(styles)(SortableModifiersTabs);
