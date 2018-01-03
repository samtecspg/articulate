/*
 * WizardDomainPage Messages
 *
 * This contains all the text for the WizardDomainPage component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  welcomeTitle: {
    id: 'app.components.WizardDomainPage.welcomeTitle',
    defaultMessage: 'Next Step: Create an Entity or Intent',
  },
  welcomeDescription: {
    id: 'app.components.WizardDomainPage.welcomeDescription',
    defaultMessage: 'Nicelly done. We propose you to create either an intent to let your agent understand what are you trying to say, or maybe, you would like to create an entity to let your agent parse user text to identify known elements.',
  },
  actionButtonEntity: {
    id: 'app.components.WizardDomainPage.actionButton',
    defaultMessage: '+ Create Entity',
  },
  actionButtonIntent: {
    id: 'app.components.WizardDomainPage.actionButton',
    defaultMessage: '+ Create Intent',
  }
});
