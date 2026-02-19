const test = require('node:test');
const assert = require('node:assert/strict');
require('./setup-alias');

const {
  ROOT_ROUTES,
  canManageContent,
  getAvailableTabs,
  resolveRootRoute
} = require('../.tests-dist/navigation/accessControl.js');

test('resolveRootRoute controla fluxo inicial entre loading, login e app', () => {
  assert.equal(resolveRootRoute(true, false), null);
  assert.equal(resolveRootRoute(false, false), ROOT_ROUTES.login);
  assert.equal(resolveRootRoute(false, true), ROOT_ROUTES.app);
});

test('getAvailableTabs libera abas administrativas apenas para docentes', () => {
  assert.deepEqual(getAvailableTabs('student'), ['Posts']);
  assert.deepEqual(getAvailableTabs('teacher'), ['Posts', 'Docentes', 'Alunos', 'Admin']);
});

test('canManageContent libera criação/edição de conteúdo para teacher', () => {
  assert.equal(canManageContent('teacher'), true);
  assert.equal(canManageContent('student'), false);
  assert.equal(canManageContent(undefined), false);
});
