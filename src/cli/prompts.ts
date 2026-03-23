import * as p from '@clack/prompts'

export async function confirmOverwrite(): Promise<boolean> {
  const result = await p.confirm({
    message: '偵測到已有 ESLint 設定檔，覆蓋後將失去原有自定義設定。是否繼續？',
  })
  if (p.isCancel(result)) {
    p.cancel('已取消')
    process.exit(0)
  }
  return result
}

export async function selectFrameworks(): Promise<Array<'vue' | 'astro'>> {
  const result = await p.multiselect({
    message: '選擇框架 ESLint plugin（可複選，空白送出為不使用）',
    options: [
      { value: 'vue' as const, label: 'Vue (eslint-plugin-vue)' },
      { value: 'astro' as const, label: 'Astro (eslint-plugin-astro)' },
    ],
    required: false,
  })
  if (p.isCancel(result)) {
    p.cancel('已取消')
    process.exit(0)
  }
  return result as Array<'vue' | 'astro'>
}

export async function confirmAbsolutePath(): Promise<boolean> {
  const result = await p.confirm({
    message: '是否強制使用絕對路徑 import？',
  })
  if (p.isCancel(result)) {
    p.cancel('已取消')
    process.exit(0)
  }
  return result
}

export async function confirmSaveOnFix(): Promise<boolean> {
  const result = await p.confirm({
    message: '是否設定存檔時自動 ESLint fix？（寫入 .vscode/settings.json）',
  })
  if (p.isCancel(result)) {
    p.cancel('已取消')
    process.exit(0)
  }
  return result
}

export async function selectFileExtension(): Promise<'js' | 'mjs'> {
  const result = await p.select({
    message: '選擇 eslint config 檔案格式',
    options: [
      { value: 'js' as const, label: 'eslint.config.js（預設）' },
      { value: 'mjs' as const, label: 'eslint.config.mjs' },
    ],
  })
  if (p.isCancel(result)) {
    p.cancel('已取消')
    process.exit(0)
  }
  return result
}
