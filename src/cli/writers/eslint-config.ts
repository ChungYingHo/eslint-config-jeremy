import fs from 'node:fs'
import path from 'node:path'
import { writeFile } from '../../utils/fs.js'
import { buildConfigSource } from '../../templates/config-builder.js'
import { findExistingEslintConfigs } from '../detect.js'
import type { ConfigOptions } from '../../templates/types.js'

export function writeEslintConfig(cwd: string, options: ConfigOptions): string {
  const filename = `eslint.config.${options.fileExtension}`

  // Remove all existing eslint configs to avoid conflicts
  const existing = findExistingEslintConfigs(cwd)
  for (const file of existing) {
    if (file !== filename) {
      fs.unlinkSync(path.join(cwd, file))
    }
  }

  const filePath = path.join(cwd, filename)
  const content = buildConfigSource(options)
  writeFile(filePath, content)
  return filename
}
