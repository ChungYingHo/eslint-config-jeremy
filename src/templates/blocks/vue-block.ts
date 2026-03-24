import type { ConfigOptions } from '../types.js'
import { serializeRules } from '../serialize.js'
import { baseRules } from '../../rules/base.js'
import { typescriptRules } from '../../rules/typescript.js'
import { vueRules } from '../../rules/vue.js'
import { absolutePathRules } from '../../rules/absolute-path.js'

export function buildVueSpread(options: ConfigOptions): string[] {
  const lines: string[] = ['  eslint.configs.recommended,']
  if (options.typescript) {
    lines.push('  ...tseslint.configs.recommended,')
  }
  lines.push("  ...eslintPluginVue.configs['flat/recommended'],")
  return lines
}

export function buildVueParserBlock(options: ConfigOptions): string[] {
  const lines: string[] = [
    '',
    '  {',
    "    files: ['*.vue', '**/*.vue'],",
    '    languageOptions: {',
    '      parser: vueParser,',
    '      parserOptions: {',
  ]

  if (options.typescript) {
    lines.push('        parser: tseslint.parser,')
  }

  lines.push(
    "        sourceType: 'module',",
    "        extraFileExtensions: ['.vue'],",
    '      },',
    '    },',
    '  },',
  )

  return lines
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
