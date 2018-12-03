/**
 *
 * Asynchronously loads the component for CategoriesEditPage
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
