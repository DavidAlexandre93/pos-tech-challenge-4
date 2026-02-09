const test = require('node:test');
const assert = require('node:assert/strict');
require('./setup-alias');

const client = require('../.tests-dist/api/client.js');
const auth = require('../.tests-dist/api/auth.js');

test('loginRequest envia payload e mapeia retorno para AuthUser', async () => {
  let called = null;
  client.apiRequest = async (path, options) => {
    called = { path, options };
    return { token: 'jwt', user: { id: '1', name: 'Ana', role: 'teacher' } };
  };

  const result = await auth.loginRequest('a@a.com', '123');

  assert.equal(called.path, '/auth/login');
  assert.equal(called.options.method, 'POST');
  assert.deepEqual(JSON.parse(called.options.body), { email: 'a@a.com', password: '123' });
  assert.deepEqual(result, { id: '1', name: 'Ana', role: 'teacher', token: 'jwt' });
});

test('getAuthenticatedUser retorna usuário com token vazio', async () => {
  client.apiRequest = async () => ({ id: '2', name: 'Beto', role: 'student' });

  const result = await auth.getAuthenticatedUser();
  assert.deepEqual(result, { id: '2', name: 'Beto', role: 'student', token: '' });
});
