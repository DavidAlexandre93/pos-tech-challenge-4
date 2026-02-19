module.exports = {
  root: true,
  env: {
    es2022: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  extends: ['eslint:recommended'],
  overrides: [
    {
      files: ['src/**/*.{ts,tsx}', 'App.tsx'],
      parser: './tools/eslint-typescript-parser.cjs',
      env: {
        browser: true
      },
      globals: {
        fetch: 'readonly',
        FormData: 'readonly',
        alert: 'readonly'
      },
      rules: {
        'no-undef': 'off',
        'no-unused-vars': 'off'
      }
    },
    {
      files: ['tests/**/*.js'],
      env: {
        node: true
      }
    }
  ],
  ignorePatterns: ['.tests-dist/', 'node_modules/']
};
