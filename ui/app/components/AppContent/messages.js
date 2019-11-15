/*
 * AppContent Messages
 *
 * This contains all the text for the AppContent component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  settingsIconAlt: {
    id: 'app.components.AppContent.settingsIconAlt',
    defaultMessage: 'Settings',
  },
  usersIconAlt: {
    id: 'app.components.AppContent.usersIconAlt',
    defaultMessage: 'Users',
  },
  signOutQuestion: {
    id: 'app.components.AppContent.signOutQuestion',
    defaultMessage: 'You are about to sign out of Articulate',
  },
  signOutExplanation: {
    id: 'app.components.AppContent.signOutExplanation',
    defaultMessage: 'Do you want to sign out?',
  },
  signOutNo: {
    id: 'app.components.AppContent.signOutNo',
    defaultMessage: 'No',
  },
  signOutYes: {
    id: 'app.components.AppContent.signOutYes',
    defaultMessage: 'Sign Out',
  },
  popoverUserTitle: {
    id: 'app.components.AppContent.popoverUserTitle',
    defaultMessage: 'User:',
  },
  popoverUserSignOut: {
    id: 'app.components.AppContent.popoverUserSignOut',
    defaultMessage: 'Sign Out',
  }
});
