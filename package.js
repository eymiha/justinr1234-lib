/* globals Package, Npm */
Package.describe({
  name: 'justinr1234:lib',
  version: '0.0.17',
  summary: 'justinr1234 Lib',
  documentation: 'README.md',
  git: 'https://github.com/justinr1234/justinr1234-lib',
});

Npm.depends({
  izitoast: '1.1.1',
  debug: '2.6.3',
});

Package.onUse(api => {
  // If no version is specified for an `api.use` dependency, use the one defined
  // in Meteor 1.4.3.1.
  api.versionsFrom('1.4.4.2');
  api.use('reactive-var');
  api.use('reactive-dict');
  api.use('ecmascript');
  api.use('random');
  api.use('underscore');
  api.use('localstorage');

  // CLIENT LIB
  api.use('templating@1.3.2', 'client');
  api.use('kadira:flow-router@2.12.1');

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
