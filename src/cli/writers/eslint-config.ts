import path from 'node:path'
import { writeFile } from '../../utils/fs.js'
import { buildConfigSource } from '../../templates/config-builder.js'
import type { ConfigOptions } from '../../templates/types.js'

export function writeEslintConfig(cwd: string, options: ConfigOptions): string {
  const filename = `eslint.config.${options.fileExtension}`
  const filePath = path.join(cwd, filename)
  const content = buildConfigSource(options)
  writeFile(filePath, content)
  return filename
}
