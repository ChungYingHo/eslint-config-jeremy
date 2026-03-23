import { describe, it, expect, vi, beforeEach } from 'vitest'
import { writeVscodeSettings } from '../src/cli/writers/vscode-settings.js'
import * as fsUtils from '../src/utils/fs.js'
import type { ConfigOptions } from '../src/templates/types.js'

vi.mock('../src/utils/fs.js')

const mockFileExists = vi.mocked(fsUtils.fileExists)
const mockReadJsonFile = vi.mocked(fsUtils.readJsonFile)
const mockWriteFile = vi.mocked(fsUtils.writeFile)

beforeEach(() => {
  vi.clearAllMocks()
  mockWriteFile.mockImplementation(() => {})
})

describe('writeVscodeSettings', () => {
  const baseOptions: ConfigOptions = {
    typescript: false,
    framework: 'none',
    absolutePath: false,
    fileExtension: 'js',
  }

  it('creates new settings.json when none exists', () => {
    mockFileExists.mockReturnValue(false)

    writeVscodeSettings('/project', baseOptions)

    const written = JSON.parse(mockWriteFile.mock.calls[0][1])
    expect(written['editor.codeActionsOnSave']).toEqual({ 'source.fixAll.eslint': 'explicit' })
    expect(written['eslint.validate']).toContain('javascript')
    expect(written['eslint.validate']).not.toContain('typescript')
    expect(written['eslint.validate']).not.toContain('vue')
  })

  it('includes typescript languages when TS is enabled', () => {
    mockFileExists.mockReturnValue(false)

    writeVscodeSettings('/project', { ...baseOptions, typescript: true })

    const written = JSON.parse(mockWriteFile.mock.calls[0][1])
    expect(written['eslint.validate']).toContain('typescript')
    expect(written['eslint.validate']).toContain('typescriptreact')
  })

  it('includes vue when framework is vue', () => {
    mockFileExists.mockReturnValue(false)

    writeVscodeSettings('/project', { ...baseOptions, framework: 'vue' })

    const written = JSON.parse(mockWriteFile.mock.calls[0][1])
    expect(written['eslint.validate']).toContain('vue')
    expect(written['eslint.validate']).not.toContain('astro')
  })

  it('includes astro when framework is astro', () => {
    mockFileExists.mockReturnValue(false)

    writeVscodeSettings('/project', { ...baseOptions, framework: 'astro' })

    const written = JSON.parse(mockWriteFile.mock.calls[0][1])
    expect(written['eslint.validate']).toContain('astro')
    expect(written['eslint.validate']).not.toContain('vue')
  })

  it('merges with existing settings.json', () => {
    mockFileExists.mockReturnValue(true)
    mockReadJsonFile.mockReturnValue({ 'editor.fontSize': 14 })

    writeVscodeSettings('/project', baseOptions)

    const written = JSON.parse(mockWriteFile.mock.calls[0][1])
    expect(written['editor.fontSize']).toBe(14)
    expect(written['editor.codeActionsOnSave']).toBeDefined()
  })
})
