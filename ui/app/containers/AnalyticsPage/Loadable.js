/**
 *
 * Asynchronously loads the component for AnalyticsPage
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
