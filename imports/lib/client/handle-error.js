import izitoast from 'izitoast';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Random } from 'meteor/random';
import { pkgJson, logFactory } from 'meteor/justinr1234:lib';

const handleErrorDefaultDebug = logFactory(pkgJson.name, __filename);

const validSeverities = ['info', 'success', 'warning', 'error'];

export const convertMeteorErrorToEJSON = function convertMeteorErrorToEJSON(meteorError) {
  // TODO: Come up with a more elegant solution
  // Workaround EJSONing a Meteor.Error object
  const cache = [];
  return JSON.parse(JSON.stringify(meteorError, function toEJSON(key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Circular reference found, discard key
        return;
      }
      // Store value in our collection
      cache.push(value);
    }
    // eslint-disable-next-line consistent-return
    return value;
  }));
};

export const handleError = this.handleError = function handleError(
  error = {}, // Meteor.Error type
  debug = null,
  dataLoadingErrors = null,
  useToast = true
) {
  const isJavascriptError = Object.prototype.toString.call(error) === '[object Error]';
  // This code could be wrong as we're assuming Meteor.Error or regular javascript error
  const meteorError = isJavascriptError ? new Meteor.Error(error) : error;
  const theError = meteorError && meteorError.error;
  const debugOut = debug || handleErrorDefaultDebug;
  const title = meteorError && meteorError.reason || theError && theError.message || 'Unknown Error';
  let toastMessage = 'Unknown Error';
  let toastSeverity = 'error';

  try {
    let severity;
    let message;

    if (meteorError.details) {
      const parsed = JSON.parse(meteorError && meteorError.details);

      if (!parsed) {
        throw new Error('Invalid JSON parsed from error or error.details');
      }

      severity = parsed.severity;
      message = parsed.message;
    }

    if (_.isString(severity) && validSeverities.includes(severity)) {
      toastSeverity = severity;
    }

    if (_.isString(message)) {
      toastMessage = message;
    } else if (_.isString(meteorError && meteorError.details)) {
      toastMessage = meteorError.details;
    } else if (_.isString(theError && theError.message)) {
      toastMessage = theError.message;
    }
  } catch (e) {
    if (_.isString(meteorError && meteorError.details)) {
      toastMessage = meteorError.details;
    } else if (_.isString(theError && theError.message)) {
      toastMessage = theError.message;
    }
  }

  const ejsonableError = convertMeteorErrorToEJSON(meteorError);

  if (dataLoadingErrors) {
    dataLoadingErrors.set(Random.id(), ejsonableError);
  }

  debugOut(`${title}: ${toastMessage}`);
  debugOut(ejsonableError);

  if (useToast) {
    return izitoast[toastSeverity]({ title, message: toastMessage });
  }

  return meteorError;
};

export const mapDataLoadingErrors = function mapDataLoadingErrors(dataLoadingErrors) {
  return _.map(dataLoadingErrors, (error, _id) => ({ _id, error }));
};
