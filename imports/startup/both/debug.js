import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { ReactiveVar } from 'meteor/reactive-var';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const DEBUG_ENABLED = new ReactiveVar(false);

if (Meteor.isClient) {
  Tracker.autorun(function debugAutorun() {
    if (!!Meteor._localStorage.getItem('debug')) {
      SimpleSchema.debug = true;
      DEBUG_ENABLED.set(true);
    } else {
      DEBUG_ENABLED.set(false);
      SimpleSchema.debug = false;
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function debugStartup() {
    if (process.env.DEBUG) {
      DEBUG_ENABLED.set(true);
    }
  });
}
