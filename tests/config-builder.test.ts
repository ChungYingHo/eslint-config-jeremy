import { describe, it, expect } from 'vitest'
import { buildConfigSource } from '../src/templates/config-builder.js'
import type { ConfigOptions } from '../src/templates/types.js'

const cases: Array<[string, ConfigOptions]> = [
  ['base only (JS)', { typescript: false, framework: 'none', absolutePath: false, fileExtension: 'js' }],
  ['base + absolutePath (JS)', { typescript: false, framework: 'none', absolutePath: true, fileExtension: 'js' }],
  ['base + TS', { typescript: true, framework: 'none', absolutePath: false, fileExtension: 'js' }],
  ['base + TS + absolutePath', { typescript: true, framework: 'none', absolutePath: true, fileExtension: 'js' }],
  ['vue (JS)', { typescript: false, framework: 'vue', absolutePath: false, fileExtension: 'js' }],
  ['vue + absolutePath (JS)', { typescript: false, framework: 'vue', absolutePath: true, fileExtension: 'js' }],
  ['vue + TS', { typescript: true, framework: 'vue', absolutePath: false, fileExtension: 'js' }],
  ['vue + TS + absolutePath', { typescript: true, framework: 'vue', absolutePath: true, fileExtension: 'js' }],
  ['astro (JS)', { typescript: false, framework: 'astro', absolutePath: false, fileExtension: 'js' }],
  ['astro + absolutePath (JS)', { typescript: false, framework: 'astro', absolutePath: true, fileExtension: 'js' }],
  ['astro + TS', { typescript: true, framework: 'astro', absolutePath: false, fileExtension: 'js' }],
  ['astro + TS + absolutePath', { typescript: true, framework: 'astro', absolutePath: true, fileExtension: 'js' }],
]

describe('buildConfigSource', () => {
  for (const [name, options] of cases) {
    it(`snapshot: ${name}`, () => {
      expect(buildConfigSource(options)).toMatchSnapshot()
    })
  }
})
