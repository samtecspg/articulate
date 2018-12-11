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
    defaultMessage: 'Back',
  },
  cancelButton: {
    id: 'app.containers.CategoryEditPage.component.ActionButtons.cancelButton',
    defaultMessage: 'Cancel',
  },
  sliderActionThresholdLabel: {
    id: 'app.containers.CategoryEditPage.component.CategoryDataForm.sliderActionThresholdLabel',
    defaultMessage: 'Action Threshold',
  },
  extraTrainingData: {
    id: 'app.containers.CategoryEditPage.component.CategoryDataForm.extraTrainingData',
    defaultMessage: 'Generate extra training examples',
  },
});