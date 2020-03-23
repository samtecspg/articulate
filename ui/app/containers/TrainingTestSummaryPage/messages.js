/*
 * AgentPage Messages
 *
 * This contains all the text for the AgentPage component.
 */

import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'app.containers.TrainingTestSummaryPage.title',
    defaultMessage: 'Test summary',
  },
  sayingsFormTitle: {
    id: 'app.containers.DialoguePage.sayingsFormTitle',
    defaultMessage: 'Sayings',
  },
  help: {
    id: 'app.containers.DialoguePage.help',
    defaultMessage: 'Help?',
  },
  playHelpAlt: {
    id: 'app.containers.DialoguePage.playHelpAlt',
    defaultMessage: 'Play video off how to use dialog features',
  },
  sayingsPlayHelpAlt: {
    id: 'app.containers.DialoguePage.sayingsPlayHelpAlt',
    defaultMessage: 'Play video off how to add/edit the user sayings',
  },
  sayingTextField: {
    id: 'app.containers.DialoguePage.component.SayingDataForm.sayingTextField',
    defaultMessage: 'User Says',
  },
  sayingTextFieldPlaceholder: {
    id: 'app.containers.DialoguePage.component.Form.sayingTextFieldPlaceholder',
    defaultMessage: 'Write what a user would say to your agent',
  },
  searchSayingsAlt: {
    id: 'app.containers.DialoguePage.component.Form.searchSayingsAlt',
    defaultMessage: 'Search user saying',
  },
  searchSayingPlaceholder: {
    id: 'app.containers.DialoguePage.component.Form.searchSayingPlaceholder',
    defaultMessage: 'Search sayings',
  },
  highlightTooltip: {
    id: 'app.containers.DialoguePage.component.SayingDataForm.highlightTooltip',
    defaultMessage: 'Highlight a word to make it a keyword',
  },
  backPage: {
    id: 'app.containers.DialoguePage.component.SayingDataForm.backPage',
    defaultMessage: 'Back',
  },
  nextPage: {
    id: 'app.containers.DialoguePage.component.SayingDataForm.nextPage',
    defaultMessage: 'Next',
  },
  newAction: {
    id: 'app.containers.DialoguePage.component.SayingRow.newAction',
    defaultMessage: '+ New Action',
  },
  noActionsFound: {
    id: 'app.containers.DialoguePage.component.SayingDataForm.noActionsFound',
    defaultMessage: 'No actions found',
  },
  newKeyword: {
    id: 'app.containers.DialoguePage.component.SayingRow.newKeyword',
    defaultMessage: '+ New Keyword',
  },
  categorySelect: {
    id: 'app.containers.DialoguePage.component.SayingDataForm.categorySelect',
    defaultMessage: 'Categories',
  },
  requiredField: {
    id: 'app.containers.DialoguePage.component.SayingDataForm.requiredField',
    defaultMessage: '*Required',
  },
  show: {
    id: 'app.containers.DialoguePage.component.SayingDataForm.show',
    defaultMessage: 'Show',
  },
  entries: {
    id: 'app.containers.DialoguePage.component.SayingDataForm.entries',
    defaultMessage: 'entries',
  },
  categorySelectDefault: {
    id:
      'app.containers.DialoguePage.component.SayingDataForm.categorySelectDefault',
    defaultMessage: 'Select',
  },
  categoryNoResults: {
    id:
      'app.containers.DialoguePage.component.SayingDataForm.categoryNoResults',
    defaultMessage: 'No Results',
  },
  categoryAdd: {
    id: 'app.containers.DialoguePage.component.SayingDataForm.categoryAdd',
    defaultMessage: '+ Add',
  },
  keywordsFormTitle: {
    id: 'app.containers.DialoguePage.keywordsFormTitle',
    defaultMessage: 'Keywords',
  },
  actionsFormTitle: {
    id: 'app.containers.DialoguePage.actionsFormTitle',
    defaultMessage: 'Actions',
  },
  keywordsPlayHelpAlt: {
    id: 'app.containers.DialoguePage.keywordsPlayHelpAlt',
    defaultMessage: 'Play video off how to add/edit the keywords',
  },
  actionsPlayHelpAlt: {
    id: 'app.containers.DialoguePage.actionsPlayHelpAlt',
    defaultMessage: 'Play video off how to add/edit the actions',
  },
  searchKeywordsAlt: {
    id: 'app.containers.DialoguePage.component.Form.searchKeywordsAlt',
    defaultMessage: 'Search keyword',
  },
  searchKeywordPlaceholder: {
    id: 'app.containers.DialoguePage.component.Form.searchKeywordPlaceholder',
    defaultMessage: 'Search keywords',
  },
  keywordsLabel: {
    id: 'app.containers.DialoguePage.component.KeywordsDataForm.keywordsLabel',
    defaultMessage: 'Keyword List:',
  },
  actionsLabel: {
    id: 'app.containers.DialoguePage.component.KeywordsDataForm.actionsLabel',
    defaultMessage: 'Actions List:',
  },
  create: {
    id: 'app.containers.DialoguePage.component.KeywordsDataForm.create',
    defaultMessage: 'Create',
  },
  duplicateAction: {
    id: 'app.containers.DialoguePage.component.ActionsDataForm.duplicateAction',
    defaultMessage: 'Create a duplicate of this action',
  },
  sayingEnter: {
    id: 'app.containers.DialoguePage.component.SayingsDataForm.sayingEnter',
    defaultMessage: 'Enter',
  },
  pickCategory: {
    id: 'app.containers.DialoguePage.component.PopoverFilter.pickCategory',
    defaultMessage: 'Pick Category',
  },
  pickActions: {
    id: 'app.containers.DialoguePage.component.PopoverFilter.pickActions',
    defaultMessage: 'Actions: ',
  },
  pickKeywords: {
    id: 'app.containers.DialoguePage.component.PopoverFilter.pickKeywords',
    defaultMessage: 'Keywords: ',
  },
  filtersDescription: {
    id: 'app.containers.ReviewPage.component.PopoverFilter.filtersDescription',
    defaultMessage: 'Filter sayings, category, actions and action confidence intervals.',
  },
  pickCategoryLabel: {
    id: 'app.containers.ReviewPage.component.PopoverFilter.pickCategoryLabel',
    defaultMessage: 'Filter Category: ',
  },












  trainingTestSummaryDescription: {
    id: 'app.containers.ActionPage.component.ActionForm.trainingTestSummaryDescription',
    defaultMessage:
      'Overall <b> accuracy is {accuracy}% </b>, the issues are detailed below, click on them to see the corresponding sayings',
  },
  agent: {
    id: 'app.components.MainTab.agent',
    defaultMessage: 'Agent: ',
  },
  dialogue: {
    id: 'app.components.MainTab.dialogue',
    defaultMessage: 'Dialogue',
  },
  keywords: {
    id: 'app.components.MainTab.keywords',
    defaultMessage: 'Keywords',
  },
  createSubtitle: {
    id: 'app.components.MainTab.createSubtitle',
    defaultMessage: 'Create',
  },
  finishButton: {
    id: 'app.components.MainTab.finishButton',
    defaultMessage: 'Save',
  },
  review: {
    id: 'app.components.MainTab.review',
    defaultMessage: 'Review',
  },
  analytics: {
    id: 'app.components.MainTab.analytics',
    defaultMessage: 'Analytics',
  },
  instanceName: {
    id: 'app.components.MainTab.instanceName',
    defaultMessage: 'agent',
  },
  issuesTotal: {
    id: 'app.components.MainTab.issuesTotal',
    defaultMessage: 'issues total',
  },
  accuracyPrc: {
    id: 'app.components.MainTab.accuracyPrc',
    defaultMessage: 'Accuracy %',
  },
  noData: {
    id: 'app.components.MainTab.noData',
    defaultMessage: 'No Data',
  },
  backButton: {
    id: 'app.components.MainTab.backButton',
    defaultMessage: 'Exit',
  }
});
