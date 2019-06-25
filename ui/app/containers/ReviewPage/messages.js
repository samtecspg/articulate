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
  }
});
