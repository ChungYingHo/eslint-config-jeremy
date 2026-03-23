import type { ConfigOptions } from '../types.js'

export function buildImports(options: ConfigOptions): string[] {
  const lines: string[] = []

  if (options.framework === 'astro') {
    lines.push("import astro from 'eslint-plugin-astro'")
  }

  if (options.framework === 'vue') {
    lines.push("import eslint from '@eslint/js'")
    lines.push("import tseslint from 'typescript-eslint'")
    lines.push("import eslintPluginVue from 'eslint-plugin-vue'")
    lines.push("import vueParser from 'vue-eslint-parser'")
  }

  if (options.typescript && options.framework !== 'vue') {
    lines.push("import tseslint from '@typescript-eslint/eslint-plugin'")
    lines.push("import tsParser from '@typescript-eslint/parser'")
  }

  if (options.absolutePath) {
    lines.push("import importPlugin from 'eslint-plugin-import'")
  }

  return lines
}
