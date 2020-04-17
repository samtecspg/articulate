import { Button, Grid, Modal, Typography, Card, CardContent, CardHeader, TextField, MenuItem } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import playHelpIcon from '../../../images/play-help-icon.svg';
import analyticsIcon from '../../../images/icon-analytics.svg';
import messages from '../messages';
import _ from 'lodash';
import { HorizontalBar, Bar } from 'react-chartjs-2';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);

const styles = {
  headerContainer: {
    backgroundColor: '#f6f7f8',
    border: '1px solid #c5cbd8',
    borderRadius: '5px',
    marginBottom: '60px',
  },
  titleContainer: {
    padding: '25px',
  },
  analyticsIcon: {
    display: 'inline',
    paddingRight: '10px',
    height: '30px',
  },
  titleTextHelpContainer: {
    display: 'inline',
    position: 'relative',
    bottom: '6px',
  },
  title: {
    display: 'inline',
    paddingRight: '25px',
  },
  helpButton: {
    display: 'inline',
    width: '50px',
    height: '20px',
  },
  playIcon: {
    height: '10px',
  },
  helpText: {
    fontSize: '9px',
    fontWeight: 300,
    position: 'relative',
    bottom: '2px',
    paddingLeft: '2px',
  },
  modalContent: {
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%)`,
    position: 'absolute',
    width: '80%',
    height: '80%',
    backgroundColor: '#fff',
    boxShadow:
      '0px 3px 5px -1px rgba(0, 0, 0, 0.2),0px 5px 8px 0px rgba(0, 0, 0, 0.14),0px 1px 14px 0px rgba(0, 0, 0, 0.12)',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #c5cbd8',
    borderBottomLeftRadius: '5px',
    borderBottomRightRadius: '5px',
  },
  formSubContainer: {
    padding: '0 25px 40px 25px',
  },
  cardTitle: {
    fontSize: '12px'
  },
  analyticsCard: {
    border: '1px solid #919192',
    width: '100%',
    position: 'relative',
    marginTop: '40px'
  },
  analyticsCardContent: {
    color: '#919192',
    fontSize: '18px',
    fontFamily: 'Montserrat',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    display: 'grid',
    textAlign: 'center',
    height: '150px',
  },
  valueLabel: {
    fontSize: '60px',
    fontWeight: 'bold',
    color: '#4e4e4e'
  },
  countLabel: {
    marginTop: '-40px',
    fontSize: '12px'
  },
  periodSelect: {
    marginTop: '20px'
  }
};

/* eslint-disable react/prefer-stateless-function */
class Form extends React.Component {
  state = {
    openModal: false,
    period: ''
  };

  handleOpen = () => {
    this.setState({
      openModal: true,
    });
  };

  handleClose = () => {
    this.setState({
      openModal: false,
    });
  };

  getTopActions = (stats) => {

    let data = {};
    if (stats.documentsAnalyticsTopActions.length > 0) {
      var result = _.filter(stats.documentsAnalyticsTopActions, function (action) {
        if (action.key && action.key !== '') return action;
      });
      result = _.orderBy(result, ['doc_count', 'key'], ['desc', 'asc']).slice(0, 5);

      data = {
        labels: _.map(result, 'key'),
        datasets: [
          {
            label: this.props.intl.formatMessage(messages.count),
            backgroundColor: '#3ccb8e',
            borderColor: '#3ccb8e',
            borderWidth: 1,
            hoverBackgroundColor: '#00c582',
            hoverBorderColor: '#00c582',
            data: _.map(result, 'doc_count')
          }
        ]
      };
    }

    return data
  };

  getTimeGranularityWord() {
    switch (this.props.dateRange) {
      case 'now-1H':
        return 'minutes';
      case 'now-1d':
        return 'hours';
      case 'now-7d':
        return 'days';
      case 'now-1M':
        return 'weeks';
      default:
        return 'months';
    }
  }

  getTimeGranularityFormat() {
    switch (this.props.dateRange) {
      case 'now-1H':
        return 'MM-DD-YYYY HH:mm';
      case 'now-1d':
        return 'MM-DD-YYYY HH:00';
      case 'now-7d':
        return 'MM-DD-YYYY';
      case 'now-1M':
        return 'MM-DD-YYYY';
      default:
        return 'MM-YYYY';
    }
  }

  getTimeFrequencyLabel(intl, messages) {
    switch (this.props.dateRange) {
      case 'now-1H':
        return intl.formatMessage(messages.perMinute)
      case 'now-1d':
        return intl.formatMessage(messages.perHour)
      case 'now-7d':
        return intl.formatMessage(messages.perDay)
      case 'now-1M':
        return intl.formatMessage(messages.perWeek)
      default:
        return intl.formatMessage(messages.perMonth)
    }
  }

  getRequestsOverTime = (stats) => {

    let data = {}
    if (stats.documentsAnalyticsRequestsOverTime.length > 0) {
      const timestamps = _.sortBy(_.map(stats.documentsAnalyticsRequestsOverTime, (document) => { return new Moment(document.key_as_string) }));
      const range = moment.range(timestamps[0].clone().subtract(1, this.getTimeGranularityWord()), Moment().add(1, this.getTimeGranularityWord()));
      const minutes = Array.from(range.by(this.getTimeGranularityWord()));
      const labels = minutes.map(m => m.format(this.getTimeGranularityFormat()));
      const tempResult = stats.documentsAnalyticsRequestsOverTime.map(d => ({ name: new Moment(d.key_as_string).format(this.getTimeGranularityFormat()), count: d.doc_count }));
      const result = _.times(labels.length, _.constant(0));

      tempResult.forEach((minuteOfRequest) => {
        result[labels.indexOf(minuteOfRequest.name)] = minuteOfRequest.count;
      });

      data = {
        labels,
        datasets: [
          {
            label: this.props.intl.formatMessage(messages.count),
            backgroundColor: '#3ccb8e',
            borderColor: '#3ccb8e',
            borderWidth: 1,
            hoverBackgroundColor: '#00c582',
            hoverBorderColor: '#00c582',
            data: result
          }
        ]
      };
    }
    return data
  };

  getMaxRequestsOverTime(requestsOverTime) {
    if (requestsOverTime && requestsOverTime.length > 0) {
      return Math.max(...requestsOverTime.map(request => { return request.doc_count }));
    }
    return 1;
  }

  getAverageWebhookResponseTime = (documents) => {

    const webhookResponseTimes = _.compact(_.flattenDeep((documents.map((document) => {

      if (document.converseResult && document.converseResult.CSO && document.converseResult.CSO.webhooks) {
        return document.converseResult.CSO.webhooks.map((webhook) => {

          return webhook.elapsed_time_ms;
        });
      }
      return null;
    }))));

    return webhookResponseTimes.length > 0 ? `${_.sum(webhookResponseTimes) / webhookResponseTimes.length} ms` : this.props.intl.formatMessage(messages.noWebhooksCallsSoFar);
  };

  render() {
    const { classes, intl } = this.props;
    return (
      <Grid className={classes.headerContainer} container item xs={12}>
        <Grid className={classes.titleContainer} item xs={12}>
          <img alt="" className={classes.analyticsIcon} src={analyticsIcon} />
          <Grid className={classes.titleTextHelpContainer} container>
            <Typography className={classes.title} variant="h2">
              <FormattedMessage {...messages.formTitle} />
            </Typography>
            <Button
              className={classes.helpButton}
              variant="outlined"
              onClick={this.handleOpen}
            >
              <img
                className={classes.playIcon}
                src={playHelpIcon}
                alt={intl.formatMessage(messages.playHelpAlt)}
              />
              <span className={classes.helpText}>
                <FormattedMessage {...messages.help} />
              </span>
            </Button>
            <Modal open={this.state.openModal} onClose={this.handleClose}>
              <Grid className={classes.modalContent} container>
                <iframe
                  title="SPG Intro"
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/o807YDeK6Vg"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </Grid>
            </Modal>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid className={classes.formContainer} container item xs={12}>
            <Grid className={classes.formSubContainer}
              id="formContainer"
              container
              item
              xs={12}
            >
              <Grid container item xs={12}>
                <TextField
                  label={intl.formatMessage(messages.selectTime)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  select
                  id="period"
                  className={classes.periodSelect}
                  value={this.props.dateRange}
                  onChange={evt => {
                    this.props.onSetDateRange(evt.target.value);
                  }}
                >
                  <MenuItem key={'lastHour'} value={'now-1H'}>
                    {intl.formatMessage(messages.lastHour)}
                  </MenuItem>
                  <MenuItem key={'lastDay'} value={'now-1d'}>
                    {intl.formatMessage(messages.lastDay)}
                  </MenuItem>
                  <MenuItem key={'lastWeek'} value={'now-7d'}>
                    {intl.formatMessage(messages.lastWeek)}
                  </MenuItem>
                  <MenuItem key={'lastMonth'} value={'now-1M'}>
                    {intl.formatMessage(messages.lastMonth)}
                  </MenuItem>
                  <MenuItem key={'allTime'} value={'all'}>
                    {intl.formatMessage(messages.allTime)}
                  </MenuItem>
                </TextField>
              </Grid>
              <Grid container
                spacing={8}
                justify="space-around"
                item
                xs={12}
              >
                <Grid item xs={4}>
                  <Card
                    className={classes.analyticsCard}
                  >
                    <CardHeader
                      title={intl.formatMessage(messages.requests)}
                      titleTypographyProps={{
                        className: classes.cardTitle
                      }}
                    />
                    <CardContent className={classes.analyticsCardContent}>
                      <Typography className={classes.valueLabel}>
                        {this.props.stats.documentsAnalyticsRequestCount}
                      </Typography>
                      <Typography className={classes.countLabel}>
                        {intl.formatMessage(messages.count)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card
                    className={classes.analyticsCard}
                  >
                    <CardHeader
                      title={intl.formatMessage(messages.sessions)}
                      titleTypographyProps={{
                        className: classes.cardTitle
                      }}
                    />
                    <CardContent className={classes.analyticsCardContent}>
                      <Typography className={classes.valueLabel}>
                        {this.props.stats.documentsAnalyticsSessionsCount}
                      </Typography>
                      <Typography className={classes.countLabel}>
                        {intl.formatMessage(messages.count)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card
                    className={classes.analyticsCard}
                  >
                    <CardHeader
                      title={intl.formatMessage(messages.fallbacks)}
                      titleTypographyProps={{
                        className: classes.cardTitle
                      }}
                    />
                    <CardContent className={classes.analyticsCardContent}>
                      <Typography className={classes.valueLabel}>
                        {this.props.stats.documentsAnalyticsFallbacksCount}
                      </Typography>
                      <Typography className={classes.countLabel}>
                        {intl.formatMessage(messages.count)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              <Grid container
                spacing={16}
                justify="space-around"
              >
                <Grid item xs={6}>
                  <Card
                    className={classes.analyticsCard}
                    style={{ height: 330 }}
                  >
                    <CardHeader
                      title={intl.formatMessage(messages.topActions
                      )}
                      titleTypographyProps={{
                        className: classes.cardTitle
                      }}
                    />
                    <CardContent className={classes.analyticsCardContent}>
                      {this.props.stats.documentsAnalyticsTopActions.length > 0 ?
                        <HorizontalBar
                          data={this.getTopActions(this.props.stats)}
                          options={{
                            maintainAspectRatio: true,
                            scales: {
                              xAxes: [{
                                ticks: {
                                  beginAtZero: true,
                                  stepSize: 1
                                }
                              }]
                            }
                          }}
                        /> :
                        <Typography>
                          {intl.formatMessage(messages.noActionsInvokedSoFar)}
                        </Typography>}
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>

                  <Card
                    className={classes.analyticsCard}
                    style={{ height: 330 }}
                  >
                    <CardHeader
                      title={intl.formatMessage(messages.requestsOverTime) + ' ' + this.getTimeFrequencyLabel(intl, messages)}
                      titleTypographyProps={{
                        className: classes.cardTitle
                      }}
                    />
                    <CardContent className={classes.analyticsCardContent}>
                      {this.props.stats.documentsAnalyticsRequestsOverTime.length > 0 ?
                        <Bar
                          data={this.getRequestsOverTime(this.props.stats)}
                          options={{
                            maintainAspectRatio: true,
                            scales: {
                              yAxes: [{
                                ticks: {
                                  beginAtZero: true,
                                  stepSize: Math.pow(10, this.getMaxRequestsOverTime(this.props.stats.documentsAnalyticsRequestsOverTime).toString().length - 1)
                                }
                              }]
                            }
                          }}
                        />
                        :
                        <Typography>
                          {intl.formatMessage(messages.noActionsInvokedSoFar)}
                        </Typography>}
                    </CardContent>
                  </Card>
                </Grid>
                {/*<Card
                  className={classes.analyticsCard}
                >
                  <CardContent className={classes.analyticsCardContent}>
                    <Grid container>
                      <Grid item xs={12}>
                        <Typography>
                          {intl.formatMessage(messages.webhookTimes)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        { 
                          <Typography>
                            {this.getAverageWebhookResponseTime(this.props.documents)}
                          </Typography>}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>*/}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

Form.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  documents: PropTypes.array,
  totalDocuments: PropTypes.number,
  dateRange: PropTypes.string,
  onSetDateRange: PropTypes.func
};

export default injectIntl(withStyles(styles)(Form));
