import path from 'node:path'
import { fileExists, readJsonFile } from '../utils/fs.js'
import type { PackageManager } from '../utils/package-manager.js'

export interface EnvironmentInfo {
  nodeVersionOk: boolean
  packageManager: PackageManager
  hasExistingEslintConfig: boolean
  hasTypescript: boolean
}

const LOCK_FILE_MAP: Record<string, PackageManager> = {
  'package-lock.json': 'npm',
  'yarn.lock': 'yarn',
  'pnpm-lock.yaml': 'pnpm',
  'bun.lockb': 'bun',
}

const ESLINT_FLAT_CONFIG_FILES = [
  'eslint.config.js',
  'eslint.config.mjs',
  'eslint.config.cjs',
  'eslint.config.ts',
  'eslint.config.mts',
  'eslint.config.cts',
]

const ESLINT_LEGACY_CONFIG_FILES = [
  '.eslintrc',
  '.eslintrc.js',
  '.eslintrc.cjs',
  '.eslintrc.json',
  '.eslintrc.yml',
  '.eslintrc.yaml',
]

const ESLINT_CONFIG_FILES = [
  ...ESLINT_FLAT_CONFIG_FILES,
  ...ESLINT_LEGACY_CONFIG_FILES,
]

export function detectPackageManager(cwd: string): PackageManager {
  for (const [file, pm] of Object.entries(LOCK_FILE_MAP)) {
    if (fileExists(path.join(cwd, file))) {
      return pm
    }
  }
  return 'npm'
}

export function detectExistingEslintConfig(cwd: string): boolean {
  return ESLINT_CONFIG_FILES.some(file => fileExists(path.join(cwd, file)))
}

export function findExistingEslintConfigs(cwd: string): string[] {
  return ESLINT_CONFIG_FILES.filter(file => fileExists(path.join(cwd, file)))
}

export function detectTypescript(cwd: string): boolean {
  const pkgJson = readJsonFile(path.join(cwd, 'package.json'))
  if (!pkgJson) return false

  const devDeps = (pkgJson.devDependencies ?? {}) as Record<string, string>
  const deps = (pkgJson.dependencies ?? {}) as Record<string, string>

  return 'typescript' in devDeps || 'typescript' in deps
}

export function checkNodeVersion(): boolean {
  const major = parseInt(process.versions.node.split('.')[0], 10)
  return major >= 18
}

export function detectEnvironment(cwd: string): EnvironmentInfo {
  return {
    nodeVersionOk: checkNodeVersion(),
    packageManager: detectPackageManager(cwd),
    hasExistingEslintConfig: detectExistingEslintConfig(cwd),
    hasTypescript: detectTypescript(cwd),
  }
}
