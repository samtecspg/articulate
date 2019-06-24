/**
 *
 * ReviewPage
 *
 */

import { CircularProgress, Grid } from '@material-ui/core';
import _ from 'lodash';
import Nes from 'nes';
import PropTypes from 'prop-types';
import qs from 'query-string';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
import { bindActionCreators, compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { AUTH_ENABLED } from "../../../common/env";
import MainTab from '../../components/MainTab';
import {
  ACTION_INTENT_SPLIT_SYMBOL,
  ROUTE_DOCUMENT,
  ROUTE_AGENT,
} from '../../../common/constants';
import injectSaga from '../../utils/injectSaga';
import { getWS } from '../../utils/locationResolver';
import * as Actions from '../App/actions';
import {
  makeSelectActions,
  makeSelectAgent,
  makeSelectCategories,
  makeSelectDocuments,
  makeSelectSessions,
  makeSelectFilteredCategories,
  makeSelectKeywords,
  makeSelectNewSayingActions,
  makeSelectSelectedCategory,
  makeSelectTotalDocuments,
  makeSelectTotalSessions,
  makeSelectLocale,
  makeSelectServerStatus,
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
    this.handleTabChange = this.handleTabChange.bind(this);
  }

  state = {
    selectedTab: qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    }).tab
      ? qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).tab
      : 'documents',
    filter: qs.parse(this.props.location.search, { ignoreQueryPrefix: true })
      .filter
      ? qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).filter
      : '',
    documents: [],
    sessions: [],
    client: null,
    socketClientConnected: false,
    pageStatus: {
      documents: {
        total: null,
        currentPage: 1,
        pageSize: this.props.agent.id && this.props.agent.settings.reviewPageSize
        ? this.props.agent.settings.reviewPageSize
        : 5,
        numberOfPages: null,
        sortField: 'time_stamp',
        sortDirection: 'DESC',
        timeSort: 'DESC',
      },
      sessions: {
        total: null,
        currentPage: 1,
        pageSize: this.props.agent.id && this.props.agent.settings.sessionsPageSize
        ? this.props.agent.settings.sessionsPageSize
        : 5,
        numberOfPages: null,
        sortField: 'modificationDate',
        sortDirection: 'desc',
        timeSort: 'desc',
      }
    }
  };

  async initForm() {
    const {
      onLoadKeywords,
      onLoadActions,
      onLoadCategories,
      onLoadAgentDocuments,
      onLoadAgentSessions,
      onRefreshDocuments,
    } = this.props.actions;

    this.setState({
      pageSize: this.props.agent.settings.reviewPageSize,
    });
    this.setNumberOfPages(this.props.agent.settings.reviewPageSize, 'documents');
    this.setNumberOfPages(this.props.agent.settings.sessionsPageSize, 'sessions');
    onLoadKeywords();
    onLoadActions();
    onLoadCategories();
    onLoadAgentDocuments(
      this.state.pageStatus.documents.currentPage,
      this.state.pageStatus.documents.pageSize,
      this.state.pageStatus.documents.sortField,
      this.state.pageStatus.documents.sortDirection,
    );

    onLoadAgentSessions(
      this.state.pageStatus.sessions.currentPage,
      this.state.pageStatus.sessions.pageSize,
      this.state.pageStatus.sessions.sortField,
      this.state.pageStatus.sessions.sortDirection,
    );

    if (!this.state.socketClientConnected) {
      const client = new Nes.Client(getWS());
      client.onConnect = () => {
        this.setState({
          client,
          socketClientConnected: true,
        });

        const handler = documents => {
          if (documents) {
            const paginatedDocuments = _.orderBy(_.take(documents.data, this.state.pageStatus.documents.pageSize), this.state.pageStatus.documents.sortField, this.state.pageStatus.documents.sortDirection);

            const payload = {
              documents: paginatedDocuments,
              total: documents.totalCount,
            };
            onRefreshDocuments(payload);
          }
        };

        client.subscribe(
          `/${ROUTE_AGENT}/${this.props.agent.id}/${ROUTE_DOCUMENT}`,
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
    const { documents, sessions } = this.props;
    if (documents !== this.state.documents) {
      this.setState({ documents });
      this.setNumberOfPages(this.state.pageStatus.documents.pageSize, 'documents');
    }
    if (sessions !== this.state.sessions) {
      this.setState({ sessions });
      this.setNumberOfPages(this.state.pageStatus.sessions.pageSize, 'sessions');
    }
  }

  componentWillUnmount() {
    if (this.state.client) {
      if (this.props.agent.id) {
        this.state.client.unsubscribe(`/agent/${this.state.agent}/doc`);
      }
    }
  }

  setNumberOfPages(pageSize, type) {
    const numberOfPages = Math.ceil((type === 'documents' ? this.props.totalDocuments : this.props.totalSessions) / pageSize);
    const newPageStatus = this.state.pageStatus;
    newPageStatus[type].numberOfPages = numberOfPages;
    this.setState({
      pageStatus: newPageStatus,
    });
  }

  changePage(pageNumber) {
    const { onLoadAgentDocuments, onLoadAgentSessions } = this.props.actions;
    const newPageStatus = this.state.pageStatus;
    newPageStatus[this.state.selectedTab].currentPage = pageNumber;
    this.setState({
      pageStatus: newPageStatus,
    });
    if (this.state.selectedTab === 'documents'){
      onLoadAgentDocuments(
        pageNumber,
        this.state.pageStatus.documents.pageSize,
        this.state.pageStatus.documents.sortField,
        this.state.pageStatus.documents.sortDirection,
      );
    }
    if (this.state.selectedTab === 'sessions'){
      onLoadAgentSessions(
        pageNumber,
        this.state.pageStatus.sessions.pageSize,
        this.state.pageStatus.sessions.sortField,
        this.state.pageStatus.sessions.sortDirection,
      );
    }
  }

  movePageBack() {
    let newPage = this.state.pageStatus[this.state.selectedTab].currentPage;
    if (this.state.pageStatus[this.state.selectedTab].currentPage > 1) {
      newPage = this.state.pageStatus[this.state.selectedTab].currentPage - 1;
    }
    this.changePage(newPage);
  }

  movePageForward() {
    let newPage = this.state.pageStatus[this.state.selectedTab].currentPage;
    if (this.state.pageStatus[this.state.selectedTab].currentPage < this.state.pageStatus[this.state.selectedTab].numberOfPages) {
      newPage = this.state.pageStatus[this.state.selectedTab].currentPage + 1;
    }
    this.changePage(newPage);
  }

  changePageSize(pageSize) {
    const { onLoadAgentDocuments, onLoadAgentSessions, onChangeReviewPageSize, onChangeSessionsPageSize } = this.props.actions;
    const newPageStatus = this.state.pageStatus;
    newPageStatus[this.state.selectedTab].pageSize = pageSize;
    newPageStatus[this.state.selectedTab].currentPage = 1;
    this.setState({
      pageStatus: newPageStatus,
    });
    if (this.state.selectedTab === 'documents'){
      onChangeReviewPageSize(this.props.agent.id, pageSize);
      onLoadAgentDocuments(
        1,
        pageSize,
        this.state.pageStatus[this.state.selectedTab].sortField,
        this.state.pageStatus[this.state.selectedTab].sortDirection,
      );
    }
    if (this.state.selectedTab === 'sessions'){
      onChangeSessionsPageSize(this.props.agent.id, pageSize);
      onLoadAgentSessions(
        1,
        pageSize,
        this.state.pageStatus[this.state.selectedTab].sortField,
        this.state.pageStatus[this.state.selectedTab].sortDirection,
      );
    }
  }

  onSearchSaying(filter) {
    const { onLoadAgentDocuments } = this.props.actions;
    this.setState({
      filter,
      currentPage: 1,
    });
    onLoadAgentDocuments(
      1,
      this.state.pageSize,
      this.state.sortField,
      this.state.sortDirection,
    );
  }

  copySayingFromDocument(userSays, saying) {
    const { agentCategories, agentKeywords, onGoToUrl, agent } = this.props;
    if (saying.categoryScore === 0) {
      onGoToUrl(`/agent/${agent.id}/dialogue?tab=sayings&userSays=${userSays}`);
    } else {
      const { onCopySaying } = this.props.actions;
      const category = _.find(agentCategories, {
        categoryName: saying.category,
      });
      const sayingToCopy = {
        userSays,
        keywords: saying.keywords.map(keyword => {
          const agentKeyword = _.find(agentKeywords, {
            keywordName: keyword.keyword,
          });
          return {
            value: keyword.value.value,
            keyword: keyword.keyword,
            start: keyword.start,
            end: keyword.end,
            keywordId: agentKeyword.id,
          };
        }),
        actions:
          saying.action.name === ''
            ? []
            : saying.action.name.split(ACTION_INTENT_SPLIT_SYMBOL),
        categoryId: category ? category.id : null,
      };
      onCopySaying(sayingToCopy);
    }
  }

  handleOnRequestSort(id) {
    const { onLoadAgentDocuments, onLoadAgentSessions } = this.props.actions;

    const sortField = id;
    let sortDirection = 'DESC';

    if (this.state.sortField === id && this.state.sortDirection === 'DESC') {
      sortDirection = 'ASC';
    }
    const timeSort = id === 'time_stamp' || id === 'modificationDate' ? sortDirection : this.state.timeSort;

    const newPageStatus = this.state.pageStatus;
    newPageStatus[this.state.selectedTab].sortField = id;
    newPageStatus[this.state.selectedTab].sortDirection = sortDirection;
    newPageStatus[this.state.selectedTab].timeSort = timeSort;
    this.setState({
      pageStatus: newPageStatus,
    });

    if (this.state.selectedTab === 'documents'){
      onLoadAgentDocuments(
        this.state.pageStatus[this.state.selectedTab].currentPage,
        this.state.pageStatus[this.state.selectedTab].pageSize,
        sortField,
        sortDirection,
      );
    }
    if (this.state.selectedTab === 'sessions'){
      onLoadAgentSessions(
        this.state.pageStatus[this.state.selectedTab].currentPage,
        this.state.pageStatus[this.state.selectedTab].pageSize,
        sortField,
        sortDirection,
      );
    }
  }


  handleTabChange = (event, value) => {
    this.setState({
      selectedTab: value,
    });
  };

  render() {
    const {
      onSendSayingToAction,
      onClearSayingToAction,
      onSelectCategory,
      onTrain,
      onToggleConversationBar,
      onSendMessage,
      onLoadSessionId,
    } = this.props.actions;

    const {
      agent,
      documents,
      sessions,
      agentCategories,
      agentFilteredCategories,
      agentKeywords,
      agentActions,
      category,
      newSayingActions,
    } = this.props;

    return this.props.agent.id ? (
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
          selectedTab="review"
          agentForm={Link}
          agentURL={`/agent/${agent.id}?ref=mainTab`}
          reviewForm={
            <Form
              selectedTab={this.state.selectedTab}
              handleTabChange={this.handleTabChange}
              agent={agent}
              agentId={agent.id}
              documents={documents}
              sessions={sessions}
              agentKeywords={agentKeywords}
              agentActions={agentActions}
              agentCategories={agentCategories}
              agentFilteredCategories={agentFilteredCategories}
              onCopySaying={this.copySayingFromDocument}
              onSearchSaying={this.onSearchSaying}
              onSearchCategory={this.onSearchCategory}
              onSendSayingToAction={onSendSayingToAction}
              currentPage={this.state.pageStatus[this.state.selectedTab].currentPage}
              pageSize={this.state.pageStatus[this.state.selectedTab].pageSize}
              numberOfPages={this.state.pageStatus[this.state.selectedTab].numberOfPages}
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
              sortField={this.state.pageStatus[this.state.selectedTab].sortField}
              sortDirection={this.state.pageStatus[this.state.selectedTab].sortDirection}
              locale={this.props.locale}
              timeSort={this.state.pageStatus[this.state.selectedTab].timeSort}
              onLoadSessionId={onLoadSessionId}
            />
          }
          dialogueForm={Link}
          dialogueURL={`/agent/${agent.id}/dialogue`}
          analyticsForm={Link}
          analyticsURL={`/agent/${this.props.agent.id}/analytics`}
        />
      </Grid>
    ) : (
      <CircularProgress
        style={{ position: 'absolute', top: '40%', left: '49%' }}
      />
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
    onSendSayingToAction: PropTypes.func.isRequired,
    onClearSayingToAction: PropTypes.func.isRequired,
    onSelectCategory: PropTypes.func.isRequired,
    onTrain: PropTypes.func.isRequired,
    onToggleConversationBar: PropTypes.func.isRequired,
    onSendMessage: PropTypes.func.isRequired,
    onChangeReviewPageSize: PropTypes.func.isRequired,
    onChangeSessionsPageSize: PropTypes.func.isRequired,
    onRefreshDocuments: PropTypes.func.isRequired,
    onLoadSessionId: PropTypes.func.isRequired,
  }),
  agent: PropTypes.object.isRequired,
  serverStatus: PropTypes.string,
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
  locale: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  agent: makeSelectAgent(),
  serverStatus: makeSelectServerStatus(),
  totalDocuments: makeSelectTotalDocuments(),
  totalSessions: makeSelectTotalSessions(),
  agentCategories: makeSelectCategories(),
  agentFilteredCategories: makeSelectFilteredCategories(),
  agentKeywords: makeSelectKeywords(),
  agentActions: makeSelectActions(),
  category: makeSelectSelectedCategory(),
  newSayingActions: makeSelectNewSayingActions(),
  documents: makeSelectDocuments(),
  sessions: makeSelectSessions(),
  locale: makeSelectLocale(),
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        onLoadAgentDocuments: Actions.loadAgentDocuments,
        onLoadAgentSessions: Actions.loadAgentSessions,
        onLoadFilteredCategories: Actions.loadFilteredCategories,
        onLoadCategories: Actions.loadCategories,
        onLoadKeywords: Actions.loadKeywords,
        onLoadActions: Actions.loadActions,
        onCopySaying: Actions.copySaying,
        onSendSayingToAction: Actions.sendSayingToAction,
        onClearSayingToAction: Actions.clearSayingToAction,
        onSelectCategory: Actions.selectCategory,
        onTrain: Actions.trainAgent,
        onToggleConversationBar: Actions.toggleConversationBar,
        onSendMessage: Actions.sendMessage,
        onChangeReviewPageSize: Actions.changeReviewPageSize,
        onChangeSessionsPageSize: Actions.changeSessionsPageSize,
        onRefreshDocuments: Actions.loadAgentDocumentsSuccess,
        onLoadSessionId: Actions.loadSession
      },
      dispatch,
    ),
    onGoToUrl: url => {
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
