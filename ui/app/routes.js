import { getAsyncInjectors } from './utils/asyncInjectors';

const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

export default function createRoutes(store) {
  const { injectReducer, injectSagas } = getAsyncInjectors(store);

  return [
    {
      path: '/',
      name: 'home',
      getComponent(nextState, cb) {
        import('containers/HomePage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    },
    {
      path: '/missing-api',
      name: 'home',
      getComponent(nextState, cb) {
        import('containers/MissingAPIPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    },
    {
      path: '/wizard/domain',
      name: 'wizardDomain',
      getComponent(nextState, cb) {
        import('containers/WizardDomainPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    },
    {
      path: '/wizard/entity-intent',
      name: 'wizardEntityIntent',
      getComponent(nextState, cb) {
        import('containers/WizardEntityIntentPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    },
    {
      path: '/wizard/intent',
      name: 'wizardIntent',
      getComponent(nextState, cb) {
        import('containers/WizardIntentPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    },
    {
      path: '/agents/create',
      name: 'agents',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/AgentPage/reducer'),
          import('containers/AgentPage/sagas'),
          import('containers/AgentPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('agent', reducer.default);
          injectSagas(sagas.default);

          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/agent/:id/edit',
      name: 'agentEdit',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/AgentPage/reducer'),
          import('containers/AgentPage/sagas'),
          import('containers/AgentPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('agent', reducer.default);
          injectSagas(sagas.default);

          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/agent/:id',
      name: 'agentDetail',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/AgentDetailPage/reducer'),
          import('containers/AgentDetailPage/sagas'),
          import('containers/AgentDetailPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('agentDetail', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/domains/create',
      name: 'domains',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/DomainPage/reducer'),
          import('containers/DomainPage/sagas'),
          import('containers/DomainPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('domain', reducer.default);
          injectSagas(sagas.default);

          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/domain/:id/edit',
      name: 'domainEdit',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/DomainPage/reducer'),
          import('containers/DomainPage/sagas'),
          import('containers/DomainPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('domain', reducer.default);
          injectSagas(sagas.default);

          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/domains',
      name: 'domains',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/DomainListPage/reducer'),
          import('containers/DomainListPage/sagas'),
          import('containers/DomainListPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('domains', reducer.default);
          injectSagas(sagas.default);

          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/intents',
      name: 'intents',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/IntentListPage/reducer'),
          import('containers/IntentListPage/sagas'),
          import('containers/IntentListPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('intents', reducer.default);
          injectSagas(sagas.default);

          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/intents/create',
      name: 'intents',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/IntentPage/reducer'),
          import('containers/IntentPage/sagas'),
          import('containers/IntentPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('intent', reducer.default);
          injectSagas(sagas.default);

          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/intent/:id/edit',
      name: 'intentEdit',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/IntentPage/reducer'),
          import('containers/IntentPage/sagas'),
          import('containers/IntentPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('intent', reducer.default);
          injectSagas(sagas.default);

          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/entities',
      name: 'entities',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/EntityListPage/reducer'),
          import('containers/EntityListPage/sagas'),
          import('containers/EntityListPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('entities', reducer.default);
          injectSagas(sagas.default);

          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/entities/create',
      name: 'entities',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/EntityPage/reducer'),
          import('containers/EntityPage/sagas'),
          import('containers/EntityPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('entity', reducer.default);
          injectSagas(sagas.default);

          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/entity/:id/edit',
      name: 'entityEdit',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/EntityPage/reducer'),
          import('containers/EntityPage/sagas'),
          import('containers/EntityPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('entity', reducer.default);
          injectSagas(sagas.default);

          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/settings/global',
      name: 'globalSettings',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/GlobalSettingsPage/reducer'),
          import('containers/GlobalSettingsPage/sagas'),
          import('containers/GlobalSettingsPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('globalSettings', reducer.default);
          injectSagas(sagas.default);

          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/settings/rasa',
      name: 'rasaSettings',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/RasaSettingsPage/reducer'),
          import('containers/RasaSettingsPage/sagas'),
          import('containers/RasaSettingsPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('rasaSettings', reducer.default);
          injectSagas(sagas.default);

          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/settings/duckling',
      name: 'ducklingSettings',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/DucklingSettingsPage/reducer'),
          import('containers/DucklingSettingsPage/sagas'),
          import('containers/DucklingSettingsPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('ducklingSettings', reducer.default);
          injectSagas(sagas.default);

          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '*',
      name: 'notfound',
      getComponent(nextState, cb) {
        import('containers/NotFoundPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    },
  ];
}
