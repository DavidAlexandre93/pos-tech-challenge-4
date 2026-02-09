const test = require('node:test');
const assert = require('node:assert/strict');
require('./setup-alias');

const AsyncStorage = require('@react-native-async-storage/async-storage');
const { STORAGE_KEYS, API_BASE_URL } = require('../.tests-dist/utils/constants.js');
const { apiRequest } = require('../.tests-dist/api/client.js');

test.beforeEach(() => {
  AsyncStorage.__reset();
  global.fetch = undefined;
});

test('apiRequest adiciona JSON content-type quando há body', async () => {
  global.fetch = async (_url, options) => ({
    ok: true,
    status: 200,
    json: async () => ({ ok: true, headers: options.headers.get('Content-Type') }),
  });

  const result = await apiRequest('/posts', { method: 'POST', body: JSON.stringify({ a: 1 }) });
  assert.equal(result.headers, 'application/json');
});

test('apiRequest envia token no header Authorization', async () => {
  await AsyncStorage.setItem(STORAGE_KEYS.token, 'abc');
  global.fetch = async (_url, options) => ({
    ok: true,
    status: 200,
    json: async () => ({ auth: options.headers.get('Authorization') }),
  });

  const result = await apiRequest('/auth/me');
  assert.equal(result.auth, 'Bearer abc');
});

test('apiRequest lança erro para resposta não OK', async () => {
  global.fetch = async () => ({ ok: false, text: async () => 'Falhou' });
  await assert.rejects(() => apiRequest('/x'), /Falhou/);
});

test('apiRequest retorna objeto vazio em status 204', async () => {
  global.fetch = async () => ({ ok: true, status: 204 });
  const result = await apiRequest('/x', { method: 'DELETE' });
  assert.deepEqual(result, {});
});

test('apiRequest usa URL base configurada', async () => {
  let capturedUrl = '';
  global.fetch = async (url) => {
    capturedUrl = url;
    return { ok: true, status: 200, json: async () => ({}) };
  };

  await apiRequest('/students?page=1');
  assert.equal(capturedUrl, `${API_BASE_URL}/students?page=1`);
});
