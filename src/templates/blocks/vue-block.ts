import type { ConfigOptions } from '../types.js'
import { serializeRules } from '../serialize.js'
import { baseRules } from '../../rules/base.js'
import { typescriptRules } from '../../rules/typescript.js'
import { vueRules } from '../../rules/vue.js'
import { absolutePathRules } from '../../rules/absolute-path.js'

export function buildVueSpread(): string[] {
  return [
    '  eslint.configs.recommended,',
    '  ...tseslint.configs.recommended,',
    "  ...eslintPluginVue.configs['flat/recommended'],",
  ]
}

export function buildVueParserBlock(): string[] {
  return [
    '',
    '  {',
    "    files: ['*.vue', '**/*.vue'],",
    '    languageOptions: {',
    '      parser: vueParser,',
    '      parserOptions: {',
    '        parser: tseslint.parser,',
    "        sourceType: 'module',",
    "        extraFileExtensions: ['.vue'],",
    '      },',
    '    },',
    '  },',
  ]
}

export function buildVueRulesBlock(options: ConfigOptions): string[] {
  const allRules: Record<string, unknown> = { ...baseRules }
  if (options.typescript) {
    Object.assign(allRules, typescriptRules)
  }
  Object.assign(allRules, vueRules)
  if (options.absolutePath) {
    Object.assign(allRules, absolutePathRules)
  }

  return [
    '',
    '  {',
    '    rules: {',
    serializeRules(allRules, 6),
    '    },',
    '  },',
  ]
}
