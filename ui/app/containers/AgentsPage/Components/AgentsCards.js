import React from 'react';
import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Card, CardContent, CardHeader, Slide, Typography }  from '@material-ui/core';
import { Link } from 'react-router-dom';

import messages from '../messages';
import exportIcon from '../../../images/export-icon.svg';
import importIcon from '../../../images/import-icon.svg';

const styles = {
  cardsContainer: {
    marginBottom: '80px',
  },
  newAgentCard: {
    border: '1px solid #00bd6f',
    height: '205px',
    width: '205px',
    position: 'relative'
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
    height: '150px'
  },
  agentCard: {
    border: '1px solid #a2a7b1',
    height: '205px',
    width: '205px',
    cursor: 'pointer',
    position: 'relative'
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
  link:{
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
    minHeight: '30px'
  },
  exportLabel: {
    '&:hover': {
      color: '#4a4a4a'
    },
    color: '#919192',
    marginLeft: '5px',
    cursor: 'pointer'
  },
  exportLabelReady: {
    color: '#00bd6f',
    marginLeft: '5px',
    cursor: 'pointer'
  },
  importLabel: {
    color: '#00bd6f',
    marginLeft: '5px',
    cursor: 'pointer'
  }
};

/* eslint-disable react/prefer-stateless-function */
class AgentsCards extends React.Component {

    constructor(props){
      super(props)
      this.addEmptyCards = this.addEmptyCards.bind(this);
    }

    state = {
      selectedAgent: null
    };

    addEmptyCards(numOfCards){
      const emptyCards = [];
      //the ui show 4 cards as max per row
      const numberOfRows = Math.ceil(numOfCards / 4);
      for (let index = 0; index < (numberOfRows * 4) - (1 + numOfCards); index++) {
        emptyCards.push(<Grid key={`emptyCard_${index}`} className={this.props.classes.emptyCard} />)
      }
      return emptyCards;
    };

    render(){
      const { classes, agents, onImportAgent } = this.props;
      return (
        <Grid className={classes.cardsContainer} justify={window.window.innerWidth < 675 ? 'center' : 'space-between'} container spacing={16}>
          <Grid key='newAgentCard' item>
            <Card className={classes.newAgentCard}>
              <CardContent  onClick={() => {this.props.onGoToUrl('/agent/create')}} className={classes.newAgentCardContent}>
                <FormattedMessage {...messages.createAgent}/>
              </CardContent>
              <Grid container justify='center' style={{ borderTop: '1px solid #00bd6f', position: 'absolute', width: '100%', bottom: 0, minHeight: '30px'}}>
                  <label style={{padding: '15px'}} htmlFor='import_agent'>
                    <Grid container justify='center'>
                      <img src={importIcon} />
                      <Typography className={classes.importLabel} variant='body1'>
                        <FormattedMessage {...messages.import} />
                      </Typography>
                    </Grid>
                  </label>
                  <input onChange={(evt) => { 
                    const files = evt.target.files; // FileList object

                    for (let i = 0, f; f = files[i]; i++) {
                      const reader = new FileReader();
                  
                      // Closure to capture the file information.
                      reader.onload = (function (theFile) {
                        return function (e) {
                          try {
                            const agent = JSON.parse(e.target.result);
                            onImportAgent(agent);
                          } catch (ex) {
                            console.error('ex when trying to parse json = ' + ex);
                          }
                        }
                      })(f);
                      reader.readAsText(f);
                    }}} 
                    accept="application/JSON" hidden id='import_agent' type='file'></input>
                </Grid>
            </Card>
          </Grid>
          {agents.map((agent, index) => (
            <Grid key={`agentCard_${index}`} item>
              <Card className={classes.agentCard}>
                <CardHeader onClick={() => {this.props.onGoToUrl(`/agent/${agent.id}`)}} className={classes.agentCardHeader} titleTypographyProps={{ className: classes.agentNameCard }} title={agent.agentName}/>
                <CardContent onClick={() => {this.props.onGoToUrl(`/agent/${agent.id}`)}} className={classes.agentCardContent}>
                  <Grid>
                    {agent.description}
                  </Grid>
                </CardContent>
                <Grid container justify='center' className={classes.exportFooter}>
                    {
                      this.props.agentExport && this.props.agentExport.agentName === agent.agentName ? 
                      <a onClick={() => {this.props.onExportAgent(0);}} style={{textDecoration: 'none', padding: '15px'}} href={`data: text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(this.props.agentExport, null, 2))}`} download={`${agent.agentName}.json`}>
                        <Grid container justify='center'>
                          <Typography className={classes.exportLabelReady} variant='body1'>
                            <FormattedMessage {...messages.download} />
                          </Typography>
                        </Grid>
                      </a> :
                      <Grid style={{padding: '15px'}} onClick={() => {this.props.onExportAgent(agent.id)}} container justify='center'>
                        <img src={exportIcon} />
                        <Typography className={classes.exportLabel} variant='body1'>
                          <FormattedMessage {...messages.export} />
                        </Typography>
                      </Grid>
                    }
                </Grid>
              </Card>
            </Grid>
          ))}
          {
            this.addEmptyCards(agents.length)
          }
        </Grid>
      )
    }
}

AgentsCards.propTypes = {
  classes: PropTypes.object.isRequired,
  agents: PropTypes.array.isRequired,
  onGoToUrl: PropTypes.func,
  onExportAgent: PropTypes.func,
  onImportAgent: PropTypes.func,
  agentExport: PropTypes.object
};

export default withStyles(styles)(AgentsCards);
