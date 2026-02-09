const test = require('node:test');
const assert = require('node:assert/strict');
require('./setup-alias');

const client = require('../.tests-dist/api/client.js');
const students = require('../.tests-dist/api/students.js');

function capture() {
  const calls = [];
  client.apiRequest = async (path, options) => {
    calls.push({ path, options });
    return { ok: true };
  };
  return calls;
}

test('students API chama endpoints corretos', async () => {
  const calls = capture();
  await students.getStudents();
  await students.getStudents(3);
  await students.getStudentById('1');
  await students.createStudent({ name: 'n', email: 'e', course: 'c' });
  await students.updateStudent('1', { name: 'n2', email: 'e2', course: 'c2' });
  await students.deleteStudent('1');

  assert.deepEqual(calls.map((c) => c.path), [
    '/students?page=1',
    '/students?page=3',
    '/students/1',
    '/students',
    '/students/1',
    '/students/1'
  ]);
  assert.equal(calls[3].options.method, 'POST');
  assert.equal(calls[4].options.method, 'PUT');
  assert.equal(calls[5].options.method, 'DELETE');
});
