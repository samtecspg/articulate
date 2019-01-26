/*
 * CategoryEditPage Messages
 *
 * This contains all the text for the CategoryEditPage component.
 */

import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'app.containers.CategoryEditPage.title',
    defaultMessage: 'Category',
  },
  instanceName: {
    id: 'app.containers.CategoryEditPage.instanceName',
    defaultMessage: 'category',
  },
  formTitle: {
    id: 'app.containers.CategoryEditPage.formTitle',
    defaultMessage: 'Categories',
  },
  newCategory: {
    id: 'app.containers.CategoryEditPage.newCategory',
    defaultMessage: 'New Category',
  },
  help: {
    id: 'app.containers.CategoryEditPage.help',
    defaultMessage: 'Help?',
  },
  playHelpAlt : {
    id: 'app.containers.CategoryEditPage.playHelpAlt',
    defaultMessage: 'Play video off how to add/edit a category',
  },
  categoryEditDescription: {
    id: 'app.containers.CategoryEditPage.component.Form.categoryEditDescription',
    defaultMessage: 'A category is a unit that forms part of an agent. With a Category you can represent a set of expressions that belongs to an specific context in your agent. Good examples of categories are: Sales, Order Tracking, Customer Service.',
  },
  categoryNameTextField: {
    id: 'app.containers.CategoryEditPage.component.CategoryDataForm.categoryNameTextField',
    defaultMessage: 'Category Name:',
  },
  categoryNameTextFieldPlaceholder: {
    id: 'app.containers.CategoryEditPage.component.CategoryDataForm.categoryNameTextFieldPlaceholder',
    defaultMessage: 'Your Category',
  },
  requiredField: {
    id: 'app.containers.CategoryEditPage.component.CategoryDataForm.requiredField',
    defaultMessage: '*Required',
  },
  finishButton: {
    id: 'app.containers.CategoryEditPage.component.ActionButtons.finishButton',
    defaultMessage: 'Save',
  },
  backButton: {
    id: 'app.containers.CategoryEditPage.backButton',
    defaultMessage: 'Exit',
  },
  sliderActionThresholdLabel: {
    id: 'app.containers.CategoryEditPage.component.CategoryDataForm.sliderActionThresholdLabel',
    defaultMessage: 'Action Threshold',
  },
  extraTrainingData: {
    id: 'app.containers.CategoryEditPage.component.CategoryDataForm.extraTrainingData',
    defaultMessage: 'Generate extra training examples',
  },
  main: {
    id: 'app.containers.AgentPage.component.Form.main',
    defaultMessage: 'Main',
  },
  parameters: {
    id: 'app.containers.AgentPage.component.Form.parameters',
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