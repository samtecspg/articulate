import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import gravatars from 'components/Gravatar';
import { compose } from 'redux';
import { Link, withRouter } from 'react-router-dom';
import { injectIntl, intlShape } from 'react-intl';
import messages from '../messages';


const styles = {
  '@global': {
    '*': {
      boxSizing: 'border-box',
      mozBoxSizing: 'border-box',
      webkitBoxSizing: 'border-box',
      color: '#4e4e4e !important'
    },
    ul: {
      listStyleType: 'none',
      paddingLeft: '0'
    }
  },
  header: {
    width: '100%',
    height: '150px',
    background: '#703c82', /* Old browsers */
    background: '-moz-linear-gradient(top, #00bd6f 1%, #02f18e 99%)', /* FF3.6-15 */
    background: '-webkit-linear-gradient(top, #00bd6f 1%,#02f18e 99%)', /* Chrome10-25,Safari5.1-6 */
    background: 'linear-gradient(to bottom, #00bd6f 1%,#02f18e 99%)', /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: 'progid:DXImageTransform.Microsoft.gradient( startColorstr="#00bd6f", endColorstr="#02f18e", GradientType=0 )', /* IE6-9 */
    paddingTop: '22px',
    webkitTransition: 'all .2s ease-out',
    oTransition: 'all .2s ease-out',
    transition: 'all .2s ease-out'
  },
  container: {      
    width: '90%',
    margin: '0 auto'
  },
  cTarget: {
    webkitTransition: 'all .2s ease-out',
    oTransition: 'all .2s ease-out',
    transition: 'all .2s ease-out',
    height: '60px',
    overflow: 'hidden',
  },
  logo: {
    transition: 'all .03s ease-out',
    height: '55px',
  },
  agentName: {
    color: '#fff !important',
    position: 'relative',
    bottom: '15px',
    marginLeft: '10px',
    fontSize: '20px',
    fontWeight: 'bold'
  },
  searchArea: {
    width: '100%',
    position: 'relative',
    zIndex: '10',
    webkitTransition: 'all .2s ease-out',
    oTransition: 'all .2s ease-out',
    transition: 'all .2s ease-out',
  },
  searchAreaSection: {
    width: '90%',
    top: '-75px',
    position: 'absolute',
  },
  h1: {
    fontFamily: 'Montserrat, Arial',
    fontSize: '20px',
    color: 'white !important',
    marginBottom: '10px'
  },
  main: {
    width: '100%',
    paddingTop: '50px',
    minHeight: '600px',
    paddingBottom: '40px'
  },
  mainContent: {

  },
  mainContentTitle: {
    fontFamily: 'Montserrat, Arial',
    fontSize: '15px',
  },
  body: {
    width: '100%',
    height: '100vh',
    overflow: 'auto',
    webkitOverflowScrolling: 'touch',
    margin: '0',
    padding: '0',
    backgroundColor: '#F6F7F8',
  },
  btnBack: {
    border: '2px solid #4e4e4e',
    padding: '12px 38px',
    textDecoration: 'none',
    borderRadius: '6px',
    margin: '0 auto',
    display: 'inline-block',
    fontWeight: 'bold'
  }
};

class NotEnabledAgent extends React.Component {

  render() {
    const { classes, intl } = this.props;
    return (
      <Grid className={classes.body}>
        <Grid className={classes.header}>
          <Grid className={`${classes.container} ${classes.cTarget}`}>
            <a style={{textDecoration: 'none'}} href='#'>
              <Typography>
                {this.props.agent.gravatar !== ''
                ? gravatars[this.props.agent.gravatar - 1]({
                    color: '#fff',
                    className: classes.logo,
                  })
                : null}
                <span className={classes.agentName}>{this.props.agent.agentName}</span>
              </Typography>
            </a>
          </Grid>
        </Grid>
        <Grid className={classes.searchArea}>
          <Grid className={classes.container}>
            <section className={classes.searchAreaSection}>
              <h1 className={classes.h1}>{`${this.props.agent.agentName} ${intl.formatMessage(messages.title)}`}</h1>
            </section>
          </Grid>
        </Grid>
        <Grid className={classes.main}>
          <Grid className={classes.container}>
            <Grid className={classes.mainContent}>
              <span className={classes.mainContentTitle}>{intl.formatMessage(messages.notEnabledMessage)}</span>
            </Grid>
          <Grid style={{ textAlign: 'center', paddingTop: '30px' }} className={classes.container}>
            <Link className={classes.btnBack} to={`/`}>{intl.formatMessage(messages.backToArticulate)}</Link>
          </Grid>
          </Grid>
        </Grid>
      </Grid> 
    );
  }
}

NotEnabledAgent.propTypes = {
  intl: intlShape.isRequired,
  classes: PropTypes.object.isRequired,
  agent: PropTypes.object,
};

const withDefinedStyles = withStyles(styles);

export default 
  compose(
    withDefinedStyles,
  )(injectIntl(withRouter(NotEnabledAgent)));
