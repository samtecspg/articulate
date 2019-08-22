import React from 'react';
import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Slide,
  Typography,
  Tooltip,
} from '@material-ui/core';

import messages from '../messages';
import exportIcon from '../../../images/export-icon.svg';
import importIcon from '../../../images/import-icon.svg';
import gravatars from '../../../components/Gravatar';

const styles = {
  cardsContainer: {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    marginBottom: '30px',
    flexWrap: 'nowrap',
    overflowX: 'scroll',
    scrollbarWidth: 'none',
  },
  newAgentCard: {
    border: '1px solid #00bd6f',
    height: '205px',
    width: '205px',
    position: 'relative',
  },
  newAgentCardContent: {
    color: '#00bd6f',
    fontSize: '18px',
    fontFamily: 'Montserrat',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    display: 'grid',
    textAlign: 'center',
    cursor: 'pointer',
    height: '150px',
  },
  agentCard: {
    border: '1px solid #a2a7b1',
    height: '205px',
    width: '205px',
    cursor: 'pointer',
    position: 'relative',
  },
  emptyCard: {
    border: 0,
    height: 0,
    width: 220,
    backgroundColor: 'transparent',
  },
  agentCardHeader: {
    color: '#4e4e4e',
    fontSize: '22px',
    fontFamily: 'Montserrat',
    textAlign: 'left',
  },
  agentNameCard: {
    fontSize: '18px',
  },
  agentCardContent: {
    color: '#979797',
    fontSize: '14px',
    fontFamily: 'Montserrat',
    textAlign: 'left',
    paddingTop: 0,
    height: '95px',
  },
  link: {
    textDecoration: 'none',
  },
  menuIcon: {
    float: 'right',
    top: '23px',
    right: '20px',
    cursor: 'pointer',
    position: 'relative',
  },
  trashIcon: {
    position: 'relative',
    top: '2px',
    marginRight: '5px',
  },
  exportFooter: {
    borderTop: '1px solid #979797',
    position: 'absolute',
    width: '100%',
    bottom: 0,
    minHeight: '30px',
  },
  exportLabel: {
    '&:hover': {
      color: '#4a4a4a',
    },
    color: '#919192',
    marginLeft: '5px',
    cursor: 'pointer',
  },
  exportLabelReady: {
    color: '#00bd6f',
    marginLeft: '5px',
    cursor: 'pointer',
  },
  importLabel: {
    color: '#00bd6f',
    marginLeft: '5px',
    cursor: 'pointer',
  },
  agentIcon: {
    marginRight: '5px',
    height: '20px',
  },
  agentName: {
    position: 'relative',
    bottom: '3px',
    fontWeight: '500',
  },
};

/* eslint-disable react/prefer-stateless-function */
class AgentsCards extends React.Component {
  constructor(props) {
    super(props);
    this.addEmptyCards = this.addEmptyCards.bind(this);
  }

  state = {
    selectedAgent: null,
  };

  componentDidMount() {
    if (document.getElementById('dvCardsContainer').addEventListener) {
      // IE9, Chrome, Safari, Opera
      document
        .getElementById('dvCardsContainer')
        .addEventListener('mousewheel', this.scrollHorizontally, false);
      // Firefox
      document
        .getElementById('dvCardsContainer')
        .addEventListener('DOMMouseScroll', this.scrollHorizontally, false);
    } else {
      // IE 6/7/8
      document
        .getElementById('dvCardsContainer')
        .attachEvent('onmousewheel', this.scrollHorizontally);
    }
  }

  scrollHorizontally(e) {
    e = window.event || e;
    const delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
    document.getElementById('dvCardsContainer').scrollLeft -= delta * 40; // Multiplied by 40
    e.preventDefault();
  }

  addEmptyCards(numOfCards) {
    const emptyCards = [];
    // the ui show 4 cards as max per row
    const numberOfRows = Math.ceil(numOfCards / 4);
    for (let index = 0; index < numberOfRows * 4 - (1 + numOfCards); index++) {
      emptyCards.push(
        <Grid
          key={`emptyCard_${index}`}
          className={this.props.classes.emptyCard}
        />,
      );
    }
    return emptyCards;
  }

