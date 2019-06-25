import React from 'react';

import PropTypes from 'prop-types';
import {
  Grid,
  Modal,
  Typography,
  Button,
  CircularProgress,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { injectIntl, intlShape } from 'react-intl';
import CategoryCard from './CategoryCard';
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
  modal: {
    top: '50%',
    left: '50%',
    backgroundColor: '#fff',
    height: '410px',
    width: '500px',
    transform: `translate(-50%, -50%)`,
    position: 'absolute',
    border: '1px solid #4e4e4e',
  },
  modalHeader: {
    height: '115px',
    backgroundColor: '#F6F7F8',
    borderBottom: '1px solid #4e4e4e',
  },
  modalContent: {
    height: '235px',
    display: 'block',
    position: 'relative',
    bottom: '30px',
    overflowY: 'scroll',
  },
  modalContentSample: {
    margin: '10px 20px',
  },
  modalFooter: {
    height: '60px',
    backgroundColor: '#F6F7F8',
    position: 'absolute',
    bottom: 0,
    borderTop: '1px solid #4e4e4e',
  },
  modalCategoryNameContainer: {
    height: '20px',
  },
  modalCategoryName: {
    fontSize: '18px',
    margin: '20px 0px 0px 20px',
  },
  modalCategoryDescription: {
    fontSize: '14px',
    margin: '0px 0px 0px 20px',
  },
  modalImportButton: {
    position: 'absolute',
    right: '20px',
    top: '8px',
  },
};

/* eslint-disable react/prefer-stateless-function */
class CategoryDataForm extends React.Component {
  state = {
    openCategoryModal: false,
    selectedCategory: '',
  };

  fillEmptyCards() {
    const numberOfPrebuiltCategories = Object.keys(
      this.props.prebuiltCategories,
    ).length;
    const numberOfEmptyCardsNeeded = 3 - (numberOfPrebuiltCategories % 4);
    const emptyCards = [];
    for (let index = 0; index < numberOfEmptyCardsNeeded; index++) {
      emptyCards.push(<CategoryCard key={`empty_${index}`} isEmpty />);
    }
    return emptyCards;
  }

  render() {
    const { classes, intl } = this.props;
    return (
      <Grid className={classes.formContainer} container item xs={12}>
        <Grid
          className={classes.formSubContainer}
          id="formContainer"
          container
          item
          xs={12}
          spacing={16}
          justify="space-between"
        >
          <CategoryCard
            key="newCategory"
            category={{
              uiColor: '#00bd6f',
              name: intl.formatMessage(messages.createCategory),
            }}
            agentId={this.props.agentId}
            isCreate
            onClick={() => {
              this.props.onGoToUrl(
                `/agent/${this.props.agentId}/category/create`,
              );
            }}
          />
          {Object.keys(this.props.prebuiltCategories).map(
            (prebuiltCategory, index) => (
              <CategoryCard
                categoryKey={prebuiltCategory}
                key={`category_${index}`}
                category={this.props.prebuiltCategories[prebuiltCategory]}
                agentId={this.props.agentId}
                onClick={() => {
                  this.setState({
                    openCategoryModal: true,
                    selectedCategory: prebuiltCategory,
                  });
                }}
              />
            ),
          )}
          {this.fillEmptyCards()}
        </Grid>
        <Modal
          open={this.state.openCategoryModal}
          onClose={() => {
            this.setState({
              openCategoryModal: false,
            });
          }}
        >
          <Grid container className={classes.modal}>
            {this.props.loading ? (
              <CircularProgress
                style={{ position: 'absolute', top: '45%', left: '45%' }}
              />
            ) : null}
            <Grid item xs={12} container className={classes.modalHeader}>
              <Grid className={classes.modalCategoryNameContainer} item xs={12}>
                <Typography className={classes.modalCategoryName}>
                  {this.state.selectedCategory
                    ? this.props.prebuiltCategories[this.state.selectedCategory]
                        .name
                    : null}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography className={classes.modalCategoryDescription}>
                  {this.state.selectedCategory
                    ? this.props.prebuiltCategories[this.state.selectedCategory]
                        .description
                    : null}
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={12} container className={classes.modalContent}>
              {this.state.selectedCategory
                ? this.props.prebuiltCategories[
                    this.state.selectedCategory
                  ].samples.map((sample, index) => (
                    <Typography
                      className={classes.modalContentSample}
                      variant="body1"
                      key={`sample_${index}`}
                    >
                      {`"${sample}"`}
                    </Typography>
                  ))
                : null}
            </Grid>
            <Grid item xs={12} container className={classes.modalFooter}>
              <Button
                disabled={this.props.loading}
                onClick={() => {
                  this.props.importCategory(this.state.selectedCategory);
                }}
                className={classes.modalImportButton}
                variant="contained"
              >
                {intl.formatMessage(messages.import)}
              </Button>
            </Grid>
          </Grid>
        </Modal>
      </Grid>
    );
  }
}

CategoryDataForm.propTypes = {
  intl: intlShape,
  classes: PropTypes.object.isRequired,
  prebuiltCategories: PropTypes.object,
  agentId: PropTypes.string,
  onGoToUrl: PropTypes.func,
  importCategory: PropTypes.func,
  loading: PropTypes.bool,
};

export default injectIntl(withStyles(styles)(CategoryDataForm));
