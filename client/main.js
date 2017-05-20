import pkgJson from '../imports/version';
import 'izitoast/dist/css/iziToast.min.css';
import { logFactory } from '../imports/lib/debug.js';
import { handleError, mapDataLoadingErrors } from '../imports/lib/client/handle-error.js';
import { subscriptionHandlers, subscriptionHandlersHelpers } from '../imports/lib/client/subscription-handlers.js';
import { Publications } from '../imports/lib/both/publications.js';
import {
  APP_BODY,
  APP_NOT_FOUND,
  mergeTemplates,
  defaultTemplates,
  defaultBlazeRender,
  createRouteMap,
  routeGrouper,
  groupRoutesByGroup,
  createFlowRouterRoutes,
  transformRoutesJsonToRouteObject,
  mergeRoutes,
  mergeRouteMap,
  mergeRouteGroups,
  mergeRoutesByGroup,
} from '../imports/lib/both/routes/util.js';
import { Router } from '../imports/lib/both/routes/router.js';
import '../imports/ui/templates';
import { autoformHooks } from '../imports/lib/client/autoform-hooks.js';
import '../imports/startup/both';
import { DEBUG_ENABLED } from '../imports/startup/both/debug.js';
import { CollectionBehaviors } from '../imports/lib/both/collection-behaviors.js';

export {
  pkgJson,
  logFactory,
  handleError,
  mapDataLoadingErrors,
  subscriptionHandlers,
  subscriptionHandlersHelpers,
  Publications,
  APP_BODY,
  APP_NOT_FOUND,
  mergeTemplates,
  defaultTemplates,
  defaultBlazeRender,
  createRouteMap,
  routeGrouper,
  groupRoutesByGroup,
  createFlowRouterRoutes,
  transformRoutesJsonToRouteObject,
  Router,
  mergeRoutes,
  mergeRouteMap,
  mergeRouteGroups,
  mergeRoutesByGroup,
  autoformHooks,
  DEBUG_ENABLED,
  CollectionBehaviors,
};
