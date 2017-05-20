import { ReactiveVar } from 'meteor/reactive-var';
import {
  pkgJson,
  logFactory,
  transformRoutesJsonToRouteObject,
  mergeRoutes,
  mergeRouteMap,
  mergeRouteGroups,
  mergeRoutesByGroup,
  createFlowRouterRoutes,
} from 'meteor/justinr1234:lib';

const debug = logFactory(pkgJson.name, __filename);

export class JustinRouter {
  get routes() {
    return this._routes.get();
  }
  get routeMap() {
    return this._routeMap.get();
  }
  get routeGroups() {
    return this._routeGroups.get();
  }
  get routesByGroup() {
    return this._routesByGroup.get();
  }
  get flowRouterRoutes() {
    return this._flowRouterRoutes.get();
  }
  addRoutes(routes = {}, insertAtFront = false) {
    if (Object.keys(routes).length === 0) {
      debug('skipping addRoutes: empty routes param');
      return;
    }

    const {
      routeMap,
      routeGroups,
      routesByGroup,
    } = transformRoutesJsonToRouteObject(routes);

    const _routes = insertAtFront
      ? mergeRoutes(routes, this._routes.get())
      : mergeRoutes(this._routes.get(), routes);
    const _routeMap = insertAtFront
      ? mergeRouteMap(routeMap, this._routeMap.get())
      : mergeRouteMap(this._routeMap.get(), routeMap);
    const _routeGroups = insertAtFront
      ? mergeRouteGroups(routeGroups, this._routeGroups.get())
      : mergeRouteGroups(this._routeGroups.get(), routeGroups);
    const _routesByGroup = insertAtFront
      ? mergeRoutesByGroup(routesByGroup, this._routesByGroup.get())
      : mergeRoutesByGroup(this._routesByGroup.get(), routesByGroup);
    this._routeMap.set(_routeMap);
    this._routeGroups.set(_routeGroups);
    this._routesByGroup.set(_routesByGroup);
    this._routes.set(_routes);

    // TODO: Merge routes and save?
    const existingRoutes = this._flowRouterRoutes.get();
    this._flowRouterRoutes.set(insertAtFront
      ? [...createFlowRouterRoutes(routesByGroup), ...existingRoutes]
      : [...existingRoutes, ...createFlowRouterRoutes(routesByGroup)]);
  }
  constructor(_routes = {}) {
    this._routeMap = new ReactiveVar({});
    this._routeGroups = new ReactiveVar([]);
    this._routesByGroup = new ReactiveVar({});
    this._routes = new ReactiveVar(_routes);
    this._flowRouterRoutes = new ReactiveVar([]);
    const {
      routeMap = {},
      routeGroups = [],
      routesByGroup = {},
    } = transformRoutesJsonToRouteObject(_routes);
    this._routeMap.set(routeMap);
    this._routeGroups.set(routeGroups);
    this._routesByGroup.set(routesByGroup);
  }
}

export const Router = new JustinRouter();
