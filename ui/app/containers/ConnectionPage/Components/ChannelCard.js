import React from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Card, CardContent, Typography } from '@material-ui/core';
import ChannelsLogos from '../../../components/ChannelsLogos';
import ChannelsColors from '../../../components/ChannelsColors';

const styles = {
  emptyCard: {
    height: '0px',
    width: '205px',
  },
  channelCard: {
    '&:hover': {
      boxShadow: '0 1px 4px 1px #4A4A4A',
    },
    border: '1px solid #919192',
    height: '205px',
    width: '205px',
    position: 'relative',
    cursor: 'pointer',
  },
  disabledCard: {
    border: '1px solid #919192',
    height: '205px',
    width: '205px',
    position: 'relative',
    cursor: 'not-allowed',
    backgroundColor: '#e6e6e6'
  },
  selectedCard: {
    border: '1px solid #00bd6f',
    height: '205px',
    width: '205px',
    position: 'relative',
    cursor: 'not-allowed',
    backgroundColor: '#00bd6f12'
  },
  channelCardContent: {
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
  channelLogo: {
    marginTop: '10px',
  },
  channelNameTitle: {
    fontSize: '16px',
  },
  channelIcon: {
    marginTop: '20px',
    height: '30px',
  },
};

/* eslint-disable react/prefer-stateless-function */
class ChannelCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      classes,
      channel,
      channelKey,
      isEmpty,
      onClick,
      disabled,
      selected
    } = this.props;
    return isEmpty ? (
      <Grid item>
        <Card className={classes.emptyCard} />
      </Grid>
    ) : (
      <Grid item>
        <Card
          onClick={onClick}
          className={selected ? classes.selectedCard : (disabled ? classes.disabledCard : classes.channelCard)}
        >
          <CardContent className={classes.channelCardContent}>
            <Grid container>
              <Grid item xs={12}>
                <Typography
                  className={classes.channelNameTitle}
                  style={{ color: ChannelsColors[channelKey] }}
                >
                  {channel.name}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <ChannelsLogos
                  logo={channelKey}
                  className={classes.channelIcon}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    );
  }
}

ChannelCard.propTypes = {
  classes: PropTypes.object.isRequired,
  channel: PropTypes.object,
  channelKey: PropTypes.string,
  isEmpty: PropTypes.bool,
  disabled: PropTypes.bool,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
};

export default withStyles(styles)(ChannelCard);
