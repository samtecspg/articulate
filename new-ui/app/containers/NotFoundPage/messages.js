/*
 * NotFoundPage Messages
 *
 * This contains all the text for the NotFoundPage component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  notFoundTitle: {
    id: 'app.components.NotFoundPage.title',
    defaultMessage: 'Oops! Something went wrong',
  },
  notFoundParagraph: {
    id: 'app.components.NotFoundPage.not_found_paragraph',
    defaultMessage: 'The page you are looking doesn\'t seem to exists. If you are not able to find your desired resource please go to our docs and find more about how to use Articulate. If you think this is an issue please contact us.',
  },
  needHelp: {
    id: 'app.components.MissingAPIPage.needHelp',
    defaultMessage: 'Need Help?',
  },
});
