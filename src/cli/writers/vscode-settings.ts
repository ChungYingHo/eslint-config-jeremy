import path from 'node:path'
import { fileExists, readJsonFile, writeFile } from '../../utils/fs.js'
import type { ConfigOptions } from '../../templates/types.js'

function buildEslintValidate(options: ConfigOptions): string[] {
  const languages = ['javascript', 'javascriptreact']

  if (options.typescript) {
    languages.push('typescript', 'typescriptreact')
  }

  if (options.frameworks.includes('vue')) {
    languages.push('vue')
  }

  if (options.frameworks.includes('astro')) {
    languages.push('astro')
  }

  return languages
}

export function writeVscodeSettings(cwd: string, options: ConfigOptions): void {
  const settingsPath = path.join(cwd, '.vscode', 'settings.json')

  let existing: Record<string, unknown> = {}
  if (fileExists(settingsPath)) {
    existing = readJsonFile(settingsPath) ?? {}
  }

  const existingCodeActions = (existing['editor.codeActionsOnSave'] as Record<string, unknown>) ?? {}
  const merged = {
    ...existing,
    'editor.codeActionsOnSave': {
      ...existingCodeActions,
      'source.fixAll.eslint': 'explicit',
    },
    'eslint.validate': buildEslintValidate(options),
  }

  writeFile(settingsPath, JSON.stringify(merged, null, 2) + '\n')
}
