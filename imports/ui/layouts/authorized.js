import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Template } from 'meteor/templating';

const _isAuthorized = new ReactiveVar(false);

Tracker.autorun(() => {
  _isAuthorized.set(false);
  const userRoles = Meteor.subscribe('userRoles');
  FlowRouter.watchPathChange();
  const current = FlowRouter.current();
  if (current && current.route) {
    let routeRoles = current.route.options.roles;
    if (!routeRoles || routeRoles.length === 0) {
      // if no route roles are assigned, anyone may use the current route
      _isAuthorized.set(true);
    } else if (userRoles.ready()) {
      // if there are route roles, there must be one in common
      if (typeof routeRoles === 'string') {
        routeRoles = [routeRoles];
      }
      const commonRoles = _.intersection(routeRoles, Meteor.user().roles);
      _isAuthorized.set(commonRoles.length > 0);
    } else {
      // otherwise, the user isn't allowed in
      _isAuthorized.set(false);
    }
  }
});

Template.registerHelper('Authorized', () => _isAuthorized.get());
