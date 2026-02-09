const Module = require('module');
const path = require('path');

const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function resolve(request, parent, isMain, options) {
  if (request.startsWith('@/')) {
    const mapped = path.join(process.cwd(), '.tests-dist', request.slice(2)) + '.js';
    return originalResolveFilename.call(this, mapped, parent, isMain, options);
  }

  if (request === '@react-native-async-storage/async-storage') {
    const mapped = path.join(process.cwd(), 'tests', 'stubs', 'async-storage.js');
    return originalResolveFilename.call(this, mapped, parent, isMain, options);
  }

  return originalResolveFilename.call(this, request, parent, isMain, options);
};
