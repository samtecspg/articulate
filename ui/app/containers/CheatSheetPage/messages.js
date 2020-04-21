/*
 * CheatSheetPage Messages
 *
 * This contains all the text for the CheatSheetPage component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'app.components.CheatSheetPage.title',
    defaultMessage: 'Discovery Sheet',
  },
  searchPlaceholder: {
    id: 'app.components.CheatSheetPage.searchPlaceholder',
    defaultMessage: 'Search things to say...',
  },
  examplesTitle: {
    id: 'app.components.CheatSheetPage.examplesTitle',
    defaultMessage: 'Examples',
  },
  notEnabledMessage: {
    id: 'app.components.CheatSheetPage.notEnabledMessage',
    defaultMessage: "You haven't enabled the discovery sheet for this agent. Please go to agent settings, enabled the discovery sheet and hit save",
  },
  backToArticulate: {
    id: 'app.components.SayingsInfoPage.backToArticulate',
    defaultMessage: 'Back to Articulate',
  },
});
