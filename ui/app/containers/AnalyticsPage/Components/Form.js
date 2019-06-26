import { Button, Grid, Modal, Typography, Card, CardContent, CardHeader } from '@material-ui/core';
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
  }
};

/* eslint-disable react/prefer-stateless-function */
class Form extends React.Component {
  state = {
    openModal: false,
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

  getTopActions = (documents) => {

    const actions = _.compact(documents.map((document) => {

      return document.rasa_results[0].action.name;
    }));
    const result = _.take(_.orderBy(_.values(_.groupBy(actions)).map(d => ({name: d[0], count: d.length})), 'count', 'desc'), 5);
    
    const data = {
      labels: _.map(result, 'name'),
      datasets: [
        {
          label: this.props.intl.formatMessage(messages.count),
          backgroundColor: '#3ccb8e',
          borderColor: '#3ccb8e',
          borderWidth: 1,
          hoverBackgroundColor: '#00c582',
          hoverBorderColor: '#00c582',
          data: _.map(result, 'count')
        }
      ]
    };

    return data
  };



  getRequestsOverTime = (documents) => {

    const timestamps = _.sortBy(_.map(documents, (document) => { return new Moment(document.time_stamp) }));
    const range = moment.range(timestamps[0].clone().subtract(1, 'minutes'), timestamps[timestamps.length - 1].clone().add(1, 'minutes'));
    const minutes = Array.from(range.by('minutes'));
    const labels = minutes.map(m => m.format('MM-DD-YYYY hh:mm'));
    const minutesOfRequests = timestamps.map(t => t.format('MM-DD-YYYY hh:mm'));
    
    const tempResult = _.values(_.groupBy(minutesOfRequests)).map(d => ({name: d[0], count: d.length}));

    const result = _.times(labels.length, _.constant(0));
    
    tempResult.forEach((minuteOfRequest) => {
      
      result[labels.indexOf(minuteOfRequest.name)] = minuteOfRequest.count;
    });
    
    const data = {
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

    return data
  };

  getAverageWebhookResponseTime = (documents) => {

    const webhookResponseTimes = _.compact(_.flattenDeep((documents.map((document) => {

      if (document.converseResult && document.converseResult.conversationStateObject && document.converseResult.conversationStateObject.webhooks){
        return document.converseResult.conversationStateObject.webhooks.map((webhook) => {

          return webhook.elapsed_time_ms;
        });
      }
      return null;
    }))));

    return webhookResponseTimes.length > 0 ? `${_.sum(webhookResponseTimes)/webhookResponseTimes.length} ms` : this.props.intl.formatMessage(messages.noWebhooksCallsSoFar);
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
                        {this.props.totalDocuments}
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
                          {_.uniqBy(this.props.documents, 'session').length}
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
                          {this.props.documents.filter((document) => {

                            return document.converseResult && document.converseResult.isFallback;
                          }).length}
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
                    style={{height: 330}}
                  >
                    <CardHeader
                      title={intl.formatMessage(messages.topActions
                        )}
                      titleTypographyProps={{
                        className: classes.cardTitle
                      }}
                    />
                    <CardContent className={classes.analyticsCardContent}>
                      {this.props.documents.length > 0 ?
                      <HorizontalBar
                        data={this.getTopActions(this.props.documents)}
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
                    style={{height: 330}}
                  >
                    <CardHeader
                      title={intl.formatMessage(messages.requestsOverTime)}
                      titleTypographyProps={{
                        className: classes.cardTitle
                      }}
                    />
                    <CardContent className={classes.analyticsCardContent}>
                      {this.props.documents.length > 0 ?
                      <Bar
                        data={this.getRequestsOverTime(this.props.documents)}
                        options={{
                          maintainAspectRatio: true,
                          scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    stepSize: 1
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
};

export default injectIntl(withStyles(styles)(Form));
