import React from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Card, CardContent, Typography } from '@material-ui/core';
import CategoriesLogos from '../../../components/CategoriesLogos';

const styles = {
  emptyCard: {
    height: '0px',
    width: '205px',
  },
  newCategoryCard: {
    '&:hover': {
      boxShadow: '0 1px 4px 1px #4A4A4A',
    },
    border: '1px solid #919192',
    height: '205px',
    width: '205px',
    position: 'relative',
    cursor: 'pointer',
  },
  newCategoryCardContent: {
    color: '#919192',
    fontSize: '18px',
    fontFamily: 'Montserrat',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    display: 'grid',
    textAlign: 'center',
    height: '150px',
    position: 'relative',
    top: '15%',
  },
  categoryLogo: {
    marginTop: '10px',
  },
};

/* eslint-disable react/prefer-stateless-function */
class CategoryCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      classes,
      category,
      categoryKey,
      isCreate,
      isEmpty,
      onClick,
    } = this.props;
    return isEmpty ? (
      <Grid item>
        <Card className={classes.emptyCard} />
      </Grid>
    ) : (
      <Grid item>
        <Card
          onClick={onClick}
          style={{
            border: isCreate ? '1px solid #00bd6f' : '1px solid #919192',
          }}
          className={classes.newCategoryCard}
        >
          <CardContent className={classes.newCategoryCardContent}>
            <Grid container>
              <Grid item xs={12}>
                <Typography
                  style={{
                    color: category.uiColor,
                  }}
                >
                  {category.name}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                {categoryKey ? (
                  <CategoriesLogos
                    className={classes.categoryLogo}
                    logo={categoryKey}
                  />
                ) : null}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    );
  }
}

CategoryCard.propTypes = {
  classes: PropTypes.object.isRequired,
  category: PropTypes.object,
  agentId: PropTypes.string,
  categoryKey: PropTypes.string,
  isCreate: PropTypes.bool,
  isEmpty: PropTypes.bool,
  onClick: PropTypes.func,
};

export default withStyles(styles)(CategoryCard);
