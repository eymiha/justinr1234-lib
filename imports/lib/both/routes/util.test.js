/* eslint-env mocha */

import sinon from 'sinon';
import { Random } from 'meteor/random';
import { chai } from 'meteor/practicalmeteor:chai';
import { _ } from 'meteor/underscore';
import {
  createRouteMap,
  routeGrouper,
  groupRoutesByGroup,
  createFlowRouterRoutes,
} from './util.js';

const { assert } = chai;

export const testRoutes = {
  ROOT: {
    path: '/',
  },
  ROOT_CHILD: {
    path: '/home',
  },
  GROUP: {
    path: '/group/',
  },
  GROUP_CHILD: {
    path: '/group/child',
  },
  ROUTE_WITH_OVERRIDES: {
    name: 'custom',
    path: '/override',
    group: '/asdf',
    action: () => {},
    triggersEnter: [() => {}],
  },
  ROUTE_WITHOUT_CUSTOM_ACTION: {
    path: '/group/add',
  },
  DUPLICATE_ROUTE: {
    name: 'ROOT',
    path: '/',
  },
  MALFORMED_ROUTE: {
    path: '',
  },
};

describe('Routes Util', () => {
  describe('routeMapper', () => {
    let sandbox;
    let routeMap;
    const randomId = Random.id();

    before(() => {
      sandbox = sinon.sandbox.create();
      sandbox.stub(Random, 'id').callsFake(() => randomId);
      routeMap = createRouteMap(testRoutes);
    });
    after(() => sandbox.restore());

    it('should return proper data for ROOT', () => {
      assert.equal(routeMap.ROOT.name, 'ROOT', 'ROOT route name is not correct');
      assert.equal(routeMap.ROOT.path, '/', 'ROOT route path is not correct');
      assert.equal(routeMap.ROOT.group, '/', 'ROOT route group is not correct');
      assert.ok(routeMap.ROOT.action, 'ROOT route does not have an action');
    });
    it('should return proper data for ROOT_CHILD', () => {
      assert.equal(routeMap.ROOT_CHILD.name, 'ROOT_CHILD', 'ROOT_CHILD route has incorrect name');
      assert.equal(routeMap.ROOT_CHILD.group, '/', 'ROOT_CHILD route has incorrect group');
      assert.equal(routeMap.ROOT_CHILD.path, testRoutes.ROOT_CHILD.path, 'ROOT_CHILD route has incorrect path');
      assert.ok(routeMap.ROOT_CHILD.action, 'ROOT_CHILD route does not have an action');
    });
    it('should return proper data for GROUP', () => {
      assert.equal(routeMap.GROUP.name, 'GROUP', 'GROUP route has incorrect name');
      assert.equal(routeMap.GROUP.group, '/group', 'GROUP route has incorrect group');
      assert.equal(routeMap.GROUP.path, '/group', 'GROUP route has incorrect path');
      assert.ok(routeMap.GROUP.action, 'GROUP does not have am action');
    });
    it('should return proper data for GROUP CHILD', () => {
      assert.equal(routeMap.GROUP_CHILD.name, 'GROUP_CHILD', 'GROUP_CHILD route has incorrect name');
      assert.equal(routeMap.GROUP_CHILD.group, '/group', 'GROUP_CHILD route has incorrect group');
      assert.equal(routeMap.GROUP_CHILD.path, testRoutes.GROUP_CHILD.path, 'GROUP_CHILD has incorrect path');
      assert.ok(routeMap.GROUP_CHILD.action, 'GROUP_CHILD does not have am action');
    });
    it('should respect data overrides', () => {
      const {
        group: expectedGroup,
        path: expectedPath,
        action: expectedAction,
        name: expectedName,
      } = testRoutes.ROUTE_WITH_OVERRIDES;
      const { group, path, action, name } = routeMap.ROUTE_WITH_OVERRIDES;
      assert.equal(group, expectedGroup, 'ROUTE_WITH_OVERRIDES route has incorrect group');
      assert.equal(path, expectedPath, 'ROUTE_WITH_OVERRIDES route has incorrect path');
      assert.equal(action, expectedAction, 'ROUTE_WITH_OVERRIDES route has incorrect action');
      assert.equal(name, expectedName, 'ROUTE_WITH_OVERRIDES route has incorrect name');
    });
    it('should generate new values for duplicated unique fields', () => {
      const expectedName = `random-${randomId}`;
      const expectedPath = `/random-${randomId}`;
      assert.equal(routeMap.DUPLICATE_ROUTE.name, expectedName, 'DUPLICATE_ROUTE route has incorrect name');
      assert.equal(routeMap.DUPLICATE_ROUTE.path, expectedPath, 'DUPLICATE_ROUTE route has incorrect path');
    });
    it('should return random path for malformed route', () => {
      const expectedPath = `/random-${randomId}`;
      assert.equal(routeMap.MALFORMED_ROUTE.path, expectedPath, 'MALFORMED_ROUTE route has incorrect path');
    });

    describe('Route Grouper', () => {
      let routeGroups;
      let routesByGroup;
      before(() => {
        routeGroups = routeGrouper(routeMap);
        routesByGroup = groupRoutesByGroup(routeGroups, routeMap);
      });
      it('should return routes grouped by group', () => {
        const totalGroups = Object.keys(routesByGroup).length;
        const totalRoutes = _.reduce(routesByGroup, (t, g) => t + g.routes.length, 0);
        assert.equal(totalGroups, 3, 'There should be 3 total groups');
        assert.equal(totalRoutes, 8, 'There should be 8 total routes');
        assert.equal(routesByGroup['/'].routes.length, 4, '/ group should have 4 children');
        assert.equal(routesByGroup['/group'].routes.length, 3, '/group group should have 3 children');
        assert.equal(routesByGroup['/asdf'].routes.length, 1, '/asdf group should have 1 child');
      });

      describe('createFlowRouterRoutes', () => {
        let flowRouterRoutes;
        before(() => (flowRouterRoutes = createFlowRouterRoutes(routesByGroup)));
        it('should respect triggers', () => {
          const expectedTriggersEnter = testRoutes.ROUTE_WITH_OVERRIDES.triggersEnter;
          assert.equal(flowRouterRoutes.some((route) => expectedTriggersEnter === route.options.triggersEnter), true);
        });
        it('should create FlowRouter groups', () => {
          assert.equal(flowRouterRoutes.length, 11, 'Should contain 11 routes');
        });
      });
    });
  });
});
