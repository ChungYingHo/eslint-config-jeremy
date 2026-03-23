import type { ConfigOptions } from './types.js'
import { buildImports } from './blocks/imports.js'
import { buildMainBlock } from './blocks/base-block.js'
import { buildAstroSpread, buildAstroFileBlock } from './blocks/astro-block.js'
import { buildVueSpread, buildVueParserBlock, buildVueRulesBlock } from './blocks/vue-block.js'

export function buildConfigSource(options: ConfigOptions): string {
  const lines: string[] = []

  // imports
  lines.push(...buildImports(options))
  lines.push('')
  lines.push('export default [')

  if (options.framework === 'astro') {
    lines.push(...buildAstroSpread())
    lines.push('')
    lines.push(...buildMainBlock(options))
    lines.push(...buildAstroFileBlock())
  } else if (options.framework === 'vue') {
    lines.push(...buildVueSpread())
    lines.push(...buildVueParserBlock())
    lines.push(...buildVueRulesBlock(options))
  } else {
    lines.push(...buildMainBlock(options))
  }

  lines.push(']')
  lines.push('')

  return lines.join('\n')
}
