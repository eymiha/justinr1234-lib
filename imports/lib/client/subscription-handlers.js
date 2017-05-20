import { Template } from 'meteor/templating';
import { pkgJson, handleError, mapDataLoadingErrors, logFactory } from 'meteor/justinr1234:lib';

const subscriptionHandlersDebug = logFactory(pkgJson.name, __filename);

export const defaultOnReady = function defaultOnReady(dataLoading) {
  dataLoading.set(false);
};

export const defaultOnStop = function defaultOnError(dataLoading, dataLoadingErrors, onStopDebug, error) {
  dataLoading.set(false);

  if (error) {
    const debug = onStopDebug || subscriptionHandlersDebug;
    handleError(error, debug, dataLoadingErrors);
  }
};

export const subscriptionHandlers = function subscriptionHandlers({
  onReady,
  onStop,
  dataLoading,
  dataLoadingErrors,
  debug,
}) {
  return {
    onReady: onReady || defaultOnReady.bind(null, dataLoading),
    onStop: onStop || defaultOnStop.bind(null, dataLoading, dataLoadingErrors, debug),
  };
};

function hasDataLoadingError() {
  return Template.instance().dataLoadingErrors.all().length > 0;
}

function isDataLoading() {
  return Template.instance().dataLoading.get();
}

function getDataLoadingErrors() {
  return mapDataLoadingErrors(Template.instance().dataLoadingErrors.all());
}

export const subscriptionHandlersHelpers = function subscriptionHandlersHelpers() {
  return {
    dataLoading: () => isDataLoading(),
    dataLoadingErrors: () => getDataLoadingErrors(),
    hasDataLoadingError: () => hasDataLoadingError(),
    dataLoadSuccessful: () => !isDataLoading() && !hasDataLoadingError(),
  };
};
