/*
 * DomainEditPage Messages
 *
 * This contains all the text for the DomainEditPage component.
 */

import { defineMessages } from 'react-intl';

export default defineMessages({
    title: {
        id: 'app.containers.DomainEditPage.title',
        defaultMessage: 'Category',
    },
    formTitle: {
        id: 'app.containers.DomainEditPage.formTitle',
        defaultMessage: 'Categories',
    },
    newCategory: {
        id: 'app.containers.DomainEditPage.newCategory',
        defaultMessage: 'New Category',
    },
    help: {
        id: 'app.containers.DomainEditPage.help',
        defaultMessage: 'Help?'
    },
    playHelpAlt : {
        id: 'app.containers.DomainEditPage.playHelpAlt',
        defaultMessage: 'Play video off how to add/edit a category'
    },
    domainEditDescription: {
        id: 'app.containers.DomainEditPage.component.Form.domainEditDescription',
        defaultMessage: 'A category is a unit that forms part of an agent. With a Category you can represent a set of expressions that belongs to an specific context in your agent. Good examples of categories are: Sales, Order Tracking, Customer Service.'
    },
    domainNameTextField: {
      id: 'app.containers.DomainEditPage.component.DomainDataForm.domainNameTextField',
      defaultMessage: 'Category Name:'
    },
    domainNameTextFieldPlaceholder: {
      id: 'app.containers.DomainEditPage.component.DomainDataForm.domainNameTextFieldPlaceholder',
      defaultMessage: 'Your Category'
    },
    requiredField: {
      id: 'app.containers.DomainEditPage.component.DomainDataForm.requiredField',
      defaultMessage: '*Required'
    },
    finishButton: {
      id: 'app.containers.DomainEditPage.component.ActionButtons.finishButton',
      defaultMessage: 'Save'
    },
    cancelButton: {
      id: 'app.containers.DomainEditPage.component.ActionButtons.cancelButton',
      defaultMessage: 'Cancel'
    },
    sliderActionThresholdLabel: {
      id: 'app.containers.DomainEditPage.component.DomainDataForm.sliderActionThresholdLabel',
      defaultMessage: 'Action Threshold'
    },
    extraTrainingData: {
      id: 'app.containers.DomainEditPage.component.DomainDataForm.extraTrainingData',
      defaultMessage: 'Generate extra training examples'
    },
});