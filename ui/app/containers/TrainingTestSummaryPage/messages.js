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
  keywordsFormTitle: {
    id: 'app.containers.DialoguePage.keywordsFormTitle',
    defaultMessage: 'Keywords',
  },
  actionsFormTitle: {
    id: 'app.containers.DialoguePage.actionsFormTitle',
    defaultMessage: 'Actions',
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
