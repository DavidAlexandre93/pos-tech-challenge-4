const test = require('node:test');
const assert = require('node:assert/strict');
require('./setup-alias');

const client = require('../.tests-dist/api/client.js');
const posts = require('../.tests-dist/api/posts.js');

function capture() {
  const calls = [];
  client.apiRequest = async (path, options) => {
    calls.push({ path, options });
    return { ok: true };
  };
  return calls;
}

test('posts API chama endpoints corretos', async () => {
  const calls = capture();
  await posts.getPosts();
  await posts.getPostById('10');
  await posts.createPost({ title: 't', content: 'c', author: 'a' });
  await posts.updatePost('10', { title: 't2', content: 'c2', author: 'a2' });
  await posts.deletePost('10');

  assert.deepEqual(calls.map((c) => c.path), ['/posts', '/posts/10', '/posts', '/posts/10', '/posts/10']);
  assert.equal(calls[2].options.method, 'POST');
  assert.equal(calls[3].options.method, 'PUT');
  assert.equal(calls[4].options.method, 'DELETE');
});
