import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Random } from 'meteor/random';
import { _ } from 'meteor/underscore';
import { pkgJson, logFactory } from 'meteor/justinr1234:lib';

export const warn = logFactory(pkgJson.name, __filename, '@warn-');

// TODO: Move config into global file
// BEGIN: Config
export const defaultTemplates = {
  nav: 'Header',
  footer: 'Footer',
};

export const APP_BODY = 'App_Body';
export const APP_NOT_FOUND = 'App_Not_Found';
// END: Config

export const mergeTemplates = (templates, ...args) => Object.assign({}, templates, ...args);

export const defaultActionTemplates = name => mergeTemplates(defaultTemplates, { main: name });
export const defaultAction = name => BlazeLayout.render(APP_BODY, defaultActionTemplates(name));
export const defaultBlazeRender = main => BlazeLayout.render(APP_BODY, mergeTemplates(defaultTemplates, { main }));

const getGroupFromPath = path => {
  const isRoot = path === '/';
  if (isRoot) {
    return '/';
  }

  const group = path.split('/');
  group.shift(); // remove "" entry
  const isRootChild = group.length === 1;
  // /child
  if (isRootChild) {
    return '/';
  }
  // /group/
  // /group/child
  const isGroupPath = group.length === 2;
  if (isGroupPath) {
    return `/${group[0]}`;
  }

  const randomGroup = `/random-${Random.id()}`;
  warn(`routeMapper received unknown group, genereated random group ${randomGroup} instead.`);

  return randomGroup;
};

const routeMapReducer = (map, data, key) => {
  let name = data.name || key;

  if (Object.keys(map).includes(name)) {
    name = `random-${Random.id()}`;
    warn(`routeMapper received duplicate name ${data.name || key}, generated random name ${name} instead.`);
  }

  let path = data.path;
  if (!path) {
    path = `/random-${Random.id()}`;
    warn(`routeMapper received route missing a path, generated random path ${path} instead.`);
  }

  if (_.find(map, e => e.path === path)) {
    path = `/random-${Random.id()}`;
    warn(`routeMapper received duplicate path ${data.path}, generated random path ${path} instead.`);
  }

  const group = data.group || getGroupFromPath(path);

  const isNotRootRoute = path !== '/';
  if (isNotRootRoute && path.endsWith('/')) {
    path = path.slice(0, -1);
  }

  const action = data.action || defaultAction.bind(null, name);

  const payload = _.omit(data, ['path', 'name', 'group', 'action']);
  payload.path = path;
  payload.name = name;
  payload.group = group;
  payload.action = action;
  map[key] = payload; // eslint-disable-line no-param-reassign
  return map;
};

export const routeGrouper = map => _.reduce(map, (g, route) => {
  const { group, name } = route;
  if (!_.findWhere(g, { group })) {
    g[name] = route;  // eslint-disable-line no-param-reassign
  }
  return g;
}, {});
const groupMapReducer = (map, g, { group }) => {
  const routes = _.where(map, { group });
  // eslint-disable-next-line no-param-reassign
  g[group] = {
    groupInfo: routes[0],
    routes,
  };
  return g;
};
export const groupRoutesByGroup = (groups, map) => _.reduce(groups, groupMapReducer.bind(this, map), {});
export const createRouteMap = (routesToMap) => _.reduce(routesToMap, routeMapReducer, {});
export const flowRouterMapReducer = (flowRouterRoutes, routesByGroup) => {
  const { groupInfo, routes } = routesByGroup;
  const { path, triggersEnter = [], triggersExit = [] } = groupInfo;
  const flowRouterGroup = FlowRouter.group({ name: path, triggersEnter, triggersExit });
  const groupRoutes = routes.map(route => {
    const routeObj = _.omit(route, 'path');
    const flowRouterRoute = flowRouterGroup.route(route.path, routeObj);
    return flowRouterRoute;
  });
  return [...flowRouterRoutes, flowRouterGroup, ...groupRoutes];
};
export const transformRoutesJsonToRouteObject = routes => {
  const routeMap = createRouteMap(routes) || {};
  const routeGroups = routeGrouper(routeMap);
  const routesByGroup = groupRoutesByGroup(routeGroups, routeMap);
  return {
    routeMap,
    routeGroups,
    routesByGroup,
  };
};
export const createFlowRouterRoutes = (routesByGroup) => _.reduce(routesByGroup, flowRouterMapReducer, []);
export const mergeRoutes = (a = {}, b = {}) => ({ ...a, ...b });
export const mergeRouteMap = (a = {}, b = {}) => ({ ...a, ...b });
export const mergeRouteGroups = (a = [], b = []) => [...a, ...b];
export const mergeRoutesByGroup = (a = {}, b = {}) => ({ ...a, ...b });
