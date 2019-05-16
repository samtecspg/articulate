/*
 * CategoryPage Messages
 *
 * This contains all the text for the CategoryPage component.
 */

import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'app.containers.CategoryPage.title',
    defaultMessage: 'Category',
  },
  instanceName: {
    id: 'app.containers.CategoryPage.instanceName',
    defaultMessage: 'category',
  },
  formTitle: {
    id: 'app.containers.CategoryPage.formTitle',
    defaultMessage: 'Categories',
  },
  newCategory: {
    id: 'app.containers.CategoryPage.newCategory',
    defaultMessage: 'New Category',
  },
  help: {
    id: 'app.containers.CategoryPage.help',
    defaultMessage: 'Help?',
  },
  playHelpAlt : {
    id: 'app.containers.CategoryPage.playHelpAlt',
    defaultMessage: 'Play video off how to add/edit a category',
  },
  categoryEditDescription: {
    id: 'app.containers.CategoryPage.component.Form.categoryEditDescription',
    defaultMessage: 'A category is a unit that forms part of an agent. With a Category you can represent a set of expressions that belongs to an specific context in your agent. Good examples of categories are: Sales, Order Tracking, Customer Service.',
  },
  categoryNameTextField: {
    id: 'app.containers.CategoryPage.component.CategoryDataForm.categoryNameTextField',
    defaultMessage: 'Category Name:',
  },
  categoryNameTextFieldPlaceholder: {
    id: 'app.containers.CategoryPage.component.CategoryDataForm.categoryNameTextFieldPlaceholder',
    defaultMessage: 'Your Category',
  },
  requiredField: {
    id: 'app.containers.CategoryPage.component.CategoryDataForm.requiredField',
    defaultMessage: '*Required',
  },
  finishButton: {
    id: 'app.containers.CategoryPage.component.ActionButtons.finishButton',
    defaultMessage: 'Save',
  },
  backButton: {
    id: 'app.containers.CategoryPage.backButton',
    defaultMessage: 'Exit',
  },
  sliderActionThresholdLabel: {
    id: 'app.containers.CategoryPage.component.CategoryDataForm.sliderActionThresholdLabel',
    defaultMessage: 'Action Threshold',
  },
  extraTrainingData: {
    id: 'app.containers.CategoryPage.component.CategoryDataForm.extraTrainingData',
    defaultMessage: 'Generate extra training examples',
  },
  extraTrainingDataHelp: {
    id: 'app.containers.CategoryPage.component.CategoryDataForm.extraTrainingDataHelp',
    defaultMessage: 'If you enable this option your keyword values and synonyms will be used to generate training data examples by substituing highlighted values in your sayings.',
  },
  main: {
    id: 'app.containers.CategoryPage.component.Form.main',
    defaultMessage: 'Main',
  },
  parameters: {
    id: 'app.containers.CategoryPage.component.Form.parameters',
    defaultMessage: 'Parameters',
  },
  newCategoryParameterNameTextField: {
    id: 'app.containers.CategoryPage.component.CategoryParametersForm.newCategoryParameterNameTextField',
    defaultMessage: 'Parameter Name:',
  },
  newCategoryParameterValueTextField: {
    id: 'app.containers.CategoryPage.component.CategoryParametersForm.newCategoryParameterValueTextField',
    defaultMessage: 'Parameter Value:',
  },
  newCategoryParameterNameTextFieldPlaceholder: {
    id: 'app.containers.CategoryPage.component.CategoryParametersForm.newCategoryParameterNameTextFieldPlaceholder',
    defaultMessage: 'Type your parameter name',
  },
  newCategoryParameterValueTextFieldPlaceholder: {
    id: 'app.containers.CategoryPage.component.CategoryParametersForm.newCategoryParameterValueTextFieldPlaceholder',
    defaultMessage: 'Type your parameter value',
  },
  addParameter: {
    id: 'app.containers.CategoryPage.component.CategoryParametersForm.addParameter',
    defaultMessage: '+ Add',
  },
});