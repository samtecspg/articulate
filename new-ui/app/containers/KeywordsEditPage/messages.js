/*
 * KeywordsEditPage Messages
 *
 * This contains all the text for the KeywordsEditPage component.
 */

import { defineMessages } from 'react-intl';

export default defineMessages({
  createSubtitle: {
    id: 'app.containers.ActionPage.createSubtitle',
    defaultMessage: 'Create',
  },
  instanceName: {
    id: 'app.containers.ActionPage.instanceName',
    defaultMessage: 'keyword',
  },
  keywordFormTitle: {
    id: 'app.containers.KeywordsEditPage.component.KeywordForm.keywordFormTitle',
    defaultMessage: 'Keyword',
  },
  playHelpAlt : {
    id: 'app.containers.KeywordsEditPage.playHelpAlt',
    defaultMessage: 'Play video off how to add/edit the keywords',
  },
  help: {
    id: 'app.containers.KeywordsEditPage.help',
    defaultMessage: 'Help?',
  },
  keywordFormDescription: {
    id: 'app.containers.KeywordsEditPage.component.KeywordForm.keywordFormDescription',
    defaultMessage: 'Keywords are elements in the text that your agent is going to recognized according to the training you give it.',
  },
  valuesFormDescription: {
    id: 'app.containers.KeywordsEditPage.component.ValuesForm.valuesFormDescription',
    defaultMessage: 'These are going to be samples of the values that your keyword could take. You could specify also synonyms for each value that represent your keyword.',
  },
  keywordNameTextField: {
    id: 'app.containers.KeywordsEditPage.component.KeywordForm.keywordNameTextField',
    defaultMessage: 'Keyword Name:',
  },
  keywordNameTextFieldPlaceholder: {
    id: 'app.containers.KeywordsEditPage.component.KeywordForm.keywordNameTextFieldPlaceholder',
    defaultMessage: 'Add a name for your keyword',
  },
  requiredField: {
    id: 'app.containers.KeywordsEditPage.requiredField',
    defaultMessage: '*Required',
  },
  uiColorLabel: {
    id: 'app.containers.KeywordsEditPage.component.KeywordDataForm.uiColorLabel',
    defaultMessage: 'Color Highlight:',
  },
  learned: {
    id: 'app.containers.KeywordsEditPage.component.KeywordDataForm.learned',
    defaultMessage: 'Learned (Default)',
  },
  typeSelect: {
    id: 'app.containers.KeywordsEditPage.component.KeywordDataForm.typeSelect',
    defaultMessage: 'Type:',
  },
  regex: {
    id: 'app.containers.KeywordsEditPage.component.KeywordDataForm.regex',
    defaultMessage: 'Regex',
  },
  regexTextField: {
    id: 'app.containers.KeywordsEditPage.component.KeywordDataForm.regexTextField',
    defaultMessage: 'Regex Matching:',
  },
  regexTextFieldPlaceholder: {
    id: 'app.containers.KeywordsEditPage.component.KeywordDataForm.regexTextFieldPlaceholder',
    defaultMessage: 'This will Rasa NLU classifier to improve its performance',
  },
  keyword: {
    id: 'app.containers.KeywordsEditPage.component.MainTab.keyword',
    defaultMessage: 'Keyword: ',
  },
  values: {
    id: 'app.containers.KeywordsEditPage.component.MainTab.values',
    defaultMessage: 'Values',
  },
  modifiers: {
    id: 'app.containers.KeywordsEditPage.component.MainTab.modifiers',
    defaultMessage: 'Modifiers',
  },
  backButton: {
    id: 'app.containers.KeywordsEditPage.backButton',
    defaultMessage: 'Exit',
  },
  finishButton: {
    id: 'app.containers.KeywordsEditPage.component.MainTab.finishButton',
    defaultMessage: 'Save',
  },
  nextButton: {
    id: 'app.containers.KeywordsEditPage.component.MainTab.nextButton',
    defaultMessage: 'Next >',
  },
  valuesFormTitle: {
    id: 'app.containers.KeywordsEditPage.component.ValuesForm.valuesFormTitle',
    defaultMessage: 'Values',
  },
  newKeywordValueTextField: {
    id: 'app.containers.KeywordsEditPage.component.ValuesForm.newKeywordValueTextField',
    defaultMessage: 'Value:',
  },
  newKeywordValueTextFieldPlaceholder: {
    id: 'app.containers.KeywordsEditPage.component.ValuesForm.newKeywordValueTextFieldPlaceholder',
    defaultMessage: 'Type keyword value',
  },
  newKeywordRegexTextFieldPlaceholder: {
    id: 'app.containers.KeywordsEditPage.component.ValuesForm.newKeywordRegexTextFieldPlaceholder',
    defaultMessage: 'Type regex value',
  },
  newKeywordValueSynonymTextField: {
    id: 'app.containers.KeywordsEditPage.component.ValuesForm.newKeywordValueSynonymTextFieldPlaceholder',
    defaultMessage: 'Synonym Values:',
  },
  newKeywordValueSynonymTextFieldPlaceholder: {
    id: 'app.containers.KeywordsEditPage.component.ValuesForm.newKeywordValueSynonymTextFieldPlaceholder',
    defaultMessage: '+ Synonym',
  },
  keywordValuesError: {
    id: 'app.containers.KeywordsEditPage.component.ValuesForm.keywordValuesError',
    defaultMessage: '*At least one value is required',
  }
});