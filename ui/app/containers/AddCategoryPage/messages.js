/*
 * AddCategoryPage Messages
 *
 * This contains all the text for the AddCategoryPage component.
 */

import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'app.containers.AddCategoryPage.title',
    defaultMessage: 'Category',
  },
  instanceName: {
    id: 'app.containers.AddCategoryPage.instanceName',
    defaultMessage: 'category',
  },
  formTitle: {
    id: 'app.containers.AddCategoryPage.formTitle',
    defaultMessage: 'Categories',
  },
  newCategory: {
    id: 'app.containers.AddCategoryPage.newCategory',
    defaultMessage: 'New Category',
  },
  help: {
    id: 'app.containers.AddCategoryPage.help',
    defaultMessage: 'Help?',
  },
  playHelpAlt: {
    id: 'app.containers.AddCategoryPage.playHelpAlt',
    defaultMessage: 'Play video off how to add/edit a category',
  },
  categoryEditDescription: {
    id: 'app.containers.AddCategoryPage.component.Form.categoryEditDescription',
    defaultMessage:
      'A category is a unit that forms part of an agent. With a Category you can represent a set of expressions that belongs to an specific context in your agent. Good examples of categories are: Sales, Order Tracking, Customer Service.',
  },
  categoryNameTextField: {
    id:
      'app.containers.AddCategoryPage.component.CategoryDataForm.categoryNameTextField',
    defaultMessage: 'Category Name:',
  },
  categoryNameTextFieldPlaceholder: {
    id:
      'app.containers.AddCategoryPage.component.CategoryDataForm.categoryNameTextFieldPlaceholder',
    defaultMessage: 'Your Category',
  },
  requiredField: {
    id:
      'app.containers.AddCategoryPage.component.CategoryDataForm.requiredField',
    defaultMessage: '*Required',
  },
  finishButton: {
    id: 'app.containers.AddCategoryPage.component.ActionButtons.finishButton',
    defaultMessage: 'Save',
  },
  backButton: {
    id: 'app.containers.AddCategoryPage.backButton',
    defaultMessage: 'Exit',
  },
  sliderActionThresholdLabel: {
    id:
      'app.containers.AddCategoryPage.component.CategoryDataForm.sliderActionThresholdLabel',
    defaultMessage: 'Action Threshold',
  },
  extraTrainingData: {
    id:
      'app.containers.AddCategoryPage.component.CategoryDataForm.extraTrainingData',
    defaultMessage: 'Generate extra training examples',
  },
  extraTrainingDataHelp: {
    id:
      'app.containers.AddCategoryPage.component.CategoryDataForm.extraTrainingDataHelp',
    defaultMessage:
      'If you enable this option your keyword values and synonyms will be used to generate training data examples by substituing highlighted values in your sayings.',
  },
  main: {
    id: 'app.containers.AddCategoryPage.component.Form.main',
    defaultMessage: 'Main',
  },
  parameters: {
    id: 'app.containers.AddCategoryPage.component.Form.parameters',
    defaultMessage: 'Parameters',
  },
  newCategoryParameterNameTextField: {
    id:
      'app.containers.AddCategoryPage.component.CategoryParametersForm.newCategoryParameterNameTextField',
    defaultMessage: 'Parameter Name:',
  },
  newCategoryParameterValueTextField: {
    id:
      'app.containers.AddCategoryPage.component.CategoryParametersForm.newCategoryParameterValueTextField',
    defaultMessage: 'Parameter Value:',
  },
  newCategoryParameterNameTextFieldPlaceholder: {
    id:
      'app.containers.AddCategoryPage.component.CategoryParametersForm.newCategoryParameterNameTextFieldPlaceholder',
    defaultMessage: 'Type your parameter name',
  },
  newCategoryParameterValueTextFieldPlaceholder: {
    id:
      'app.containers.AddCategoryPage.component.CategoryParametersForm.newCategoryParameterValueTextFieldPlaceholder',
    defaultMessage: 'Type your parameter value',
  },
  addParameter: {
    id:
      'app.containers.AddCategoryPage.component.CategoryParametersForm.addParameter',
    defaultMessage: '+ Add',
  },
  createCategory: {
    id: 'app.containers.AddCategoryPage.component.CategoryCard.createCategory',
    defaultMessage: '+ Create Category',
  },
  import: {
    id: 'app.containers.AddCategoryPage.component.CategoryCard.import',
    defaultMessage: 'Import',
  },
});
