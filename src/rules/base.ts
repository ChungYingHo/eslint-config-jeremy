export const baseRules = {
  quotes: ['error', 'single', { avoidEscape: true }],
  semi: ['error', 'never'],
  indent: ['error', 2, { SwitchCase: 1 }],
  'eol-last': ['error', 'always'],
  'brace-style': ['error', '1tbs', { allowSingleLine: false }],
  'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],

  eqeqeq: ['error', 'always'],
  'no-var': 'error',
  'prefer-const': 'error',
  'no-useless-return': 'warn',
  'no-else-return': 'warn',
  'no-unexpected-multiline': 'error',

  'no-console': ['warn', { allow: ['warn', 'error'] }],
} as const
