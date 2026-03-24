import { describe, it, expect, vi, beforeEach } from 'vitest'
import { detectPackageManager, detectExistingEslintConfig, findExistingEslintConfigs, detectTypescript, checkNodeVersion } from '../src/cli/detect.js'
import * as fsUtils from '../src/utils/fs.js'

vi.mock('../src/utils/fs.js')

const mockFileExists = vi.mocked(fsUtils.fileExists)
const mockReadJsonFile = vi.mocked(fsUtils.readJsonFile)

beforeEach(() => {
  vi.clearAllMocks()
})

describe('detectPackageManager', () => {
  it('detects npm from package-lock.json', () => {
    mockFileExists.mockImplementation(p => p.endsWith('package-lock.json'))
    expect(detectPackageManager('/project')).toBe('npm')
  })

  it('detects yarn from yarn.lock', () => {
    mockFileExists.mockImplementation(p => p.endsWith('yarn.lock'))
    expect(detectPackageManager('/project')).toBe('yarn')
  })

  it('detects pnpm from pnpm-lock.yaml', () => {
    mockFileExists.mockImplementation(p => p.endsWith('pnpm-lock.yaml'))
    expect(detectPackageManager('/project')).toBe('pnpm')
  })

  it('detects bun from bun.lockb', () => {
    mockFileExists.mockImplementation(p => p.endsWith('bun.lockb'))
    expect(detectPackageManager('/project')).toBe('bun')
  })

  it('falls back to npm when no lock file found', () => {
    mockFileExists.mockReturnValue(false)
    expect(detectPackageManager('/project')).toBe('npm')
  })
})

describe('detectExistingEslintConfig', () => {
  it('returns true when eslint.config.js exists', () => {
    mockFileExists.mockImplementation(p => p.endsWith('eslint.config.js'))
    expect(detectExistingEslintConfig('/project')).toBe(true)
  })

  it('returns true when .eslintrc exists', () => {
    mockFileExists.mockImplementation(p => p.endsWith('.eslintrc'))
    expect(detectExistingEslintConfig('/project')).toBe(true)
  })

  it('returns true when eslint.config.ts exists (create-vue)', () => {
    mockFileExists.mockImplementation(p => p.endsWith('eslint.config.ts'))
    expect(detectExistingEslintConfig('/project')).toBe(true)
  })

  it('returns false when no config found', () => {
    mockFileExists.mockReturnValue(false)
    expect(detectExistingEslintConfig('/project')).toBe(false)
  })
})

describe('findExistingEslintConfigs', () => {
  it('returns all existing config files', () => {
    mockFileExists.mockImplementation(p =>
      p.endsWith('eslint.config.ts') || p.endsWith('eslint.config.js'),
    )
    const configs = findExistingEslintConfigs('/project')
    expect(configs).toContain('eslint.config.ts')
    expect(configs).toContain('eslint.config.js')
    expect(configs).toHaveLength(2)
  })

  it('returns empty array when no configs found', () => {
    mockFileExists.mockReturnValue(false)
    expect(findExistingEslintConfigs('/project')).toEqual([])
  })
})

describe('detectTypescript', () => {
  it('returns true when typescript is in devDependencies', () => {
    mockReadJsonFile.mockReturnValue({ devDependencies: { typescript: '^5.0.0' } })
    expect(detectTypescript('/project')).toBe(true)
  })

  it('returns true when typescript is in dependencies', () => {
    mockReadJsonFile.mockReturnValue({ dependencies: { typescript: '^5.0.0' } })
    expect(detectTypescript('/project')).toBe(true)
  })

  it('returns false when typescript is not installed', () => {
    mockReadJsonFile.mockReturnValue({ devDependencies: { vue: '^3.0.0' } })
    expect(detectTypescript('/project')).toBe(false)
  })

  it('returns false when package.json cannot be read', () => {
    mockReadJsonFile.mockReturnValue(null)
    expect(detectTypescript('/project')).toBe(false)
  })
})

describe('checkNodeVersion', () => {
  it('returns true for Node 18+', () => {
    expect(checkNodeVersion()).toBe(true)
  })
})
