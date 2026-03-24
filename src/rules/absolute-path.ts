export const absolutePathRules = {
  'no-restricted-imports': [
    'error',
    {
      patterns: ['../*', './*'],
    },
  ],
  'import-x/no-relative-parent-imports': 'error',
  'import-x/no-relative-packages': 'error',
} as const
