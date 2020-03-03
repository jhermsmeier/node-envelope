'use strict'
module.exports = {
  extends: ['eslint:recommended'],
  env: {
    node: true,
    es6: true
  },
  overrides: [
    {
      files: 'test/**',
      env: {
        mocha: true
      }
    }
  ],
  rules: {
    semi: ['error', 'never'],
    'no-empty': ['error', {allowEmptyCatch: true}],
    'no-var': ['error'],
    'prefer-const': ['error'],
    'prefer-destructuring': ['error'],
    'object-shorthand': ['error'],
    'quotes': ['error', 'single']
  }
}
