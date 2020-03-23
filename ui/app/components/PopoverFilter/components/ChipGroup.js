import React, { Fragment } from 'react';

import PropTypes from 'prop-types';
import { Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { injectIntl, intlShape } from 'react-intl';
import messages from '../messages';
import { includes } from 'lodash';

const styles = {
  chipBackgroundContainer: {
    cursor: 'pointer',
    margin: '5px 0px 5px 10px',
    fontSize: '12px',
    padding: '4px 8px 4px 10px',
    backgroundColor: '#e2e5e7',
    display: 'inline-block',
    position: 'relative',
    borderRadius: '5px',
  },

  issuesChipBackgroundContainer: {
    cursor: 'pointer',
    margin: '5px 0px 5px 10px',
    fontSize: '12px',
    padding: '4px 8px 4px 10px',
    display: 'inline-block',
    position: 'relative',
    borderRadius: '5px',
    color: '#C10007',
    border: '1px solid'
  },

  chipBackgroundContainerSelected: {
    cursor: 'pointer',
    margin: '5px 5px 5px 5px',
    fontSize: '12px',
    padding: '4px 8px 4px 10px',
    backgroundColor: '#e2e5e7',
    display: 'inline-block',
    position: 'relative',
    borderRadius: '5px',
    backgroundColor: '#4e4e4e',
    color: '#fff',
  },
  chipLabel: {
    textDecoration: 'none',
    fontSize: '12px',
    color: '#4e4e4e',
    fontFamily: 'Montserrat',
    marginBottom: '2px',
    display: 'inline-block'
  },
  chipLabelSelected: {
    textDecoration: 'none',
    color: '#ffffff',
    fontFamily: 'Montserrat',
    fontSize: '12px',
    marginBottom: '2px',
    display: 'inline-block'
  },
  issuesChipLabel: {
    textDecoration: 'none',
    color: '#C10007',
    fontFamily: 'Montserrat',
    fontSize: '12px',
    marginBottom: '2px',
    display: 'inline-block'
  },
  chipLabelSelectedX: {
    textDecoration: 'none',
    color: '#ffffff',
    fontFamily: 'Montserrat',
    fontSize: '12px',
    display: 'inline-block',
    marginLeft: '5px'
  },
  filterNamesLabels: {
    color: '#A2A7B1',
    fontSize: '12px',
    paddingTop: '16px',
    paddingLeft: '16px',
    display: 'inline-block',
    fontFamily: 'Montserrat',
  },

};

/* eslint-disable react/prefer-stateless-function */
export class ChipGroup extends React.Component {

  async handleChipClick(value) {
    if (this.chipIsSelected(value)) {
      await this.props.onChangeChipValuesPicked(this.props.chipValuesPicked.filter(function (valueToRemove) {
        return value !== valueToRemove
      }));
    } else {
      await this.props.onChangeChipValuesPicked([...this.props.chipValuesPicked, value]);
    }
  }

  async handleIssuesChipClick() {
    await this.props.onChangeIssuesChipValuesPicked();
  }

  chipIsSelected(value) {
    return includes(this.props.chipValuesPicked, value);
  }

  renderChipsFilterLabel(classes, intl) {
    return <Fragment>
      <span
        className={classes.filterNamesLabels}
      >
        {this.props.chipsFilterLabel}
      </span>
      <br />
    </Fragment>

  }

  renderChips(classes, intl) {
    return <Grid style={{ marginLeft: '10px', marginBottom: '10px' }}>
      {this.props.showChips && this.props.showCustomFirstChip === true && this.renderCustomFirstChip(classes, intl)}
      {this.props.showChips && this.props.showIssuesChip && this.renderIssuesChip(classes, intl)}
      {this.props.showChips && this.renderNormalChips(classes, intl)}
    </Grid>
  }

  renderCustomFirstChip(classes, intl) {
    return <Fragment>
      <div
        key={""}
        className={this.chipIsSelected("") ? classes.chipBackgroundContainerSelected : classes.chipBackgroundContainer}
        onClick={async () => {
          await this.handleChipClick("");
          await this.props.handleFiltersChange();
        }}
      >
        <span
          className={this.chipIsSelected('') ? classes.chipLabelSelected : classes.chipLabel}
        >
          {this.props.customFirstChipLabel}
        </span>
      </div>
    </Fragment>
  }

  renderIssuesChip(classes, intl) {
    return <Fragment>
      <div
        key={"Issues"}
        className={this.props.issuesChipValuePicked ? classes.chipBackgroundContainerSelected : classes.issuesChipBackgroundContainer}
        onClick={async () => {
          await this.handleIssuesChipClick();
          await this.props.handleFiltersChange();
        }}
      >
        <span
          className={this.props.issuesChipValuePicked ? classes.chipLabelSelected : classes.issuesChipLabel}
        >
          {'Issues'}
        </span>
      </div>
    </Fragment>
  }

  renderNormalChips(classes, intl) {
    return this.props.chipValues.sort().map(data => {
      return (
        <div
          key={data}
          className={this.chipIsSelected(data) ? classes.chipBackgroundContainerSelected : classes.chipBackgroundContainer}
          onClick={async () => {
            await this.handleChipClick(data);
            await this.props.handleFiltersChange();
          }}
        >
          <span
            className={this.chipIsSelected(data) ? classes.chipLabelSelected : classes.chipLabel}
          >
            {data}
          </span>
        </div>
      );
    })
  }

  render() {
    const { classes, intl } = this.props;
    return (
      <React.Fragment>
        {this.props.showChips && this.renderChipsFilterLabel(classes, intl)}
        {this.props.showChips && this.renderChips(classes, intl)}
      </React.Fragment>
    )
  }
}

ChipGroup.propTypes = {
  intl: intlShape,
  classes: PropTypes.object.isRequired,
  onCloseNotification: PropTypes.func,
  notifications: PropTypes.array,
};

export default injectIntl(withStyles(styles)(ChipGroup));

