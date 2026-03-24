import type { ConfigOptions } from './types.js'
import { buildImports } from './blocks/imports.js'
import { buildMainBlock } from './blocks/base-block.js'
import { buildAstroSpread, buildAstroFileBlock } from './blocks/astro-block.js'
import { buildVueSpread, buildVueParserBlock, buildVueRulesBlock } from './blocks/vue-block.js'

export function buildConfigSource(options: ConfigOptions): string {
  const lines: string[] = []
  const hasVue = options.frameworks.includes('vue')
  const hasAstro = options.frameworks.includes('astro')

  // imports
  const imports = buildImports(options)
  lines.push(...imports)
  if (imports.length > 0) {
    lines.push('')
  }
  lines.push('export default [')

  if (hasAstro) {
    lines.push(...buildAstroSpread())
    lines.push('')
  }

  if (hasVue) {
    // Vue spread configs + parser setup + combined rules block
    lines.push(...buildVueSpread(options))
    lines.push(...buildVueParserBlock(options))
    lines.push(...buildVueRulesBlock(options))
    if (hasAstro) {
      lines.push(...buildAstroFileBlock())
    }
  } else {
    // No Vue: explicit main block with parser config
    lines.push(...buildMainBlock(options))
    if (hasAstro) {
      lines.push(...buildAstroFileBlock())
    }
  }

  lines.push(']')
  lines.push('')

  return lines.join('\n')
}
