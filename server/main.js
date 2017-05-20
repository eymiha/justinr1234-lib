import pkgJson from '../imports/version.js';
import { logFactory } from '../imports/lib/debug.js';
import { Security } from './security.js';
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
import '../imports/startup/both';
import { DEBUG_ENABLED } from '../imports/startup/both/debug.js';
import { CollectionBehaviors } from '../imports/lib/both/collection-behaviors.js';

export {
  pkgJson,
  logFactory,
  Security,
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
  DEBUG_ENABLED,
  CollectionBehaviors,
};
