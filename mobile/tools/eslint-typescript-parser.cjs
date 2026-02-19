const ts = require('typescript');
const espree = require('espree');

function parseForESLint(code, options = {}) {
  const transpiled = ts.transpileModule(code, {
    compilerOptions: {
      jsx: ts.JsxEmit.Preserve,
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.ESNext
    },
    reportDiagnostics: false
  }).outputText;

  const parserOptions = options && options.ecmaVersion ? options : {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true }
  };

  const ast = espree.parse(transpiled, parserOptions);
  return { ast };
}

module.exports = {
  parseForESLint,
  parse: (code, options) => parseForESLint(code, options).ast
};
