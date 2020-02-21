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
  ROUTE_CONTEXT,
} from '../../../common/constants';
import injectSaga from '../../utils/injectSaga';
import { getWS } from '../../utils/locationResolver';
import * as Actions from '../App/actions';
import {
  makeSelectActions,
  makeSelectAgent,
  makeSelectCategories,
  makeSelectDocuments,
  makeSelectLogsText,
  makeSelectSessions,
  makeSelectFilteredCategories,
  makeSelectKeywords,
  makeSelectNewSayingActions,
  makeSelectSelectedCategory,
  makeSelectTotalDocuments,
  makeSelectTotalSessions,
  makeSelectLocale,
  makeSelectServerStatus,
  makeSelectLoadingCurrentUser,
  makeSelectLoading,
  makeSelectAgentVersions,
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
    this.deleteDocument = this.deleteDocument.bind(this);
    this.deleteSession = this.deleteSession.bind(this);
    this.handleOnRequestSort = this.handleOnRequestSort.bind(this);
    this.initForm = this.initForm.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleDeleteDocModalChange = this.handleDeleteDocModalChange.bind(this);
    this.onSearchLog = this.onSearchLog.bind(this);
  }

  state = {
    selectedTab: qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    }).tab
      ? qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).tab
      : 'documents',
    filter: '',
    documents: [],
    sessions: [],
    pageStatus: {
      documents: {
        client: null,
        socketClientConnected: false,
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
        client: null,
        socketClientConnected: false,
        total: null,
        currentPage: 1,
        pageSize: this.props.agent.id && this.props.agent.settings.sessionsPageSize
          ? this.props.agent.settings.sessionsPageSize
          : 5,
        numberOfPages: null,
        sortField: 'modificationDate',
        sortDirection: 'desc',
        timeSort: 'desc',
      },
      logs: {
        client: null,
        socketClientConnected: false,
        total: null,
        currentPage: 1,
        pageSize: 1000,
        numberOfPages: null,
        sortField: '@timestamp',
        sortDirection: 'desc'
      }
    },
    deleteDocModalOpen: false,
    deleteDocId: '',
    deleteDocSessionId: '',
    deleteSessionModalOpen: false,
    deleteSessionId: '',
  };

  async initForm() {
    const {
      onLoadKeywords,
      onLoadActions,
      onLoadCategories,
      onLoadAgentDocuments,
      onLoadAgentSessions,
      onLoadLogs,
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
    onLoadAgentDocuments({
      page: this.state.pageStatus.documents.currentPage,
      pageSize: this.state.pageStatus.documents.pageSize,
      field: this.state.pageStatus.documents.sortField,
      direction: this.state.pageStatus.documents.sortDirection,
      filter: this.state.filter
    });

    onLoadAgentSessions(
      this.state.pageStatus.sessions.currentPage,
      this.state.pageStatus.sessions.pageSize,
      this.state.pageStatus.sessions.sortField,
      this.state.pageStatus.sessions.sortDirection,
    );

    onLoadLogs({
      page: this.state.pageStatus.logs.currentPage,
      pageSize: this.state.pageStatus.logs.pageSize,
      field: this.state.pageStatus.logs.sortField,
      direction: this.state.pageStatus.logs.sortDirection,
      filter: this.state.filter
    });

    const newPageStatus = this.state.pageStatus;

    if (!this.state.pageStatus.documents.socketClientConnected) {
      const client = new Nes.Client(getWS());
      client.onConnect = () => {

        newPageStatus.documents.client = client;
        newPageStatus.documents.socketClientConnected = true;

        this.setState({
          pageStatus: newPageStatus,
        });

        const handler = documents => {
          if (documents) {
            const paginatedDocuments = _.orderBy(_.take(documents.data, this.state.pageStatus.documents.pageSize), this.state.pageStatus.documents.sortField, this.state.pageStatus.documents.sortDirection.toLowerCase());

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

    if (!this.state.pageStatus.sessions.socketClientConnected) {
      const client = new Nes.Client(getWS());
      client.onConnect = () => {

        newPageStatus.sessions.client = client;
        newPageStatus.sessions.socketClientConnected = true;

        this.setState({
          pageStatus: newPageStatus,
        });

        const handler = (sessions) => {
          if (sessions) {
            onLoadAgentSessions(
              this.state.pageStatus.sessions.currentPage,
              this.state.pageStatus.sessions.pageSize,
              this.state.pageStatus.sessions.sortField,
              this.state.pageStatus.sessions.sortDirection,
            );
          }
        };

        client.subscribe(
          `/${ROUTE_CONTEXT}`,
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
    this.props.actions.onShowChatButton(true);
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
    if (this.state.pageStatus.documents.client) {
      this.state.pageStatus.documents.client.unsubscribe(`/${ROUTE_AGENT}/${this.props.agent.id}/${ROUTE_DOCUMENT}`);
    }
    if (this.state.pageStatus.sessions.client) {
      this.state.pageStatus.sessions.client.unsubscribe(`/${ROUTE_CONTEXT}`);
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
    if (this.state.selectedTab === 'documents') {
      onLoadAgentDocuments({
        page: pageNumber,
        pageSize: this.state.pageStatus.documents.pageSize,
        field: this.state.pageStatus.documents.sortField,
        direction: this.state.pageStatus.documents.sortDirection,
        filter: this.state.filter
      });
    }
    if (this.state.selectedTab === 'sessions') {
      onLoadAgentSessions(
        pageNumber,
        this.state.pageStatus.sessions.pageSize,
        this.state.pageStatus.sessions.sortField,
        this.state.pageStatus.sessions.sortDirection,
      );
    }
    if (this.state.selectedTab === 'logs') {
      onLoadLogs(
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
    if (this.state.selectedTab === 'documents') {
      onChangeReviewPageSize(this.props.agent.id, pageSize);
      onLoadAgentDocuments({
        page: 1,
        pageSize,
        field: this.state.pageStatus[this.state.selectedTab].sortField,
        direction: this.state.pageStatus[this.state.selectedTab].sortDirection,
        filter: this.state.filter
      });
    }
    if (this.state.selectedTab === 'sessions') {
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
    const newPageStatus = this.state.pageStatus;
    newPageStatus['documents'].currentPage = 1;
    this.setState({
      pageStatus: newPageStatus,
      filter
    });

    onLoadAgentDocuments({
      page: 1,
      pageSize: this.state.pageStatus['documents'].pageSize,
      field: this.state.pageStatus['documents'].sortField,
      direction: this.state.pageStatus['documents'].sortDirection,
      filter: filter
    });
  }

  onSearchLog(filter, logsNumber) {
    const { onLoadLogs } = this.props.actions;
    const newPageStatus = this.state.pageStatus;
    newPageStatus['documents'].currentPage = 1;
    this.setState({
      filter
    });

    onLoadLogs({
      page: this.state.pageStatus.logs.currentPage,
      pageSize: logsNumber,
      field: this.state.pageStatus.logs.sortField,
      direction: this.state.pageStatus.logs.sortDirection,
      filter: filter
    });
  }

  copySayingFromDocument(userSays, saying) {
    const { agentCategories, agentKeywords, onGoToUrl, agent } = this.props;
    /*if (saying.categoryScore === 0) {
      onGoToUrl(`/agent/${agent.id}/dialogue?tab=sayings&userSays=${userSays}`);
    } else {
    }*/

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

    if (this.state.selectedTab === 'documents') {
      onLoadAgentDocuments({
        page: this.state.pageStatus[this.state.selectedTab].currentPage,
        pageSize: this.state.pageStatus[this.state.selectedTab].pageSize,
        field: sortField,
        direction: sortDirection,
        filter: this.state.filter
      });
    }
    if (this.state.selectedTab === 'sessions') {
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

  handleDeleteDocModalChange = (deleteDocModalOpen,
    deleteDocId = this.state.deleteDocId,
    deleteDocSessionId = this.state.deleteDocSessionId) => {
    this.setState({
      deleteDocModalOpen,
      deleteDocId,
      deleteDocSessionId
    })
  }

  deleteDocument() {
    this.props.actions.onDeleteDocument({
      documentId: this.state.deleteDocId,
      sessionId: this.state.deleteDocSessionId,
      page: this.state.pageStatus.documents.currentPage,
      pageSize: this.state.pageStatus.documents.pageSize,
      field: this.state.pageStatus.documents.sortField,
      direction: this.state.pageStatus.documents.sortDirection,
    })
  }

  handleDeleteSessionModalChange = (deleteSessionModalOpen,
    deleteSessionId = this.state.deleteSessionId) => {
    this.setState({
      deleteSessionModalOpen,
      deleteSessionId
    })
  }

  deleteSession() {
    this.props.actions.onDeleteSession({
      sessionId: this.state.deleteSessionId,
      page: this.state.pageStatus.documents.currentPage,
      pageSize: this.state.pageStatus.documents.pageSize,
      field: this.state.pageStatus.documents.sortField,
      direction: this.state.pageStatus.documents.sortDirection,
    })
  }

  render() {
    const {
      onSendSayingToAction,
      onClearSayingToAction,
      onSelectCategory,
      onTrain,
      onToggleConversationBar,
      onSendMessage,
      onLoadSessionId
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
              deleteDocumentModalOpen={this.state.deleteDocModalOpen}
              deleteSessionModalOpen={this.state.deleteSessionModalOpen}
              onCopySaying={this.copySayingFromDocument}
              onDeleteDocumentModalChange={this.handleDeleteDocModalChange}
              onDeleteSessionModalChange={this.handleDeleteSessionModalChange}
              onDeleteDocument={this.deleteDocument}
              onDeleteSession={this.deleteSession}
              onSearchSaying={this.onSearchSaying}
              onSearchLog={this.onSearchLog}
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
              //logs={this.props.logs}
              logsText={this.props.logsText}
              loading={this.props.loading}
            />
          }
          dialogueForm={Link}
          dialogueURL={`/agent/${agent.id}/dialogue`}
          analyticsForm={Link}
          analyticsURL={`/agent/${this.props.agent.id}/analytics`}
          currentAgent={this.props.agent}
          onAddAgentVersion={this.props.onAddAgentVersion}
          onGoToUrl={this.props.onGoToUrlLoadAgentVersion}
          onUpdateAgentVersion={this.props.onUpdateAgentVersion}
          onDeleteAgentVersion={this.props.onDeleteAgentVersion}
          agentVersions={this.props.agentVersions ? this.props.agentVersions : []}
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
    onLoadLogs: PropTypes.func.isRequired,
    onLoadFilteredCategories: PropTypes.func.isRequired,
    onLoadCategories: PropTypes.func.isRequired,
    onLoadKeywords: PropTypes.func.isRequired,
    onLoadActions: PropTypes.func.isRequired,
    onCopySaying: PropTypes.func.isRequired,
    onDeleteDocument: PropTypes.func.isRequired,
    onDeleteSession: PropTypes.func.isRequired,
    onSendSayingToAction: PropTypes.func.isRequired,
    onClearSayingToAction: PropTypes.func.isRequired,
    onSelectCategory: PropTypes.func.isRequired,
    onTrain: PropTypes.func.isRequired,
    onToggleConversationBar: PropTypes.func.isRequired,
    onShowChatButton: PropTypes.func.isRequired,
    onSendMessage: PropTypes.func.isRequired,
    onChangeReviewPageSize: PropTypes.func.isRequired,
    onChangeSessionsPageSize: PropTypes.func.isRequired,
    onRefreshDocuments: PropTypes.func.isRequired,
    onLoadSessionId: PropTypes.func.isRequired,
  }),
  agent: PropTypes.object.isRequired,
  serverStatus: PropTypes.string,
  documents: PropTypes.array,
  //logs: PropTypes.array,
  logsText: PropTypes.string,
  totalDocuments: PropTypes.number,
  agentCategories: PropTypes.array,
  agentFilteredCategories: PropTypes.array,
  agentKeywords: PropTypes.array,
  agentActions: PropTypes.array,
  category: PropTypes.string,
  newSayingActions: PropTypes.array,
  onGoToUrl: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  locale: PropTypes.string
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
  //logs: makeSelectLogs(),
  logsText: makeSelectLogsText(),
  sessions: makeSelectSessions(),
  locale: makeSelectLocale(),
  loading: makeSelectLoading(),
  agentVersions: makeSelectAgentVersions(),
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        onLoadAgentDocuments: Actions.loadAgentDocuments,
        onDeleteDocument: Actions.deleteDocument,
        onDeleteSession: Actions.deleteSessionData,
        onLoadAgentSessions: Actions.loadAgentSessions,
        onLoadFilteredCategories: Actions.loadFilteredCategories,
        onLoadCategories: Actions.loadCategories,
        onLoadKeywords: Actions.loadKeywords,
        onLoadActions: Actions.loadActions,
        onLoadLogs: Actions.loadLogs,
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
        onLoadSessionId: Actions.loadSession,
        onShowChatButton: Actions.toggleChatButton
      },
      dispatch,
    ),
    onGoToUrl: url => {
      dispatch(push(url));
    },
    onGoToUrlLoadAgentVersion: (url, versionId, currentAgentId) => {
      dispatch(loadAgentVersion(url, versionId, currentAgentId));
    },
    onUpdateAgentVersion: (version) => {
      dispatch(updateAgentVersion(version));
    },
    onDeleteAgentVersion: (versionId, currentAgentId) => {
      dispatch(deleteAgentVersion(versionId, currentAgentId));
    },
    onAddAgentVersion: id => {
      dispatch(addAgentVersion(id));
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
