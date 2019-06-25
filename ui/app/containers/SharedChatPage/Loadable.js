/**
 *
 * Asynchronously loads the component for SharedChatPage
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
