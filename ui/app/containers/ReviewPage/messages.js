/*
 * ReviewPage Messages
 *
 * This contains all the text for the ReviewPage component.
 */

import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'app.containers.ReviewPage.title',
    defaultMessage: 'Agent',
  },
  formTitle: {
    id: 'app.containers.ReviewPage.formTitle',
    defaultMessage: 'Review',
  },
  help: {
    id: 'app.containers.ReviewPage.help',
    defaultMessage: 'Help?',
  },
  playHelpAlt: {
    id: 'app.containers.ReviewPage.playHelpAlt',
    defaultMessage: 'Play video of how to understand the review page',
  },
  sayingTextField: {
    id: 'app.containers.ReviewPage.component.ReviewDataForm.sayingTextField',
    defaultMessage: 'User Says',
  },
  sayingTextFieldPlaceholder: {
    id: 'app.containers.ReviewPage.component.Form.sayingTextFieldPlaceholder',
    defaultMessage: 'Write what a user would say to your agent',
  },
  searchReviewAlt: {
    id: 'app.containers.ReviewPage.component.Form.searchReviewAlt',
    defaultMessage: 'Search user saying',
  },
  searchReviewPlaceholder: {
    id: 'app.containers.ReviewPage.component.Form.searchReviewPlaceholder',
    defaultMessage: 'Search Review',
  },
  highlightTooltip: {
    id: 'app.containers.ReviewPage.component.ReviewDataForm.highlightTooltip',
    defaultMessage: 'Use this table to review interactions with your agent',
  },
  backPage: {
    id: 'app.containers.ReviewPage.component.ReviewDataForm.backPage',
    defaultMessage: 'Back',
  },
  nextPage: {
    id: 'app.containers.ReviewPage.component.ReviewDataForm.nextPage',
    defaultMessage: 'Next',
  },
  newAction: {
    id: 'app.containers.ReviewPage.component.SayingRow.newAction',
    defaultMessage: '+ New Action',
  },
  noActionsFound: {
    id: 'app.containers.ReviewPage.component.ReviewDataForm.noActionsFound',
    defaultMessage: 'No actions found',
  },
  newKeyword: {
    id: 'app.containers.ReviewPage.component.SayingRow.newKeyword',
    defaultMessage: '+ New Keyword',
  },
  categorySelect: {
    id: 'app.containers.ReviewPage.component.ReviewDataForm.categorySelect',
    defaultMessage: 'Categories',
  },
  requiredField: {
    id: 'app.containers.ReviewPage.component.ReviewDataForm.requiredField',
    defaultMessage: '*Required',
  },
  show: {
    id: 'app.containers.ReviewPage.component.ReviewDataForm.show',
    defaultMessage: 'Show',
  },
  entries: {
    id: 'app.containers.ReviewPage.component.ReviewDataForm.entries',
    defaultMessage: 'entries',
  },
  noData: {
    id: 'app.containers.ReviewPage.component.SayingsDataForm.noData',
    defaultMessage: 'No data',
  },
  oldest: {
    id: 'app.containers.ReviewPage.component.SayingsDataForm.oldest',
    defaultMessage: 'Oldest',
  },
  newest: {
    id: 'app.containers.ReviewPage.component.SayingsDataForm.newest',
    defaultMessage: 'Newest',
  },
  selectNewCategory: {
    id: 'app.containers.ReviewPage.component.SayingsDataForm.selectNewCategory',
    defaultMessage: 'Select new category',
  },
  required: {
    id: 'app.containers.ReviewPage.component.SayingsDataForm.required',
    defaultMessage: '*Required',
  },
  copyAlert: {
    id: 'app.containers.ReviewPage.component.SayingRow.copyAlert',
    defaultMessage:
      'This agent is configured to use a single classification model for all categories. To copy this text as a new saying please specify the category it belongs to:',
  },
  copyDialogCancelButton: {
    id: 'app.containers.ReviewPage.component.SayingRow.copyDialogCancelButton',
    defaultMessage: 'Cancel',
  },
  copyDialogCopyButton: {
    id: 'app.containers.ReviewPage.component.SayingRow.copyDialogCopyButton',
    defaultMessage: 'Copy',
  },
  deleteDocumentAlert1: {
    id: 'app.containers.ReviewPage.component.Form.deleteDocumentAlert1',
    defaultMessage: 'Are you sure you want to permanently delete this saying?'
  },
  deleteDocumentAlert2: {
    id: 'app.containers.ReviewPage.component.Form.deleteDocumentAlert2',
    defaultMessage: 'Deleting this saying will impact analytics and cannot be reversed'
  },
  deleteDocumentAlertYes: {
    id: 'app.containers.ReviewPage.component.Form.deleteDocumentAlertYes',
    defaultMessage: 'Yes'
  },
  deleteDocumentAlertNo: {
    id: 'app.containers.ReviewPage.component.Form.deleteDocumentAlertNo',
    defaultMessage: 'No'
  },
  seeSource: {
    id: 'app.containers.ReviewPage.component.SayingRow.seeSource',
    defaultMessage: 'See Source',
  },
  sayingsFormTitle: {
    id: 'app.containers.ReviewPage.component.Form.sayingsFormTitle',
    defaultMessage: 'Sayings',
  },
  sessionsFormTitle: {
    id: 'app.containers.ReviewPage.component.Form.sessionsFormTitle',
    defaultMessage: 'Sessions',
  },
  reproduceSession: {
    id: 'app.containers.ReviewPage.component.SessionRow.reproduceSession',
    defaultMessage: 'Reproduce session on chat window',
  },
  deleteSession: {
    id: 'app.containers.ReviewPage.component.SessionRow.deleteSession',
    defaultMessage: 'Delete session data',
  },
  deleteSessionAlert1: {
    id: 'app.containers.ReviewPage.component.Form.deleteSessionAlert1',
    defaultMessage: 'Are you sure you want to permanently delete this session data?'
  },
  deleteSessionAlert2: {
    id: 'app.containers.ReviewPage.component.Form.deleteSessionAlert2',
    defaultMessage: 'Deleting this session data will impact analytics and cannot be reversed'
  },
  deleteSessionAlertYes: {
    id: 'app.containers.ReviewPage.component.Form.deleteSessionAlertYes',
    defaultMessage: 'Yes'
  },
  deleteSessionAlertNo: {
    id: 'app.containers.ReviewPage.component.Form.deleteSessionAlertNo',
    defaultMessage: 'No'
  },
  searchSayingPlaceholder: {
    id: 'app.containers.ReviewPage.component.Form.searchSayingPlaceholder',
    defaultMessage: 'Search sayings',
  },
  pickActions: {
    id: 'app.containers.ReviewPage.component.PopoverFilter.pickActions',
    defaultMessage: 'Actions: ',
  },
  actionIntervals: {
    id: 'app.containers.ReviewPage.component.PopoverFilter.actionIntervals',
    defaultMessage: 'Action Intervals: ',
  },
  actionIntervalsWarning: {
    id: 'app.containers.ReviewPage.component.PopoverFilter.actionIntervalsWarning',
    defaultMessage: '*Input must be between 0 - 100',
  },
  filtersDescriptionSayingsTab: {
    id: 'app.containers.ReviewPage.component.PopoverFilter.filtersDescriptionSayingsTab',
    defaultMessage: 'Filter sayings, actions, and action confidence intervals.',
  },
  customFirstActionLabel: {
    id: 'app.containers.ReviewPage.component.PopoverFilter.customFirstActionLabel',
    defaultMessage: 'ACTION NOT RECOGNIZED',
  },
  filtersDescriptionLogsTab: {
    id: 'app.containers.ReviewPage.component.PopoverFilter.filtersDescriptionLogsTab',
    defaultMessage: 'Filter containers and number of logs to view.',
  },
  noLogsView: {
    id: 'app.containers.ReviewPage.component.PopoverFilter.noLogsView',
    defaultMessage: '# of logs to view:',
  },
  log: {
    id: 'app.containers.ReviewPage.Logs.log',
    defaultMessage: 'Log:',
  },
  refreshLog: {
    id: 'app.containers.ReviewPage.Logs.refreshLog',
    defaultMessage: 'Refresh Log',
  },
  trainTestFullSummaryAlert1: {
    id: 'app.containers.ReviewPage.component.Form.trainTestFullSummaryAlert1',
    defaultMessage: 'Warning! This agent has changed'
  },
  trainTestFullSummaryAlert2: {
    id: 'app.containers.ReviewPage.component.Form.trainTestFullSummaryAlert2',
    defaultMessage: 'There have been changes in this agent from the moment this testing was done. Do you want to continue?'
  },
  trainTestFullSummaryYes: {
    id: 'app.containers.ReviewPage.component.Form.trainTestFullSummaryYes',
    defaultMessage: 'Yes'
  },
  trainTestFullSummaryNo: {
    id: 'app.containers.ReviewPage.component.Form.trainTestFullSummaryNo',
    defaultMessage: 'No'
  },
});
