import { defineMessages } from 'react-intl';

export default defineMessages({
  welcomeTitle: {
    id: 'app.components.WizardIntentPage.welcomeTitle',
    defaultMessage: 'Final Step: Create an Intent',
  },
  welcomeDescription: {
    id: 'app.components.WizardIntentPage.welcomeDescription',
    defaultMessage: ' You\'re almost there. The final step is the creation of an intent inside your domain that will help your agent parse texts to map them into actions that could use your entity as a parameter.',
  },
  actionButtonIntent: {
    id: 'app.components.WizardIntentPage.actionButton',
    defaultMessage: '+ Create Intent',
  }
});
