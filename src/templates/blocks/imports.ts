import type { ConfigOptions } from '../types.js'

export function buildImports(options: ConfigOptions): string[] {
  const lines: string[] = []
  const hasVue = options.frameworks.includes('vue')
  const hasAstro = options.frameworks.includes('astro')

  if (hasAstro) {
    lines.push("import astro from 'eslint-plugin-astro'")
  }

  if (hasVue) {
    lines.push("import eslint from '@eslint/js'")
    lines.push("import tseslint from 'typescript-eslint'")
    lines.push("import eslintPluginVue from 'eslint-plugin-vue'")
    lines.push("import vueParser from 'vue-eslint-parser'")
  }

  if (options.typescript && !hasVue) {
    lines.push("import tseslint from '@typescript-eslint/eslint-plugin'")
    lines.push("import tsParser from '@typescript-eslint/parser'")
  }

  if (options.absolutePath) {
    lines.push("import importPlugin from 'eslint-plugin-import'")
  }

  return lines
}
