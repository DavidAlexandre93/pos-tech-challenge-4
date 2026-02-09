const test = require('node:test');
const assert = require('node:assert/strict');
require('./setup-alias');

const client = require('../.tests-dist/api/client.js');
const teachers = require('../.tests-dist/api/teachers.js');

function capture() {
  const calls = [];
  client.apiRequest = async (path, options) => {
    calls.push({ path, options });
    return { ok: true };
  };
  return calls;
}

test('teachers API chama endpoints corretos', async () => {
  const calls = capture();
  await teachers.getTeachers();
  await teachers.getTeachers(2);
  await teachers.getTeacherById('1');
  await teachers.createTeacher({ name: 'n', email: 'e', department: 'd' });
  await teachers.updateTeacher('1', { name: 'n2', email: 'e2', department: 'd2' });
  await teachers.deleteTeacher('1');

  assert.deepEqual(calls.map((c) => c.path), [
    '/teachers?page=1',
    '/teachers?page=2',
    '/teachers/1',
    '/teachers',
    '/teachers/1',
    '/teachers/1'
  ]);
  assert.equal(calls[3].options.method, 'POST');
  assert.equal(calls[4].options.method, 'PUT');
  assert.equal(calls[5].options.method, 'DELETE');
});
