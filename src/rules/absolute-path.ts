export const absolutePathRules = {
  'no-restricted-imports': [
    'error',
    {
      patterns: ['../*', './*'],
    },
  ],
  'import/no-relative-parent-imports': 'error',
  'import/no-relative-packages': 'error',
} as const
