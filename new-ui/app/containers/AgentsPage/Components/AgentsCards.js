import React from 'react';
import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Card, CardContent, CardHeader }  from '@material-ui/core';
import { Link } from 'react-router-dom';

import messages from '../messages';

const styles = {
    cardsContainer: {
      maxWidth: '990px'
    },
    newAgentCard: {
      border: '1px solid #00bd6f',
      height: '205px',
      width: '205px'
    },
    newAgentCardContent: {
      color: '#00bd6f',
      fontSize: '18px',
      fontFamily: 'Montserrat',
      height: '100%',
      width: '100%',
      alignItems: 'center',
      display: 'grid',
      textAlign: 'center'
    },
    agentCard: {
      border: '1px solid #a2a7b1',
      height: '205px',
      width: '205px'
    },
    agentCardHeader: {
      color: '#4e4e4e',
      fontSize: '22px',
      fontFamily: 'Montserrat',
      textAlign: 'left'
    },
    agentCardContent: {
      color: '#979797',
      fontSize: '14px',
      fontFamily: 'Montserrat',
      textAlign: 'left',
      paddingTop: 0,
    },
    emptyCard: {
      border: 0,
      height: 0,
      width: 245,
      backgroundColor: 'transparent'
    },
    link:{
        textDecoration: 'none'
    }
};

/* eslint-disable react/prefer-stateless-function */
function AgentsCards(props) {
    const { classes, agents } = props;

    const newAgentCard =
        <Grid key='newAgentCard' item>
            <Link to='/agent/create' className={classes.link}>
                <Card className={classes.newAgentCard}>
                <CardContent className={classes.newAgentCardContent}>
                    <FormattedMessage {...messages.createAgent}/>
                </CardContent>
                </Card>
            </Link>
        </Grid>
    ;

    const agentsCards = agents.map((agent, index) => {

        return (
            <Grid key={`agentCard_${index}`} item>
                <Link to={`/agent/${agent.id}`} className={classes.link}>
                    <Card className={classes.agentCard}>
                        <CardHeader className={classes.agentCardHeader} title={agent.agentName}/>
                        <CardContent className={classes.agentCardContent}>{agent.description}</CardContent>
                    </Card>
                </Link>
            </Grid>
        );
    });

    const cardsToFixLayout = [
        <Grid key="emptyCard_1" className={classes.emptyCard} />,
        <Grid key="emptyCard_2" className={classes.emptyCard} />,
        <Grid key="emptyCard_3" className={classes.emptyCard} />
    ];

    return (
        <Grid className={classes.cardsContainer} justify={window.window.innerWidth < 675 ? 'center' : 'space-between'} container spacing={40}>
            {newAgentCard}
            {agentsCards}
            {cardsToFixLayout}
        </Grid>
    );
};

AgentsCards.propTypes = {
    classes: PropTypes.object.isRequired,
    agents: PropTypes.array.isRequired
};

export default withStyles(styles)(AgentsCards);