/**
 *
 * ReviewPage
 *
 */

import {
  CircularProgress,
  Grid,
} from '@material-ui/core';
import _ from 'lodash';
import Nes from 'nes';
import PropTypes from 'prop-types';
import qs from 'query-string';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
import {
  bindActionCreators,
  compose,
} from 'redux';
import { createStructuredSelector } from 'reselect';
import MainTab from '../../components/MainTab';
import { ACTION_INTENT_SPLIT_SYMBOL } from '../../utils/constants';
import injectSaga from '../../utils/injectSaga';
import { getWS } from '../../utils/locationResolver';
import * as Actions from '../App/actions';
import {
  makeSelectActions,
  makeSelectAgent,
  makeSelectCategories,
  makeSelectDocuments,
  makeSelectFilteredCategories,
  makeSelectKeywords,
  makeSelectNewSayingActions,
  makeSelectSelectedCategory,
  makeSelectTotalDocuments,
} from '../App/selectors';
import Form from './Components/Form';
import saga from './saga';

/* eslint-disable react/prefer-stateless-function */
export class ReviewPage extends React.Component {
  constructor(props) {
    super(props);
    this.changePage = this.changePage.bind(this);
    this.movePageBack = this.movePageBack.bind(this);
    this.movePageForward = this.movePageForward.bind(this);
    this.changePageSize = this.changePageSize.bind(this);
    this.onSearchSaying = this.onSearchSaying.bind(this);
    this.setNumberOfPages = this.setNumberOfPages.bind(this);
    this.copySayingFromDocument = this.copySayingFromDocument.bind(this);
    this.handleOnRequestSort = this.handleOnRequestSort.bind(this);
    this.initForm = this.initForm.bind(this);
  }

