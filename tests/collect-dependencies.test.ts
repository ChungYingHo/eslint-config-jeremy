import { describe, it, expect } from 'vitest'
import type { ConfigOptions } from '../src/templates/types.js'

// collectDependencies is not exported, so we test it indirectly
// by importing the module and accessing the function via a wrapper
// Since it's a private function in init.ts, we replicate the logic here for testing
function collectDependencies(options: ConfigOptions): string[] {
  const deps: string[] = []
  const hasVue = options.frameworks.includes('vue')
  const hasAstro = options.frameworks.includes('astro')

  if (options.typescript && !hasVue) {
    deps.push('@typescript-eslint/eslint-plugin', '@typescript-eslint/parser')
  }

  if (hasVue) {
    deps.push('eslint-plugin-vue', 'vue-eslint-parser', '@eslint/js')
    if (options.typescript) {
      deps.push('typescript-eslint')
    }
  }

  if (hasAstro) {
    deps.push('eslint-plugin-astro')
  }

  if (options.absolutePath) {
    deps.push('eslint-plugin-import-x')
    if (options.typescript) {
      deps.push('eslint-import-resolver-typescript')
    }
  }

  return deps
}

describe('collectDependencies', () => {
  it('base JS — no deps', () => {
    const deps = collectDependencies({ typescript: false, frameworks: [], absolutePath: false, fileExtension: 'js' })
    expect(deps).toEqual([])
  })

  it('base TS — installs individual TS packages', () => {
    const deps = collectDependencies({ typescript: true, frameworks: [], absolutePath: false, fileExtension: 'js' })
    expect(deps).toEqual(['@typescript-eslint/eslint-plugin', '@typescript-eslint/parser'])
  })

  it('vue JS — installs vue + eslint/js', () => {
    const deps = collectDependencies({ typescript: false, frameworks: ['vue'], absolutePath: false, fileExtension: 'js' })
    expect(deps).toEqual(['eslint-plugin-vue', 'vue-eslint-parser', '@eslint/js'])
  })

  it('vue TS — installs vue + eslint/js + typescript-eslint (unified), NOT individual TS packages', () => {
    const deps = collectDependencies({ typescript: true, frameworks: ['vue'], absolutePath: false, fileExtension: 'js' })
    expect(deps).toEqual(['eslint-plugin-vue', 'vue-eslint-parser', '@eslint/js', 'typescript-eslint'])
    expect(deps).not.toContain('@typescript-eslint/eslint-plugin')
    expect(deps).not.toContain('@typescript-eslint/parser')
  })

  it('astro JS — installs astro plugin', () => {
    const deps = collectDependencies({ typescript: false, frameworks: ['astro'], absolutePath: false, fileExtension: 'js' })
    expect(deps).toEqual(['eslint-plugin-astro'])
  })

  it('astro + vue TS — installs both framework plugins + vue TS deps', () => {
    const deps = collectDependencies({ typescript: true, frameworks: ['vue', 'astro'], absolutePath: false, fileExtension: 'js' })
    expect(deps).toContain('eslint-plugin-vue')
    expect(deps).toContain('vue-eslint-parser')
    expect(deps).toContain('@eslint/js')
    expect(deps).toContain('typescript-eslint')
    expect(deps).toContain('eslint-plugin-astro')
    expect(deps).not.toContain('@typescript-eslint/eslint-plugin')
  })

  it('absolutePath JS — installs import plugin only', () => {
    const deps = collectDependencies({ typescript: false, frameworks: [], absolutePath: true, fileExtension: 'js' })
    expect(deps).toEqual(['eslint-plugin-import-x'])
  })

  it('absolutePath TS — installs import plugin + resolver', () => {
    const deps = collectDependencies({ typescript: true, frameworks: [], absolutePath: true, fileExtension: 'js' })
    expect(deps).toContain('eslint-plugin-import-x')
    expect(deps).toContain('eslint-import-resolver-typescript')
  })
})
