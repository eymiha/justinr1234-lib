# justinr1234:lib (Meteor Package)

This package is part of the [opinionated-meteor-application-template project](https://github.com/justinr1234/opinionated-meteor-application-template). Browse the source code for example of helper functions.

- Check the exports in `/server/main.js` and `/client/main.js`
- Various helpers for default routes and route generation / manipulation
- Debug menu dropdown template to jump to various routes in the system
- Client side helpers for data loading and error handling of publication subscriptions
- Various helpers and exports for publications

## Troubleshooting

If you receive the error `Error: Depending on unknown package <packagename>`: `rm -rf .meteor/local/resolver-result-cache.json`