  state = {
    filter: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).filter ? qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).filter : '',
    currentPage: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).page ? parseInt(qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).page) : 1,
    pageSize: this.props.agent.id ? this.props.agent.settings.reviewPageSize : 5,
    numberOfPages: null,
    totalDocuments: null,
    documents: [],
    sortField: 'time_stamp',
    sortDirection: 'DESC',
    client: null,
    socketClientConnected: false,
  };

  async initForm() {
    const {
      onLoadKeywords,
      onLoadActions,
      onLoadCategories,
      onLoadAgentDocuments,
      onRefreshDocuments,
    } = this.props.actions;

    this.setState({
      pageSize: this.props.agent.settings.reviewPageSize,
    });
    this.setNumberOfPages(this.props.agent.settings.reviewPageSize);
    onLoadKeywords();
    onLoadActions();
    onLoadCategories();
    onLoadAgentDocuments(this.state.currentPage, this.state.pageSize, this.state.sortField, this.state.sortDirection);

    if (!this.state.socketClientConnected) {
      const client = new Nes.Client(getWS());
      client.connect((err) => {

        if (err) {
          console.error('An error occurred connecting to the socket: ', err);
        }
        this.setState({
          client,
          socketClientConnected: true,
        });

        const handler = (documents) => {

          if (documents) {
            const payload = { documents: documents.data, total: documents.totalCount };
            onRefreshDocuments(payload);
          }
        };
        this.state.client.subscribe(`/agent/${this.props.agent.id}/doc`, handler, (errSubscription) => {
          if (errSubscription) {
            console.error(`An error occurred subscribing to the agent ${this.props.agent.agentName} to get documents: ${errSubscription}`);
          }
        });
      });
    }
  }

  componentWillMount() {
    if (this.props.agent.id) {
      this.initForm();
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.agent.id && this.props.agent.id) {
      this.initForm();
    }
    const { documents } = this.props;
    if (documents !== this.state.documents) {
      this.setState({ documents });
      this.setNumberOfPages(this.state.pageSize);
    }
  }

  componentWillUnmount() {
    if (this.state.client) {
      if (this.props.agent.id) {
        this.state.client.unsubscribe(`/agent/${this.state.agent}/doc`);
      }
    }
  }

  setNumberOfPages(pageSize) {
    const numberOfPages = Math.ceil(this.props.totalDocuments / pageSize);
    this.setState({
      numberOfPages,
    });
  }

  changePage(pageNumber) {
    const { onLoadAgentDocuments } = this.props.actions;
    this.setState({
      currentPage: pageNumber,
    });
    onLoadAgentDocuments(pageNumber, this.state.pageSize, this.state.sortField, this.state.sortDirection);
  }

  movePageBack() {
    let newPage = this.state.currentPage;
    if (this.state.currentPage > 1) {
      newPage = this.state.currentPage - 1;
    }
    this.changePage(newPage);
  }

  movePageForward() {
    let newPage = this.state.currentPage;
    if (this.state.currentPage < this.state.numberOfPages) {
      newPage = this.state.currentPage + 1;
    }
    this.changePage(newPage);
  }

  changePageSize(pageSize) {
    const {
      onLoadAgentDocuments,
      onChangeReviewPageSize,
    } = this.props.actions;
    this.setState({
      currentPage: 1,
      pageSize,
    });
    onChangeReviewPageSize(this.props.agent.id, pageSize);
    onLoadAgentDocuments(1, pageSize, this.state.sortField, this.state.sortDirection);
  }

  onSearchSaying(filter) {
    const { onLoadAgentDocuments } = this.props.actions;
    this.setState({
      filter,
      currentPage: 1,
    });
    onLoadAgentDocuments(1, this.state.pageSize, this.state.sortField, this.state.sortDirection);

  }

  copySayingFromDocument(userSays, saying) {
    const { agentCategories, agentKeywords, onGoToUrl, agent } = this.props;
    if (saying.categoryScore === 0) {
      onGoToUrl(`/agent/${agent.id}/sayings?userSays=${userSays}`);
    }
    else {
      const { onCopySaying } = this.props.actions;
      const category = _.find(agentCategories, { 'categoryName': saying.category });
      const sayingToCopy = {
        userSays,
        keywords: saying.keywords.map((keyword) => {
          const agentKeyword = _.find(agentKeywords, { 'keywordName': keyword.keyword });
          return {
            'value': keyword.value.value,
            'keyword': keyword.keyword,
            'start': keyword.start,
            'end': keyword.end,
            'keywordId': agentKeyword.id,
          };
        }),
        actions: saying.action.name === '' ? [] : saying.action.name.split(ACTION_INTENT_SPLIT_SYMBOL),
        categoryId: category ? category.id : null,
      };
      onCopySaying(sayingToCopy);
    }
  }

  handleOnRequestSort(id) {
    const { onLoadAgentDocuments } = this.props.actions;
    const sortField = id;
    let sortDirection = 'DESC';

    if (this.state.sortField === id && this.state.sortDirection === 'DESC') {
      sortDirection = 'ASC';
    }
    this.setState({ sortDirection, sortField });
    onLoadAgentDocuments(this.state.currentPage, this.state.pageSize, sortField, sortDirection);
  }

  render() {
    const {
      onDeleteSaying,
      onTagKeyword,
      onUntagKeyword,
      onAddAction,
      onDeleteAction,
      onAddNewSayingAction,
      onDeleteNewSayingAction,
      onSendSayingToAction,
      onClearSayingToAction,
      onSelectCategory,
      onTrain,
      onToggleConversationBar,
      onSendMessage,
    } = this.props.actions;

    const {
      agent,
      documents,
      agentCategories,
      agentFilteredCategories,
      agentKeywords,
      agentActions,
      category,
      newSayingActions,
    } = this.props;
    return (
      this.props.agent.id ?
        <Grid container>
          <MainTab
            disableSave
            agentName={agent.agentName}
            onTrain={onTrain}
            agentStatus={agent.status}
            lastTraining={agent.lastTraining}
            enableTabs
            selectedTab="review"
            agentForm={Link}
            agentURL={`/agent/${agent.id}`}
            reviewForm={
              <Form
                agentId={agent.id}
                documents={documents}
                agentKeywords={agentKeywords}
                agentActions={agentActions}
                agentCategories={agentCategories}
                agentFilteredCategories={agentFilteredCategories}
                onCopySaying={this.copySayingFromDocument}
                onDeleteSaying={() => onDeleteSaying(null, this.state.pageSize)}
                onTagKeyword={() => onTagKeyword(null, this.state.filter, this.state.currentPage, this.state.pageSize)}
                onUntagKeyword={() => onUntagKeyword(null, this.state.filter, this.state.currentPage, this.state.pageSize)}
                onAddAction={() => onAddAction(null, this.state.filter, this.state.currentPage, this.state.pageSize)}
                onDeleteAction={() => onDeleteAction(null, this.state.filter, this.state.currentPage, this.state.pageSize)}
                onAddNewSayingAction={onAddNewSayingAction}
                onDeleteNewSayingAction={onDeleteNewSayingAction}
                onSearchSaying={this.onSearchSaying}
                onSearchCategory={this.onSearchCategory}
                onSendSayingToAction={onSendSayingToAction}
                currentPage={this.state.currentPage}
                pageSize={this.state.pageSize}
                numberOfPages={this.state.numberOfPages}
                changePage={this.changePage}
                movePageBack={this.movePageBack}
                movePageForward={this.movePageForward}
                changePageSize={this.changePageSize}
                onSelectCategory={onSelectCategory}
                category={category}
                newSayingActions={newSayingActions}
                onClearSayingToAction={onClearSayingToAction}
                onToggleConversationBar={onToggleConversationBar}
                onSendMessage={onSendMessage}
                onRequestSort={this.handleOnRequestSort}
                sortField={this.state.sortField}
                sortDirection={this.state.sortDirection}
              />
            }
            sayingsURL={`/agent/${agent.id}/sayings`}
            sayingsForm={Link}
            keywordsForm={Link}
            keywordsURL={`/agent/${agent.id}/keywords`}
          />
        </Grid> :
        <CircularProgress style={{ position: 'absolute', top: '40%', left: '49%' }} />
    );
  }
}

