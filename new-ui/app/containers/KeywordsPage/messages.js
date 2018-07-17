/*
 * KeywordsPage Messages
 *
 * This contains all the text for the KeywordsPage component.
 */

import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'app.containers.KeywordsPage.title',
    defaultMessage: 'Agent',
  },
  formTitle: {
    id: 'app.containers.KeywordsPage.formTitle',
    defaultMessage: 'Keywords',
  },
  help: {
    id: 'app.containers.KeywordsPage.help',
    defaultMessage: 'Help?',
  },
  playHelpAlt : {
    id: 'app.containers.KeywordsPage.playHelpAlt',
    defaultMessage: 'Play video off how to add/edit the keywords',
  },
  searchKeywordsAlt: {
    id: 'app.containers.KeywordsPage.component.Form.searchKeywordsAlt',
    defaultMessage: 'Search keyword',
  },
  searchKeywordPlaceholder: {
    id: 'app.containers.KeywordsPage.component.Form.searchKeywordPlaceholder',
    defaultMessage: 'Search keywords',
  },
  keywordsLabel: {
    id: 'app.containers.KeywordsPage.component.KeywordsDataForm.keywordsLabel',
    defaultMessage: 'Keyword List:',
  },
  backPage: {
    id: 'app.containers.KeywordsPage.component.KeywordsDataForm.backPage',
    defaultMessage: 'Back',
  },
  nextPage: {
    id: 'app.containers.KeywordsPage.component.KeywordsDataForm.nextPage',
    defaultMessage: 'Next',
  },
  create: {
    id: 'app.containers.KeywordsPage.component.KeywordsDataForm.create',
    defaultMessage: 'Create',
  },
  trainButton: {
    id: 'app.containers.KeywordsPage.trainButton',
    defaultMessage: 'Train',
  },
  show: {
    id: 'app.containers.KeywordsPage.component.SayingDataForm.show',
    defaultMessage: 'Show',
  },
  entries: {
    id: 'app.containers.KeywordsPage.component.SayingDataForm.entries',
    defaultMessage: 'entries',
  },
  statusOutOfDate: {
    id: 'app.containers.KeywordsPage.component.ActionButtons.statusOutOfDate',
    defaultMessage: 'Status: out of date',
  },
  statusError: {
    id: 'app.containers.KeywordsPage.component.ActionButtons.statusError',
    defaultMessage: 'Status: error on training',
  },
  statusTraining: {
    id: 'app.containers.KeywordsPage.component.ActionButtons.statusTraining',
    defaultMessage: 'Status: updating agent…',
  },
  statusReady: {
    id: 'app.containers.KeywordsPage.component.ActionButtons.statusReady',
    defaultMessage: 'Last Trained: ',
  },
});