  render() {
    const { classes, agents, onImportAgent } = this.props;
    return (
      <Grid
        id="dvCardsContainer"
        className={classes.cardsContainer}
        justify={window.window.innerWidth < 675 ? 'center' : 'flex-start'}
        container
        spacing={16}
      >
        <Grid key="newAgentCard" item>
          <Card className={classes.newAgentCard}>
            <CardContent
              onClick={() => {
                this.props.onGoToUrl('/agent/create');
              }}
              className={classes.newAgentCardContent}
            >
              <FormattedMessage {...messages.createAgent} />
            </CardContent>
            <Grid
              container
              justify="center"
              style={{
                borderTop: '1px solid #00bd6f',
                position: 'absolute',
                width: '100%',
                bottom: 0,
                minHeight: '30px',
              }}
            >
              <label style={{ padding: '15px' }} htmlFor="import_agent">
                <Grid container justify="center">
                  <img src={importIcon} />
                  <Typography className={classes.importLabel} variant="body1">
                    <FormattedMessage {...messages.import} />
                  </Typography>
                </Grid>
              </label>
              <input
                onChange={evt => {
                  const { files } = evt.target; // FileList object

                  for (let i = 0, f; (f = files[i]); i++) {
                    const reader = new FileReader();

                    // Closure to capture the file information.
                    reader.onload = (function(theFile) {
                      return function(e) {
                        try {
                          const agent = JSON.parse(e.target.result);
                          onImportAgent(agent);
                        } catch (ex) {
                          console.error(`ex when trying to parse json = ${ex}`);
                        }
                      };
                    })(f);
                    reader.readAsText(f);
                  }
                }}
                accept="application/JSON"
                hidden
                id="import_agent"
                type="file"
              />
            </Grid>
          </Card>
        </Grid>
        {agents.map((agent, index) => (
          <Grid key={`agentCard_${index}`} item>
            <Card className={classes.agentCard}>
              <CardHeader
                onClick={() => {
                  this.props.onToggleConversationBar(false);
                  this.props.onShowChatButton(true);
                  this.props.onGoToUrl(`/agent/${agent.id}`);
                }}
                className={classes.agentCardHeader}
                titleTypographyProps={{
                  className: classes.agentNameCard,
                  style: {
                    color: agent.uiColor,
                  },
                }}
                title={
                  <span>
                    {gravatars[agent.gravatar - 1]({
                      color: agent.uiColor,
                      className: classes.agentIcon,
                    })}
                    <Tooltip title={agent.agentName} placement="top">
                      <span className={classes.agentName}>
                        {agent.agentName.length > 11
                          ? `${agent.agentName.substring(0, 11).trim()}...`
                          : agent.agentName}
                      </span>
                    </Tooltip>
                  </span>
                }
              />
              <CardContent
                onClick={() => {
                  this.props.onShowChatButton(true);
                  this.props.onGoToUrl(`/agent/${agent.id}`);
                }}
                className={classes.agentCardContent}
              >
                <Grid>
                  {agent.description.length > 65
                    ? `${agent.description.substring(0, 64).trim()}...`
                    : agent.description}
                </Grid>
              </CardContent>
              <Grid container justify="center" className={classes.exportFooter}>
                {this.props.agentExport &&
                this.props.agentExport.agentName === agent.agentName ? (
                  <a
                    onClick={() => {
                      this.props.onExportAgent(0);
                    }}
                    style={{ textDecoration: 'none', padding: '15px' }}
                    href={`data: text/json;charset=utf-8,${encodeURIComponent(
                      JSON.stringify(this.props.agentExport, null, 2),
                    )}`}
                    download={`${agent.agentName}.json`}
                  >
                    <Grid container justify="center">
                      <Typography
                        className={classes.exportLabelReady}
                        variant="body1"
                      >
                        <FormattedMessage {...messages.download} />
                      </Typography>
                    </Grid>
                  </a>
                ) : (
                  <Grid
                    style={{ padding: '15px' }}
                    onClick={() => {
                      this.props.onExportAgent(agent.id);
                    }}
                    container
                    justify="center"
                  >
                    <img src={exportIcon} />
                    <Typography className={classes.exportLabel} variant="body1">
                      <FormattedMessage {...messages.export} />
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Card>
          </Grid>
        ))}
        {this.addEmptyCards(agents.length)}
      </Grid>
    );
  }
}

AgentsCards.propTypes = {
  classes: PropTypes.object.isRequired,
  agents: PropTypes.array.isRequired,
  onGoToUrl: PropTypes.func,
  onExportAgent: PropTypes.func,
  onImportAgent: PropTypes.func,
  agentExport: PropTypes.object,
  onToggleConversationBar : PropTypes.func,
  onShowChatButton : PropTypes.func
};

export default withStyles(styles)(AgentsCards);