ReviewPage.propTypes = {
  actions: PropTypes.shape({
    onLoadAgentDocuments: PropTypes.func.isRequired,
    onLoadFilteredCategories: PropTypes.func.isRequired,
    onLoadCategories: PropTypes.func.isRequired,
    onLoadKeywords: PropTypes.func.isRequired,
    onLoadActions: PropTypes.func.isRequired,
    onCopySaying: PropTypes.func.isRequired,
    onDeleteSaying: PropTypes.func.isRequired,
    onTagKeyword: PropTypes.func.isRequired,
    onUntagKeyword: PropTypes.func.isRequired,
    onAddAction: PropTypes.func.isRequired,
    onDeleteAction: PropTypes.func.isRequired,
    onAddNewSayingAction: PropTypes.func.isRequired,
    onDeleteNewSayingAction: PropTypes.func.isRequired,
    onSendSayingToAction: PropTypes.func.isRequired,
    onClearSayingToAction: PropTypes.func.isRequired,
    onSelectCategory: PropTypes.func.isRequired,
    onTrain: PropTypes.func.isRequired,
    onToggleConversationBar: PropTypes.func.isRequired,
    onSendMessage: PropTypes.func.isRequired,
    onChangeReviewPageSize: PropTypes.func.isRequired,
    onRefreshDocuments: PropTypes.func.isRequired,
  }),
  agent: PropTypes.object.isRequired,
  documents: PropTypes.array,
  totalDocuments: PropTypes.number,
  agentCategories: PropTypes.array,
  agentFilteredCategories: PropTypes.array,
  agentKeywords: PropTypes.array,
  agentActions: PropTypes.array,
  category: PropTypes.string,
  newSayingActions: PropTypes.array,
  onGoToUrl: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  agent: makeSelectAgent(),
  totalDocuments: makeSelectTotalDocuments(),
  agentCategories: makeSelectCategories(),
  agentFilteredCategories: makeSelectFilteredCategories(),
  agentKeywords: makeSelectKeywords(),
  agentActions: makeSelectActions(),
  category: makeSelectSelectedCategory(),
  newSayingActions: makeSelectNewSayingActions(),
  documents: makeSelectDocuments(),
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      onLoadAgentDocuments: Actions.loadAgentDocuments,
      onLoadFilteredCategories: Actions.loadFilteredCategories,
      onLoadCategories: Actions.loadCategories,
      onLoadKeywords: Actions.loadKeywords,
      onLoadActions: Actions.loadActions,
      onCopySaying: Actions.copySaying,
      onDeleteSaying: Actions.deleteSaying,
      onTagKeyword: Actions.tagKeyword,
      onUntagKeyword: Actions.untagKeyword,
      onAddAction: Actions.addActionSaying,
      onDeleteAction: Actions.deleteActionSaying,
      onAddNewSayingAction: Actions.addActionNewSaying,
      onDeleteNewSayingAction: Actions.deleteActionNewSaying,
      onSendSayingToAction: Actions.sendSayingToAction,
      onClearSayingToAction: Actions.clearSayingToAction,
      onSelectCategory: Actions.selectCategory,
      onTrain: Actions.trainAgent,
      onToggleConversationBar: Actions.toggleConversationBar,
      onSendMessage: Actions.sendMessage,
      onChangeReviewPageSize: Actions.changeReviewPageSize,
      onRefreshDocuments: Actions.loadAgentDocumentsSuccess,
    }, dispatch),
    onGoToUrl: (url) => {
      dispatch(push(url));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const withSaga = injectSaga({ key: 'review', saga });

export default compose(
  withSaga,
  withConnect,
)(ReviewPage);
