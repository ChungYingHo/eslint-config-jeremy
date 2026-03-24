import { describe, it, expect } from 'vitest'
import { buildInstallCommand } from '../src/utils/package-manager.js'

describe('buildInstallCommand', () => {
  const packages = ['eslint-plugin-vue', 'vue-eslint-parser']

  it('npm — uses install -D', () => {
    expect(buildInstallCommand('npm', packages)).toBe('npm install -D eslint-plugin-vue vue-eslint-parser')
  })

  it('yarn — uses add -D', () => {
    expect(buildInstallCommand('yarn', packages)).toBe('yarn add -D eslint-plugin-vue vue-eslint-parser')
  })

  it('pnpm — uses add -D', () => {
    expect(buildInstallCommand('pnpm', packages)).toBe('pnpm add -D eslint-plugin-vue vue-eslint-parser')
  })

  it('bun — uses add -D', () => {
    expect(buildInstallCommand('bun', packages)).toBe('bun add -D eslint-plugin-vue vue-eslint-parser')
  })

  it('single package', () => {
    expect(buildInstallCommand('npm', ['eslint-plugin-astro'])).toBe('npm install -D eslint-plugin-astro')
  })
})
