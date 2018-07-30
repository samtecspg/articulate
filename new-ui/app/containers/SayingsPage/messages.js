/*
 * SayingsPage Messages
 *
 * This contains all the text for the SayingsPage component.
 */

import { defineMessages } from 'react-intl';

export default defineMessages({
    title: {
      id: 'app.containers.SayingsPage.title',
      defaultMessage: 'Agent',
    },
    formTitle: {
        id: 'app.containers.SayingsPage.formTitle',
        defaultMessage: 'Sayings',
    },
    help: {
        id: 'app.containers.SayingsPage.help',
        defaultMessage: 'Help?'
    },
    playHelpAlt : {
        id: 'app.containers.SayingsPage.playHelpAlt',
        defaultMessage: 'Play video off how to add/edit the user sayings'
    },
    sayingTextField: {
      id: 'app.containers.SayingsPage.component.SayingDataForm.sayingTextField',
      defaultMessage: 'User Says'
    },
    sayingTextFieldPlaceholder: {
      id: 'app.containers.SayingsPage.component.Form.sayingTextFieldPlaceholder',
      defaultMessage: 'Write what a user would say to your agent'
    },
    searchSayingsAlt: {
        id: 'app.containers.SayingsPage.component.Form.searchSayingsAlt',
        defaultMessage: 'Search user saying'
    },
    searchSayingPlaceholder: {
        id: 'app.containers.SayingsPage.component.Form.searchSayingPlaceholder',
        defaultMessage: 'Search sayings'
    },
    highlightTooltip: {
        id: 'app.containers.SayingsPage.component.SayingDataForm.highlightTooltip',
        defaultMessage: 'Highlight a word to make it a keyword'
    },
    backPage: {
        id: 'app.containers.SayingsPage.component.SayingDataForm.backPage',
        defaultMessage: 'Back'
    },
    nextPage: {
        id: 'app.containers.SayingsPage.component.SayingDataForm.nextPage',
        defaultMessage: 'Next'
    },
    newAction: {
        id: 'app.containers.SayingsPage.component.SayingRow.newAction',
        defaultMessage: '+ New Action'
    }
});
