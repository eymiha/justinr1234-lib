/* globals Package, Npm */
Package.describe({
  name: 'justinr1234:lib',
  version: '0.0.19',
  summary: 'justinr1234 Lib',
  documentation: 'README.md',
  git: 'https://github.com/justinr1234/justinr1234-lib',
});

Npm.depends({
  izitoast: '1.1.1',
  debug: '2.6.3',
});

Package.onUse(api => {
  api.versionsFrom('1.4.4.2');
  api.use('reactive-var');
  api.use('reactive-dict');
  api.use('ecmascript');
  api.use('random');
  api.use('underscore');
  api.use('localstorage');
  api.use('accounts-base');

  // CLIENT LIB
  api.use('accounts-ui@1.1.9');
  api.use('templating@1.3.2', 'client');
  api.use('kadira:flow-router@2.12.1');
  api.use('accounts-password@1.3.6');
  api.use('useraccounts:flow-routing@1.14.2');
  api.use('useraccounts:semantic-ui@1.14.2', 'client');
  api.use('aldeed:autoform@5.8.1', 'client');

  // COMMON LIB
  api.use('aldeed:simple-schema@1.5.3');
  api.use('ongoworks:security@2.1.0');
  api.use('zimme:collection-behaviours@1.1.3');
  api.use('zimme:collection-softremovable@1.0.5');
  api.use('zimme:collection-timestampable@1.0.9');

  // MAIN MODULES
  api.mainModule('client/main.js', 'client');
  api.mainModule('server/main.js', 'server');
});

Package.onTest(api => {
  api.use('justinr1234:lib');
  api.use('practicalmeteor:chai');
  api.use('practicalmeteor:mocha');
  api.use('dispatch:mocha');
});
