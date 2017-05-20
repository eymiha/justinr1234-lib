import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { handleError, logFactory, pkgJson } from 'meteor/justinr1234:lib';
import { _ } from 'meteor/underscore';

const autoformHandlersDebug = logFactory(pkgJson.name, __filename);

/* eslint-disable no-param-reassign */

export const defaultUpdateBefore = function defaultUpdateBefore(doc) {
  // Only update the field that was changed, not the entire document
  if (this.autoSaveChangedElement) {
    doc.$set = { ..._.pick(doc.$set, this.autoSaveChangedElement.name) };
    if (this.ss && this.ss.field) {
      doc.$set.userId = Meteor.userId();
    }
    delete doc.$unset;
  }
  return doc;
};

export const defaultInsertOnSuccess = function defaultInsertOnSuccess(formSuccess, onSuccessDebug, successRoute) {
  formSuccess.set(this);
  const debug = onSuccessDebug || autoformHandlersDebug;
  if (successRoute) {
    debug(`Successfully submitted form, navigating to ${successRoute}`);
    FlowRouter.go(successRoute);
  }
};

export const defaultUpdateOnSuccess = function defaultOnSuccess(formSuccess, onSuccessDebug, successRoute) {
  formSuccess.set(this);
  const debug = onSuccessDebug || autoformHandlersDebug;
  if (this.autoSaveChangedElement) {
    debug(`Saved data for ${this.autoSaveChangedElement.name}`);
  } else {
    if (successRoute) {
      FlowRouter.go(successRoute);
    }
  }
};

export const defaultOnError = function defaultOnError(formSuccess, autoformError, onErrorDebug, formType, error) {
  formSuccess.set(null);
  const debug = onErrorDebug || autoformHandlersDebug;
  handleError(error, debug, autoformError);
};

export const autoformHooks = function autoformHooks({
  baseName = Random.id(),
  successRoute,
  updateOnSuccess,
  updateOnError,
  insertOnSuccess,
  insertOnError,
  formSuccess,
  autoformError,
  debug,
}) {
  return {
    [`UPDATE_${baseName}_FORM`]: {
      before: {
        update: defaultUpdateBefore,
      },
      onError: updateOnError || function updateOnErrorWrapper(formType, error) {
        defaultOnError.apply(this, [formSuccess, autoformError, debug, formType, error]);
      },
      onSuccess: updateOnSuccess || function updateOnSuccessWrapper() {
        defaultUpdateOnSuccess.apply(this, [formSuccess, debug, successRoute]);
      },
    },
    [`INSERT_${baseName}_FORM`]: {
      onError: insertOnError || function insertOnErrorWrapper(formType, error) {
        defaultOnError.apply(this, [formSuccess, autoformError, debug, formType, error]);
      },
      onSuccess: insertOnSuccess || function insertOnSuccessWrapper() {
        defaultInsertOnSuccess.apply(this, [formSuccess, debug, successRoute]);
      },
    },
  };
};
