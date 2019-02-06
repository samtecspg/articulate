/*
 * KeywordsEditPage Messages
 *
 * This contains all the text for the KeywordsEditPage component.
 */

import { defineMessages } from 'react-intl';

export default defineMessages({
  modifierFormDescription: {
    id: 'app.containers.KeywordsEditPage.modifierFormDescription',
    defaultMessage: 'Keyword modifiers are special kind of user saying that take a keyword and turn it into an action. These saying can modify the slot values by setting, adding, and removing values from slots.',
  },
  createSubtitle: {
    id: 'app.containers.KeywordsEditPage.createSubtitle',
    defaultMessage: 'Create',
  },
  instanceName: {
    id: 'app.containers.KeywordsEditPage.instanceName',
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
  newKeywordSynonymTextField: {
    id: 'app.containers.KeywordsEditPage.component.ValuesForm.newKeywordValueTextField',
    defaultMessage: 'Synonyms:',
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
  },
  noName: {
    id: 'app.containers.KeywordsEditPage.component.MainTab.noName',
    defaultMessage: 'No name'
  },
  modifiersFormTitle: {
    id: 'app.containers.KeywordsEditPage.component.ActionForm.modifiersFormTitle',
    defaultMessage: 'Modifiers',
  },
  modifiers: {
    id: 'app.containers.KeywordsEditPage.component.MainTab.modifiers',
    defaultMessage: 'Modifiers',
  },
  textpromptTextFieldPlaceholder: {
    id: 'app.containers.KeywordsEditPage.component.ModifierForm.textpromptTextFieldPlaceholder',
    defaultMessage: 'Write bot\'s response when this modifier is required and it is missing',
  },
  textpromptHelperText: {
    id: 'app.containers.KeywordsEditPage.component.ModifierForm.textpromptHelperText',
    defaultMessage: '*Please add at least one text prompt if the modifier is required',
  },
  modifierNameTextField: {
    id: 'app.containers.KeywordsEditPage.component.ModifierForm.modifierNameTextField',
    defaultMessage: 'Modifier Name',
  },
  modifierNameTextFieldPlaceholder: {
    id: 'app.containers.KeywordsEditPage.component.ModifierForm.modifierNameTextFieldPlaceholder',
    defaultMessage: 'Set a name to reference the modifier in your responses',
  },
  modifierIsRequired: {
    id: 'app.containers.KeywordsEditPage.component.ModifierForm.modifierIsRequired',
    defaultMessage: 'Is Required?',
  },
  modifierIsList: {
    id: 'app.containers.KeywordsEditPage.component.ModifierForm.modifierIsList',
    defaultMessage: 'Is List?',
  },
  newModifierTab: {
    id: 'app.containers.KeywordsEditPage.component.ModifiersForm.newModifierTab',
    defaultMessage: '+ Add Modifier',
  },
  actionSelect: {
    id: 'app.containers.KeywordsEditPage.component.ModifierForm.actionSelect',
    defaultMessage: 'Action:',
  },
  valueSourceSelect: {
    id: 'app.containers.KeywordsEditPage.component.ModifierForm.valueSourceSelect',
    defaultMessage: 'Using:',
  },
  staticValueTextField: {
    id: 'app.containers.KeywordsEditPage.component.ModifierForm.staticValueTextField',
    defaultMessage: 'Value:',
  },
  staticValueTextFieldPlaceholder: {
    id: 'app.containers.KeywordsEditPage.component.ModifierForm.staticValueTextFieldPlaceholder',
    defaultMessage: 'Enter the value you want to use for this modifier',
  },
  sayingTextField: {
    id: 'app.containers.KeywordsEditPage.component.ModifierForm.sayingTextField',
    defaultMessage: 'User Says',
  },
  sayingTextFieldPlaceholder: {
    id: 'app.containers.KeywordsEditPage.component.ModifierForm.sayingTextFieldPlaceholder',
    defaultMessage: 'Write what a user would say to your agent',
  },
  sayingEnter: {
    id: 'app.containers.KeywordsEditPage.component.ModifierForm.sayingEnter',
    defaultMessage: 'Enter',
  },
  highlightTooltip: {
    id: 'app.containers.KeywordsEditPage.component.ModifierForm.highlightTooltip',
    defaultMessage: 'Highlight a word to make it a keyword',
  },
  backPage: {
    id: 'app.containers.KeywordsEditPage.component.ModifierForm.backPage',
    defaultMessage: 'Back',
  },
  nextPage: {
    id: 'app.containers.KeywordsEditPage.component.ModifierForm.nextPage',
    defaultMessage: 'Next',
  },
  show: {
    id: 'app.containers.KeywordsEditPage.component.ModifierForm.show',
    defaultMessage: 'Show',
  },
  entries: {
    id: 'app.containers.KeywordsEditPage.component.ModifierForm.entries',
    defaultMessage: 'entries',
  },
  modifiersTooltip: {
    id: 'app.containers.KeywordsEditPage.component.MainTab.modifiersTooltip',
    defaultMessage: 'You must save the keyword before creating modifiers.',
  },
});