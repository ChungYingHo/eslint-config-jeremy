import { execSync } from 'node:child_process'
import path from 'node:path'
import * as p from '@clack/prompts'
import { detectEnvironment } from './detect.js'
import {
  confirmOverwrite,
  selectFrameworks,
  confirmAbsolutePath,
  confirmSaveOnFix,
  selectFileExtension,
} from './prompts.js'
import { writeEslintConfig } from './writers/eslint-config.js'
import { writeVscodeSettings } from './writers/vscode-settings.js'
import { buildInstallCommand } from '../utils/package-manager.js'
import { fileExists } from '../utils/fs.js'
import { logger } from '../utils/logger.js'
import type { ConfigOptions } from '../templates/types.js'

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

export async function init(): Promise<void> {
  const cwd = process.cwd()

  p.intro('eslint-config-jeremy init')

  // 1. Detect environment
  const env = detectEnvironment(cwd)

  if (!env.nodeVersionOk) {
    logger.error('ESLint 9+ 需要 Node.js 18 以上版本')
    process.exit(1)
  }

  logger.info(`偵測到 package manager: ${env.packageManager}`)

  if (env.hasTypescript) {
    logger.info('偵測到 TypeScript，將自動加入 TS 相關設定')
  }

  // 2. Check existing config
  if (env.hasExistingEslintConfig) {
    const proceed = await confirmOverwrite()
    if (!proceed) {
      p.cancel('已取消')
      process.exit(0)
    }
  }

  // 3. Prompts
  const frameworks = await selectFrameworks()
  const absolutePath = await confirmAbsolutePath()
  const saveOnFix = await confirmSaveOnFix()
  const fileExtension = await selectFileExtension()

  const options: ConfigOptions = {
    typescript: env.hasTypescript,
    frameworks,
    absolutePath,
    fileExtension,
  }

  // Check tsconfig/jsconfig when absolutePath is enabled
  if (absolutePath) {
    if (env.hasTypescript) {
      if (!fileExists(path.join(cwd, 'tsconfig.json'))) {
        logger.warn('需要在 tsconfig.json 設定 baseUrl + paths')
      }
    } else {
      if (!fileExists(path.join(cwd, 'jsconfig.json'))) {
        logger.warn('需要建立 jsconfig.json 設定 baseUrl + paths')
      }
    }
  }

  // 4. Write eslint config
  const filename = writeEslintConfig(cwd, options)
  logger.success(`已產生 ${filename}`)

  // 5. Write vscode settings
  if (saveOnFix) {
    writeVscodeSettings(cwd, options)
    logger.success('已更新 .vscode/settings.json')
  } else {
    logger.info('建議安裝 VS Code ESLint extension 以獲得最佳開發體驗')
  }

  // 6. Install dependencies
  const deps = collectDependencies(options)
  if (deps.length > 0) {
    const cmd = buildInstallCommand(env.packageManager, deps)
    logger.info(`安裝依賴: ${cmd}`)
    try {
      execSync(cmd, { cwd, stdio: 'inherit' })
      logger.success('依賴安裝完成')
    } catch {
      logger.error(`依賴安裝失敗，請手動執行: ${cmd}`)
    }
  }

  p.outro('設定完成！')
}
