import type { ConfigOptions } from '../types.js'
import { serializeRules } from '../serialize.js'
import { baseRules } from '../../rules/base.js'
import { typescriptRules } from '../../rules/typescript.js'
import { absolutePathRules } from '../../rules/absolute-path.js'

export function buildMainBlock(options: ConfigOptions): string[] {
  const lines: string[] = []

  const fileGlobs = options.typescript
    ? "'**/*.{js,ts,tsx,mts,cts}'"
    : "'**/*.{js,jsx,mjs,cjs}'"

  lines.push('  {')
  lines.push(`    files: [${fileGlobs}],`)

  // languageOptions
  if (options.typescript && options.framework !== 'vue') {
    lines.push('    languageOptions: {')
    lines.push('      parser: tsParser,')
    lines.push("      ecmaVersion: 'latest',")
    lines.push("      sourceType: 'module',")
    lines.push('    },')
  }

  // plugins
  const plugins: string[] = []
  if (options.typescript && options.framework !== 'vue') {
    plugins.push("      '@typescript-eslint': tseslint,")
  }
  if (options.absolutePath) {
    plugins.push('      import: importPlugin,')
  }
  if (plugins.length > 0) {
    lines.push('    plugins: {')
    lines.push(...plugins)
    lines.push('    },')
  }

  // rules
  const allRules: Record<string, unknown> = { ...baseRules }
  if (options.typescript) {
    Object.assign(allRules, typescriptRules)
  }
  if (options.absolutePath) {
    Object.assign(allRules, absolutePathRules)
  }

  lines.push('    rules: {')
  lines.push(serializeRules(allRules, 6))
  lines.push('    },')

  lines.push('  },')

  return lines
}
