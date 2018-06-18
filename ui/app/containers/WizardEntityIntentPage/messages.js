import { defineMessages } from 'react-intl';

export default defineMessages({
  welcomeTitle: {
    id: 'app.components.WizardEntityIntentPage.welcomeTitle',
    defaultMessage: 'Next Step: Create an Entity or Intent',
  },
  welcomeDescription: {
    id: 'app.components.WizardEntityIntentPage.welcomeDescription',
    defaultMessage: 'Nicelly done. We propose you to create either an intent to let your agent understand what are you trying to say, or maybe, you would like to create an entity to let your agent parse user text to identify known elements.',
  },
  actionButtonEntity: {
    id: 'app.components.WizardEntityIntentPage.actionButton',
    defaultMessage: '+ Create Entity',
  },
  actionButtonIntent: {
    id: 'app.components.WizardEntityIntentPage.actionButton',
    defaultMessage: '+ Create Intent',
  }
});
