/**
 *
 * SharedChatPage
 *
 */

import { Grid, Typography, CircularProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { intlShape, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectSaga from '../../utils/injectSaga';
import messages from './messages';
import saga from './saga';
import gravatars from '../../components/Gravatar';
import { makeSelectAgent, makeSelectConnection } from '../App/selectors';
import { loadConnection, toggleConversationBar } from '../App/actions';
import Markdown from 'markdown-to-jsx';

const styles = {
  mainContainer: {
    marginTop: '100px'
  },
  agentNameContainer: {
    margin: '0px 0px 20px 20px'
  },
  agentIcon: {
    marginRight: '5px',
    height: '30px',
    position: 'relative',
    top: '7px',
  },
  agentName: {
    fontWeight: '500',
    fontSize: '22px',
  },
  agentDescriptionContainer: {
    border: '1px solid #C5CBD8',
    backgroundColor: '#F6F7F8',
    borderTopLeftRadius: '3px',
    borderTopRightRadius: '3px',
  },
  agentDescriptionTitle: {
    fontSize: '18px',
    color: '#4E4E4E',
    margin: '20px',
    fontWeight: '500'
  },
  agentDescription: {
    fontSize: '14px',
    color: '#4E4E4E',
    margin: '20px'
  },
  messageContainer: {
    borderLeft: '1px solid #C5CBD8',
    borderRight: '1px solid #C5CBD8',
    borderBottom: '1px solid #C5CBD8',
    borderBottomLeftRadius: '3px',
    borderBottomRightRadius: '3px',
    boxShadow: '0 3px 0px 0px #C5CBD8',
    padding: '20px',
  },
  messageTitle: {
    fontSize: '18px',
    color: '#4E4E4E',
    fontWeight: '500',
    marginBottom: '20px'
  },
  message: {
    fontSize: '14px',
    color: '#4E4E4E',
    fontFamily: 'Montserrat'
  }
}

/* eslint-disable react/prefer-stateless-function */
export class SharedChatPage extends React.PureComponent {

  componentWillMount() {
    this.props.onLoadConnection(this.props.match.params.id);
    this.props.onToggleConversationBar(true);
  }

  render() {
    const { agent, connection, classes, intl } = this.props;
    return (
      agent.id ?
        <Grid container className={classes.mainContainer}>
          <Grid className={classes.agentNameContainer} item xs={12}>
            <Typography
              className={classes.agentName}
              style={{ color: agent.uiColor }}
            >
              {gravatars[agent.gravatar - 1]({
                color: agent.uiColor,
                className: classes.agentIcon,
              })}
              <span className={classes.agentName}>{agent.agentName}</span>
            </Typography>
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={12} className={classes.agentDescriptionContainer}>
              <Typography className={classes.agentDescriptionTitle}>
                {intl.formatMessage(messages.agentDescription)}
              </Typography>
              <Typography className={classes.agentDescription}>
                {agent.description}
              </Typography>
            </Grid>
            <Grid item xs={12} className={classes.messageContainer}>
              <Typography className={classes.messageTitle}>
                {connection.details.messageTitle}
              </Typography>
              <Markdown className={classes.message}>{connection.details.message}</Markdown>
            </Grid>
          </Grid>
        </Grid> :
        <CircularProgress
          style={{ position: 'absolute', top: '40%', left: '49%' }}
        />
    );
  }
}

SharedChatPage.propTypes = {
  intl: intlShape.isRequired,
  agent: PropTypes.object,
  classes: PropTypes.object
};

const mapStateToProps = createStructuredSelector({
  agent: makeSelectAgent(),
  connection: makeSelectConnection(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadConnection(id) {
      dispatch(loadConnection(id));
    },
    onToggleConversationBar(value) {
      dispatch(toggleConversationBar(value));
    }
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga({ key: 'sharedChat', saga });


const withDefinedStyles = withStyles(styles);

export default compose(
  withDefinedStyles,
  withSaga,
  withConnect,
  injectIntl
)(SharedChatPage);
