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
    'no-empty': ['error', {allowEmptyCatch: true}]
  }
}
