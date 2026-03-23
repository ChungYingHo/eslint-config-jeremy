import { serializeRules } from '../serialize.js'
import { astroFileRules } from '../../rules/astro.js'

export function buildAstroSpread(): string[] {
  return [
    '  ...astro.configs.recommended,',
  ]
}

export function buildAstroFileBlock(): string[] {
  return [
    '',
    '  {',
    "    files: ['**/*.astro'],",
    '    rules: {',
    serializeRules(astroFileRules, 6),
    '    },',
    '  },',
  ]
}
