import { describe, it, expect } from 'vitest'
import { buildConfigSource } from '../src/templates/config-builder.js'
import type { ConfigOptions } from '../src/templates/types.js'

const cases: Array<[string, ConfigOptions]> = [
  // No framework
  ['base (JS)',                  { typescript: false, frameworks: [],              absolutePath: false, fileExtension: 'js' }],
  ['base + absolutePath (JS)',   { typescript: false, frameworks: [],              absolutePath: true,  fileExtension: 'js' }],
  ['base + TS',                  { typescript: true,  frameworks: [],              absolutePath: false, fileExtension: 'js' }],
  ['base + TS + absolutePath',   { typescript: true,  frameworks: [],              absolutePath: true,  fileExtension: 'js' }],
  // Vue only
  ['vue (JS)',                   { typescript: false, frameworks: ['vue'],         absolutePath: false, fileExtension: 'js' }],
  ['vue + absolutePath (JS)',    { typescript: false, frameworks: ['vue'],         absolutePath: true,  fileExtension: 'js' }],
  ['vue + TS',                   { typescript: true,  frameworks: ['vue'],         absolutePath: false, fileExtension: 'js' }],
  ['vue + TS + absolutePath',    { typescript: true,  frameworks: ['vue'],         absolutePath: true,  fileExtension: 'js' }],
  // Astro only
  ['astro (JS)',                 { typescript: false, frameworks: ['astro'],       absolutePath: false, fileExtension: 'js' }],
  ['astro + absolutePath (JS)',  { typescript: false, frameworks: ['astro'],       absolutePath: true,  fileExtension: 'js' }],
  ['astro + TS',                 { typescript: true,  frameworks: ['astro'],       absolutePath: false, fileExtension: 'js' }],
  ['astro + TS + absolutePath',  { typescript: true,  frameworks: ['astro'],       absolutePath: true,  fileExtension: 'js' }],
  // Astro + Vue (islands)
  ['astro + vue (JS)',           { typescript: false, frameworks: ['vue', 'astro'], absolutePath: false, fileExtension: 'js' }],
  ['astro + vue + absolutePath', { typescript: false, frameworks: ['vue', 'astro'], absolutePath: true,  fileExtension: 'js' }],
  ['astro + vue + TS',           { typescript: true,  frameworks: ['vue', 'astro'], absolutePath: false, fileExtension: 'js' }],
  ['astro + vue + TS + absolutePath', { typescript: true, frameworks: ['vue', 'astro'], absolutePath: true, fileExtension: 'js' }],
]

describe('buildConfigSource', () => {
  for (const [name, options] of cases) {
    it(`snapshot: ${name}`, () => {
      expect(buildConfigSource(options)).toMatchSnapshot()
    })
  }
})
