/**
 *
 * AnalyticsPage
 *
 */

import { Grid, CircularProgress } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import MainTab from '../../components/MainTab';
import injectSaga from '../../utils/injectSaga';
import Nes from 'nes';
import { getWS } from '../../utils/locationResolver';
import _ from 'lodash';

import {
  trainAgent, loadKeywords, loadActions, loadAgentDocuments, loadAgentDocumentsSuccess,
  toggleChatButton, loadAgentStats
} from '../App/actions';

import { AUTH_ENABLED } from "../../../common/env";
import {
  ROUTE_DOCUMENT,
  ROUTE_SEARCH,
  ROUTE_AGENT,
} from '../../../common/constants';

import {
  makeSelectAgent,
  makeSelectServerStatus,
  makeSelectDocumentsStats
} from '../App/selectors';

import Form from './Components/Form';
import saga from './saga';

/* eslint-disable react/prefer-stateless-function */
export class AnalyticsPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.throttleStats = this.throttleStats.bind(this);
  }

  state = {
    client: null,
    socketClientConnected: false,
    dateRange: 'all'
  };

  componentWillMount() {
    const {
      onLoadKeywords,
      onLoadActions,
      onLoadStats
    } = this.props;

    onLoadKeywords();
    onLoadActions();
    onLoadStats(this.getAgentStatsFilters(this.state.dateRange));

    if (!this.state.socketClientConnected) {
      const client = new Nes.Client(getWS());
      client.onConnect = () => {
        this.setState({
          client,
          socketClientConnected: true,
        });

        const handler = () => {
          this.throttleStats();
        };

        client.subscribe(
          `/${ROUTE_AGENT}/${this.props.agent.id}/${ROUTE_DOCUMENT}/${ROUTE_SEARCH}`,
          handler,
        );
      };
      client.connect({
        delay: 1000,
        auth: AUTH_ENABLED
          ? { headers: { cookie: document.cookie } }
          : undefined,
      });
    }
    this.props.onShowChatButton(true);
  }

  componentWillUnmount() {
    if (this.state.client) {
      this.state.client.unsubscribe(`/${ROUTE_AGENT}/${this.props.agent.id}/${ROUTE_DOCUMENT}/${ROUTE_SEARCH}`);
    }
  }

  throttleStats = _.throttle(
    function () { this.props.onLoadStats(this.getAgentStatsFilters(this.state.dateRange)) }
    ,
    5000,
    { trailing: true });


  render() {
    const { agent, onTrain } = this.props;
    return agent.id ? (
      <Grid container>
        <MainTab
          disableSave
          agentName={agent.agentName}
          agentGravatar={agent.gravatar ? agent.gravatar : 1}
          agentUIColor={agent.uiColor}
          onTrain={onTrain}
          agentStatus={agent.status}
          serverStatus={this.props.serverStatus}
          lastTraining={agent.lastTraining}
          enableTabs
          selectedTab="analytics"
          agentForm={Link}
          agentURL={`/agent/${agent.id}?ref=mainTab`}
          analyticsForm={
            <Form
              stats={this.props.stats}
              dateRange={this.state.dateRange}
              onSetDateRange={(dateRange) => {
                this.setState({
                  dateRange
                });
                this.props.onLoadStats(this.getAgentStatsFilters(dateRange));
              }}
            />
          }
          agentForm={Link}
          agentURL={`/agent/${agent.id}?ref=mainTab`}
          dialogueForm={Link}
          dialogueURL={`/agent/${this.props.agent.id}/dialogue`}
          reviewForm={Link}
          reviewURL={`/agent/${this.props.agent.id}/review`}
        />
      </Grid>
    ) : (
        <CircularProgress
          style={{ position: 'absolute', top: '40%', left: '49%' }}
        />
      );
  }

  getTimeGranularity(dateRange) {
    switch (dateRange) {
      case 'now-1H':
        return '1m';
      case 'now-1d':
        return '1h'
      case 'now-7d':
        return '1d';
      case 'now-1M':
        return '1w';
      default:
        return '1M';
    }
  }

  getAgentStatsFilters = function (dateRange) {

    let filterDocumentsAnalyticsRequestCount = {
      "from": 0,
      "size": 0,
      "query": {
        "bool": {
          "must": [
            {
              "match": {
                "agent_id": this.props.agent.id
              }
            }
          ]
        }
      }
    }

    if (dateRange && dateRange != 'all') {
      filterDocumentsAnalyticsRequestCount.query.bool.must.push({
        "range": {
          "time_stamp": {
            "gte": dateRange + "/m",
            "lt": "now"
          }
        }
      })
    }


    let filterdocumentsAnalyticsSessionsCount = {
      "from": 0,
      "size": 0,
      "query": {
        "bool": {
          "must": [
            {
              "match": {
                "agent_id": this.props.agent.id
              }
            }
          ]
        }
      },
      "aggs": {
        "unique_sessions": {
          "cardinality": {
            "field": "session"
          }
        }
      }
    }

    if (dateRange && dateRange != 'all') {
      filterdocumentsAnalyticsSessionsCount.query.bool.must.push({
        "range": {
          "time_stamp": {
            "gte": dateRange + "/m",
            "lt": "now"
          }
        }
      })
    }


    let filterdocumentsAnalyticsFallbacksCount = {
      "from": 0,
      "size": 0,
      "query": {
        "bool": {
          "must": [
            {
              "match": {
                "agent_id": this.props.agent.id
              }
            },
            {
              "nested": {
                "path": "converseResult",
                "query": {
                  "bool": {
                    "must": [
                      {
                        "match": {
                          "converseResult.isFallback": "true"
                        }
                      }
                    ]
                  }
                }
              }
            }
          ]
        }
      }
    }

    if (dateRange && dateRange != 'all') {
      filterdocumentsAnalyticsFallbacksCount.query.bool.must.push({
        "range": {
          "time_stamp": {
            "gte": dateRange + "/m",
            "lt": "now"
          }
        }
      })
    }

    let filterdocumentsAnalyticsTopActions = {
      "from": 0,
      "size": 0,
      "query": {
        "bool": {
          "must": [
            {
              "match": {
                "agent_id": this.props.agent.id
              }
            }
          ]
        }
      },
      "aggs": {
        "actions_count": {
          "terms": {
            "field": "recognized_action"
          }
        }
      }
    }

    if (dateRange && dateRange != 'all') {
      filterdocumentsAnalyticsTopActions.query.bool.must.push({
        "range": {
          "time_stamp": {
            "gte": dateRange + "/m",
            "lt": "now"
          }
        }
      })
    }

    let filterdocumentsAnalyticsRequestsOverTime = {
      "from": 0,
      "size": 0,
      "query": {
        "bool": {
          "must": [
            {
              "match": {
                "agent_id": this.props.agent.id
              }
            }
          ]
        }
      },
      "aggs": {
        "start_time": {
          "date_histogram": {
            "field": "time_stamp",
            "interval": this.getTimeGranularity(dateRange),
            "time_zone": Intl.DateTimeFormat().resolvedOptions().timeZone,
            "min_doc_count": 1
          }
        }
      }
    }

    if (dateRange && dateRange != 'all') {
      filterdocumentsAnalyticsRequestsOverTime.query.bool.must.push({
        "range": {
          "time_stamp": {
            "gte": dateRange + "/m",
            "lt": "now"
          }
        }
      })
    }

    return [{
      filterName: 'documentsAnalyticsRequestCount',
      filter: filterDocumentsAnalyticsRequestCount
    },
    {
      filterName: 'documentsAnalyticsSessionsCount',
      filter: filterdocumentsAnalyticsSessionsCount
    },
    {
      filterName: 'filterdocumentsAnalyticsFallbacksCount',
      filter: filterdocumentsAnalyticsFallbacksCount
    },
    {
      filterName: 'filterdocumentsAnalyticsTopActions',
      filter: filterdocumentsAnalyticsTopActions
    },
    {
      filterName: 'filterdocumentsAnalyticsRequestsOverTime',
      filter: filterdocumentsAnalyticsRequestsOverTime
    }]
  }
}

AnalyticsPage.propTypes = {
  agent: PropTypes.object,
  serverStatus: PropTypes.string,
  onTrain: PropTypes.func,
  onShowChatButton: PropTypes.func
};

const mapStateToProps = createStructuredSelector({
  agent: makeSelectAgent(),
  serverStatus: makeSelectServerStatus(),
  stats: makeSelectDocumentsStats(),
});

function mapDispatchToProps(dispatch) {
  return {
    onTrain: () => {
      dispatch(trainAgent());
    },
    onLoadKeywords: () => {
      dispatch(loadKeywords());
    },
    onLoadActions: () => {
      dispatch(loadActions());
    },
    onLoadStats: (filters) => {
      dispatch(loadAgentStats(filters));
    },
    onShowChatButton: value => {
      dispatch(toggleChatButton(value));
    }
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga({ key: 'analytics', saga });

export default
  compose(
    withSaga,
    withConnect,
  )(withRouter(AnalyticsPage));

