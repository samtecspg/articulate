/*
 * KeywordsEditPage Messages
 *
 * This contains all the text for the KeywordsEditPage component.
 */

import { defineMessages } from 'react-intl';

export default defineMessages({
    title: {
        id: 'app.containers.KeywordsEditPage.title',
        defaultMessage: 'Agent',
    },
    formTitle: {
        id: 'app.containers.KeywordsEditPage.formTitle',
        defaultMessage: 'Keywords',
    },
    help: {
        id: 'app.containers.KeywordsEditPage.help',
        defaultMessage: 'Help?'
    },
    playHelpAlt : {
        id: 'app.containers.KeywordsEditPage.playHelpAlt',
        defaultMessage: 'Play video off how to add/edit the keywords'
    },
    searchKeywordsAlt: {
        id: 'app.containers.KeywordsEditPage.component.Form.searchKeywordsAlt',
        defaultMessage: 'Search keyword'
    },
    searchKeywordPlaceholder: {
        id: 'app.containers.KeywordsEditPage.component.Form.searchKeywordPlaceholder',
        defaultMessage: 'Search keywords'
    },
    keywordEditDescription: {
        id: 'app.containers.KeywordsEditPage.component.Form.keywordEditDescription',
        defaultMessage: 'Keywords are elements in the text that your agent is going to recognized according to the training you give it.'
    },
    keywordNameTextField: {
      id: 'app.containers.KeywordsEditPage.component.KeywordDataForm.keywordNameTextField',
      defaultMessage: 'Keyword Name:'
    },
    keywordNameTextFieldPlaceholder: {
      id: 'app.containers.KeywordsEditPage.component.KeywordDataForm.keywordNameTextFieldPlaceholder',
      defaultMessage: 'Your Keyword'
    },
    requiredField: {
      id: 'app.containers.KeywordsEditPage.component.KeywordDataForm.requiredField',
      defaultMessage: '*Required'
    },
    keywordValuesError: {
      id: 'app.containers.KeywordsEditPage.component.KeywordDataForm.keywordValuesError',
      defaultMessage: '*At least one value is required'
    },
    typeSelect: {
      id: 'app.containers.KeywordsEditPage.component.KeywordDataForm.typeSelect',
      defaultMessage: 'Type:'
    },
    learned: {
      id: 'app.containers.KeywordsEditPage.component.KeywordDataForm.learned',
      defaultMessage: 'Learned (Default)'
    },
    regex: {
      id: 'app.containers.KeywordsEditPage.component.KeywordDataForm.regex',
      defaultMessage: 'Regex'
    },
    timezoneSelect: {
      id: 'app.containers.KeywordsEditPage.component.KeywordDataForm.timezoneSelect',
      defaultMessage: 'Timezone:'
    },
    uiColorLabel: {
        id: 'app.containers.KeywordsEditPage.component.KeywordDataForm.uiColorLabel',
        defaultMessage: 'Color Highlight:'
    },
    regexTextField: {
      id: 'app.containers.KeywordsEditPage.component.KeywordDataForm.regexTextField',
      defaultMessage: 'Regex Matching:'
    },
    regexTextFieldPlaceholder: {
      id: 'app.containers.KeywordsEditPage.component.KeywordDataForm.regexTextFieldPlaceholder',
      defaultMessage: 'This will Rasa NLU classifier to improve its performance'
    },
    newKeywordValueTextField: {
      id: 'app.containers.KeywordsEditPage.component.KeywordDataForm.newKeywordValueTextFieldPlaceholder',
      defaultMessage: 'Value:'
    },
    newKeywordValueTextFieldPlaceholder: {
      id: 'app.containers.KeywordsEditPage.component.KeywordDataForm.newKeywordValueTextFieldPlaceholder',
      defaultMessage: 'Type keyword value'
    },
    newKeywordValueSynonymTextField: {
      id: 'app.containers.KeywordsEditPage.component.KeywordDataForm.newKeywordValueSynonymTextFieldPlaceholder',
      defaultMessage: 'Synonym Values:'
    },
    newKeywordValueSynonymTextFieldPlaceholder: {
      id: 'app.containers.KeywordsEditPage.component.KeywordDataForm.newKeywordValueSynonymTextFieldPlaceholder',
      defaultMessage: '+ Synonym'
    },
    finishButton: {
      id: 'app.containers.KeywordsEditPage.component.ActionButtons.finishButton',
      defaultMessage: 'Save'
    },
    cancelButton: {
      id: 'app.containers.KeywordsEditPage.component.ActionButtons.cancelButton',
      defaultMessage: 'Cancel'
    },
});