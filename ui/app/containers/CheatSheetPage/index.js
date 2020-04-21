import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import gravatars from 'components/Gravatar';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectSaga from '../../utils/injectSaga';
import { Link, withRouter } from 'react-router-dom';
import saga from './saga';
import {
  loadAgent, loadStarredSayings,
} from '../App/actions';
import {
  makeSelectAgent, makeSelectStarredSayings,
} from '../App/selectors';
import iconSearch from '../../images/icon_search.svg';
import { injectIntl, intlShape } from 'react-intl';
import messages from './messages';
import NotEnabledAgent from './components/NotEnabledAgent';


const styles = {
  '@global': {
    '*': {
      boxSizing: 'border-box',
      mozBoxSizing: 'border-box',
      webkitBoxSizing: 'border-box',
      color: '#4e4e4e'
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
    color: '#fff',
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
    color: 'white',
    marginBottom: '10px'
  },
  inputSearch: {
    '&:focus':{
      outlineWidth: 0,
      webkitBoxShadow: '0px 7px 47px -6px rgba(78,78,78,0.2)',
      mozBoxShadow: '0px 7px 47px -6px rgba(78,78,78,0.2)',
      boxShadow: '0px 7px 47px -6px rgba(78,78,78,0.2)'
    },
    position: 'relative',
    fontSize: '16px',
    maxWidth: '800px',
    width: '100%',
    height: '50px',
    paddingLeft: '37px',
    border: 'none',
    borderRadius: '6px',
    webkitBoxShadow: '0px 6px 47px -6px rgba(78,78,78,0.07)',
    mozBoxShadow: '0px 6px 47px -6px rgba(78,78,78,0.07)',
    boxShadow: '0px 6px 47px -6px rgba(78,78,78,0.07)',
    webkitTransition: 'all .2s ease-out',
    oTransition: 'all .2s ease-out',
    transition: 'all .2s ease-out',
    backgroundImage: `url("${iconSearch}")`,
    backgroundSize: '15px 15px',
    backgroundPosition: '13px 18px',
    backgroundRepeat: 'no-repeat',
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
  listSayingsItem: {
      fontFamily: 'Montserrat, Arial',
      marginBottom: '28px',
      lineHeight: '22px',
  },
  tagCategory: {
    fontStyle: 'italic',
    opacity: '0.7',
    fontSize: '13px',
    display: 'block'
  },
  body: {
    width: '100%',
    height: '100vh',
    overflow: 'auto',
    webkitOverflowScrolling: 'touch',
    margin: '0',
    padding: '0',
    backgroundColor: '#F6F7F8',
  }
};

class CheatSheetPage extends React.Component {

  componentWillMount() {
    this.props.onLoadAgent(this.props.match.params.id);
    this.props.onLoadStarredSayings(this.props.match.params.id);
  }

  render() {
    const { classes, intl } = this.props;
    return (
      this.props.agent.enableDiscoverySheet ?
      this.props.starredSayings ? 
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
              <input onChange={(evt) => { this.props.onLoadStarredSayings(this.props.agent.id, { userSays: evt.target.value }) }} className={classes.inputSearch} type='text' placeholder={intl.formatMessage(messages.searchPlaceholder)} />
            </section>
          </Grid>
        </Grid>
        <Grid className={classes.main}>
          <Grid className={classes.container}>
            <Grid className={classes.mainContent}>
              <span className={classes.mainContentTitle}>{intl.formatMessage(messages.examplesTitle)}:</span>
              <ul className={classes.listSayings}>
                {this.props.starredSayings.map((starredSaying, index) => {

                  return (
                    <li key={`starredSaying_${index}`} className={classes.listSayingsItem}>
                      <Link className={classes.btnBack} to={`/agent/${this.props.match.params.id}/discovery/saying/${starredSaying.id}?category=${starredSaying.category}`}>{starredSaying.userSays}</Link>
                      {starredSaying.Category ?
                      starredSaying.Category.map((starredSayingCategory, categoryIndex) => {

                        return (
                          <span key={`starredSaying_${index}_category_${categoryIndex}`} className={classes.tagCategory}>{starredSayingCategory.categoryName}</span>
                        )
                      }) : null}
                    </li>
                  )
                })}
              </ul>
            </Grid>
          </Grid>
        </Grid>
      </Grid> : 
      null :
      <NotEnabledAgent agent={this.props.agent} />
    );
  }
}

CheatSheetPage.propTypes = {
  intl: intlShape.isRequired,
  classes: PropTypes.object.isRequired,
  agent: PropTypes.object,
  starredSayings: PropTypes.array
};

const mapStateToProps = createStructuredSelector({
  agent: makeSelectAgent(),
  starredSayings: makeSelectStarredSayings()
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadAgent: agentId => {
      dispatch(loadAgent(agentId));
    },
    onLoadStarredSayings: (agentId, filter) => {
      dispatch(loadStarredSayings(agentId, filter ? filter : {}));
    }
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga({ key: 'saga', saga });
const withDefinedStyles = withStyles(styles);

export default 
  compose(
    withSaga,
    withDefinedStyles,
    withConnect
  )(injectIntl(withRouter(CheatSheetPage)));
