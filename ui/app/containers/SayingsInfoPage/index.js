import React from 'react';
import { Grid, Typography, Tooltip } from '@material-ui/core';
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
  loadAgent, loadStarredSaying, loadCategory, loadStarredSayings,
} from '../App/actions';
import {
  makeSelectAgent, makeSelectStarredSaying, makeSelectCategory, makeSelectStarredSayings,
} from '../App/selectors';
import copyToClipboardIcon from '../../images/icon-copy.svg';
import qs from 'query-string';
import _ from 'lodash';
import { injectIntl, intlShape } from 'react-intl';
import messages from './messages';
import NotEnabledAgent from '../CheatSheetPage/components/NotEnabledAgent';

const styles = {
  '@global': {
    '*': {
      fontFamily: 'Montserrat, Arial',
      boxSizing: 'border-box',
      mozBoxSizing: 'border-box',
      webkitBoxSizing: 'border-box',
      color: '#fff'
    },
    ul: {
      listStyleType: 'none',
      paddingLeft: '0'
    }
  },
  header: {
    width: '100%',
    paddingTop: '22px',
    webkitTransition: 'all .2s ease-out',
    oTransition: 'all .2s ease-out',
    transition: 'all .2s ease-out'
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
  sayingsInfo: {
    background: '-moz-linear-gradient(top, #00bd6f 1%, #02f18e 99%)',
    background: '-webkit-linear-gradient(top, #00bd6f 1%,#02f18e 99%)',
    background: 'linear-gradient(to bottom, #00bd6f 1%,#02f18e 99%)',
    filter: "progid:DXImageTransform.Microsoft.gradient( startColorstr='#00bd6f', endColorstr='#02f18e',GradientType=0 )",
    width: '100%',
    height: '100vh',
    overflow: 'auto',
    webkitOverflowScrolling: 'touch',
    margin: '0',
    padding: '0',
    backgroundColor: '#F6F7F8',
  },
  container: {      
    width: '90%',
    margin: '0 auto'
  },
  main: {
    width: '100%',
    paddingTop: '50px',
    minHeight: '600px',
    paddingBottom: '40px'
  },
  sayingsGroup: {
    marginBottom: '20px'
  },
  title: {
    fontSize: '15px'
  },
  applyToChat: {
    fontStyle: 'italic',
    float: 'right',
    opacity: '0.8',
    fontSize: '14px'
  },
  innerGroup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  saying: {
    fontWeight: 'bold'
  },
  iconCopy: {
    width: '19px',
    filter: 'brightness(5)',
    cursor: 'pointer'
  },
  iconChatBubble: {
    display: 'flex',
    alignItems: 'center',
  },
  category: {
    marginBottom: '40px'
  },
  descriptionGroup: {
    textDecoration: 'none',
    marginBottom: '40px'
  },
  description: {
    textDecoration: 'none',
    fontWeight: 'bold'
  },
  otherList: {
    display: 'block'
  },
  otherSayings: {
    textDecoration: 'underline',
    fontWeight: 'bold'
  },
  categoryTitle: {
    fontWeight: 'bold',
  },
  otherSayingsLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  btnBack: {
    border: '2px solid white',
    color: 'white',
    padding: '12px 38px',
    textDecoration: 'none',
    borderRadius: '6px',
    margin: '0 auto',
    display: 'inline-block',
    fontWeight: 'bold'
  }
};

class SayingsInfoPage extends React.Component {

  componentWillMount() {
    this.props.onLoadAgent(this.props.match.params.id);
    this.props.onLoadCategory(this.state.category);
    this.props.onLoadStarredSaying(this.props.match.params.id, this.state.category, this.props.match.params.sayingId)
    this.props.onLoadStarredSayings(this.props.match.params.id, {
      category: this.state.category
    })
  }

  state = {
    category: qs.parse(this.props.location.search, { ignoreQueryPrefix: true })
      .category
      ? qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).category
      : '',
    copiedToClipboard: false
  };

  copyToClipboard = (text) => {
    const textField = document.createElement('textarea');
    textField.innerText = text;
    document.body.appendChild(textField);

    let range,
    selection;
    if (navigator.userAgent.toLowerCase().match(/ipad|iphone/i)) {
      range = document.createRange();
      range.selectNodeContents(textField);
      selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      textField.select();
    }

    document.execCommand('copy');
    textField.remove();
    this.setState({ copiedToClipboard: true });
  };

  componentDidUpdate(){
    if(this.state.copiedToClipboard){
      setTimeout(() => {
        this.setState({ copiedToClipboard: false });
      }, 2000);
    }
  }

  render() {
    const { classes, agent, category, starredSaying, starredSayings, intl } = this.props;
    return (
      this.props.agent && this.props.agent.enableDiscoverySheet ?
      (starredSaying && starredSaying.starred ?
      <Grid className={classes.sayingsInfo}>
        <Tooltip open={this.state.copiedToClipboard} title={intl.formatMessage(messages.copiedToClipboard)} placement='top'>
          <div></div>
        </Tooltip>
        <Grid className={classes.header}>
          <Grid className={classes.container}>
            <a style={{textDecoration: 'none'}} href='#'>
              <Typography>
                {agent.gravatar !== ''
                ? gravatars[agent.gravatar - 1]({
                    color: '#fff',
                    className: classes.logo,
                  })
                : null}
                <span className={classes.agentName}>{agent.agentName}</span>
              </Typography>
            </a>
          </Grid>
        </Grid>

        <main className={classes.main}>

          <Grid className={classes.container}>
            <section>

              <Grid className={classes.sayingsGroup}>
                <span className={classes.title}>{intl.formatMessage(messages.sayIt)}:</span>
                <span className={classes.applyToChat}>({intl.formatMessage(messages.copyToClipboard)})</span>
                <div className={classes.innerGroup}>
                  <p className={classes.saying}>{starredSaying.userSays}</p>
                  <Grid className={classes.iconChatBubble}>
                    <img onClick={(e) => { e.preventDefault(); this.copyToClipboard(starredSaying.userSays) }} className={classes.iconCopy} src={copyToClipboardIcon}></img>
                  </Grid>
                </div>
              </Grid>

              <Grid className={classes.category}>
                <span className={classes.title}>{intl.formatMessage(messages.category)}:</span>
                <p className={classes.categoryTitle}>{category.categoryName}</p>
              </Grid>

              <Grid className={classes.descriptionGroup}>
                <span className={classes.title}>{intl.formatMessage(messages.description)}:</span>
                <p className={classes.description}>{starredSaying.description ? starredSaying.description : intl.formatMessage(messages.noDescription)}</p>
              </Grid>

              <Grid>
                <span className={classes.title}>{intl.formatMessage(messages.otherSuggestions)}:</span>
                <span className={classes.applyToChat}>({intl.formatMessage(messages.copyToClipboard)})</span>

                <ul className={`${classes.innerGroup} ${classes.otherList}`}>
                  {starredSayings.map((otherStarredSaying, index) => {

                  return starredSaying.userSays !== otherStarredSaying.userSays ?
                     (
                      <li key={`otherStarredSaying_${index}`}>
                        <div  className={classes.otherSayingsLink}>
                          <Link to={`/agent/${this.props.match.params.id}/discovery/sayingDummy/${otherStarredSaying.id}?category=${this.state.category}`}>
                            <p className={classes.otherSayings}>{otherStarredSaying.userSays}</p>
                          </Link>
                          <Grid className={classes.iconChatBubble}>
                            <img onClick={(e) => { e.preventDefault(); this.copyToClipboard(otherStarredSaying.userSays) }} className={classes.iconCopy} src={copyToClipboardIcon}></img>
                          </Grid>
                        </div>
                      </li>
                    ) : null
                  })}

                </ul>

              </Grid>

              <Grid style={{ textAlign: 'center', paddingTop: '30px' }} className={classes.container}>
                <Link className={classes.btnBack} to={`/agent/${this.props.match.params.id}/discovery`}>{intl.formatMessage(messages.back)}</Link>
              </Grid>

            </section>
          </Grid>

        </main>

      </Grid> :
      <Grid className={classes.sayingsInfo}>
        <Grid className={classes.header}>
          <Grid className={classes.container}>
            <a style={{textDecoration: 'none'}} href='#'>
              <Typography>
                {agent.gravatar !== ''
                ? gravatars[agent.gravatar - 1]({
                    color: '#fff',
                    className: classes.logo,
                  })
                : null}
                <span className={classes.agentName}>{agent.agentName}</span>
              </Typography>
            </a>
          </Grid>
        </Grid>

        <main className={classes.main}>

          <Grid className={classes.container}>
            <section>

              <Grid className={classes.sayingsGroup}>
                <div className={classes.innerGroup}>
                  <p className={classes.saying}>{intl.formatMessage(messages.sayingNotFoundOrNotStarred)}</p>
                </div>
              </Grid>

              <Grid style={{ textAlign: 'center', paddingTop: '30px' }} className={classes.container}>
                <Link className={classes.btnBack} to={`/agent/${this.props.match.params.id}/discovery`}>{intl.formatMessage(messages.back)}</Link>
              </Grid>

            </section>
          </Grid>

        </main>

      </Grid> ) :
      <NotEnabledAgent agent={this.props.agent} />
    );
  }
}

SayingsInfoPage.propTypes = {
  intl: intlShape.isRequired,
  classes: PropTypes.object.isRequired,
  agent: PropTypes.object,
  category: PropTypes.object,
  starredSaying: PropTypes.object,
  starredSayings: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  agent: makeSelectAgent(),
  category: makeSelectCategory(),
  starredSaying: makeSelectStarredSaying(),
  starredSayings: makeSelectStarredSayings(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadAgent: agentId => {
      dispatch(loadAgent(agentId));
    },
    onLoadStarredSaying: (agentId, categoryId, sayingId) => {
      dispatch(loadStarredSaying(agentId, categoryId, sayingId));
    },
    onLoadCategory: (categoryId) => {
      dispatch(loadCategory(categoryId));
    },
    onLoadStarredSayings: (agentId, filter) => {
      dispatch(loadStarredSayings(agentId, filter));
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
  )(injectIntl(withRouter(SayingsInfoPage)));
