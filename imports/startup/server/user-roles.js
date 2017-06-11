import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Roles } from 'meteor/alanning:roles';

Meteor.publish('userRoles', function () {
  return Meteor.users.find({ _id: this.userId }, { fields: { roles: 1 } });
});

Roles.assertRoles = (roles) => {
  const existingRoles = _.pluck(Roles.getAllRoles().fetch(), 'name');
  _.each(roles, (role) => {
    if (!(_.contains(existingRoles, role))) {
      Roles.createRole(role);
    }
  });
};

// Prime the system with a set of basic roles
export const appRoles = ['admin', 'user'];
Roles.assertRoles(appRoles);
