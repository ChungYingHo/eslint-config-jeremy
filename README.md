# frontend-eslint-config

> 適用於 Astro / Vue 專案的 ESLint 9+ 共用設定，附互動式 CLI 一鍵初始化。
> Shareable ESLint 9+ flat config for Astro / Vue projects, with an interactive CLI for one-command setup.

---

## 安裝 / Installation

```bash
npm install -D frontend-eslint-config
```

安裝完成後終端機會印出提示：

```
✔ frontend-eslint-config installed
→ Run "npx frontend-eslint-config init" to set up your config
```

---

## 初始化 / Init

```bash
npx frontend-eslint-config init
```

CLI 會依序詢問：

1. **框架 plugin**（單選）：Vue / Astro / 不使用
2. **絕對路徑 import**：是否禁止相對路徑，自動安裝 `eslint-plugin-import`
3. **存檔自動 fix**：是否寫入 `.vscode/settings.json`
4. **Config 副檔名**：`eslint.config.js`（預設）或 `.mjs`

CLI will prompt you for:

1. **Framework plugin** (single select): Vue / Astro / None
2. **Absolute path imports**: ban relative imports, auto-installs `eslint-plugin-import`
3. **Save-on-fix**: write `.vscode/settings.json` automatically
4. **Config file extension**: `eslint.config.js` (default) or `.mjs`

完成後自動安裝所需 peer dependencies，並產生 `eslint.config.js`。
Required peer dependencies are installed automatically after answering all prompts.

---

## 需求 / Requirements

| 項目 | 版本 |
|------|------|
| Node.js | ≥ 18 |
| ESLint | ^9.0.0 |

---

## Peer Dependencies

視選項自動安裝，皆為 optional：

| 套件 | 用途 |
|------|------|
| `@typescript-eslint/eslint-plugin` `@typescript-eslint/parser` | 偵測到 TypeScript 時自動啟用 |
| `eslint-plugin-vue` `vue-eslint-parser` `typescript-eslint` | 選擇 Vue 框架時 |
| `eslint-plugin-astro` | 選擇 Astro 框架時 |
| `eslint-plugin-import` | 啟用絕對路徑規則時 |
| `eslint-import-resolver-typescript` | 啟用絕對路徑 + TypeScript 時 |

---

## 預設規則 / Default Rules

### 排版風格 / Style

| Rule | 設定 |
|------|------|
| `quotes` | `single` |
| `semi` | `never` |
| `indent` | `2` spaces |
| `eol-last` | `always` |
| `no-multiple-empty-lines` | max `1` |

### 程式品質 / Quality

| Rule | 設定 |
|------|------|
| `eqeqeq` | `always` |
| `no-var` | `error` |
| `prefer-const` | `error` |
| `no-useless-return` | `warn` |
| `no-else-return` | `warn` |
| `no-console` | `warn`（允許 `warn` / `error`） |

TypeScript、Vue、Astro、絕對路徑的完整規則說明見 [Rules.md](./Rules.md)。
Full rule details for TypeScript, Vue, Astro, and absolute-path enforcement: [Rules.md](./Rules.md).

---

## 絕對路徑設定 / Absolute Path Setup

啟用後需在專案設定路徑別名。
After enabling, configure path aliases in your project.

**TypeScript (`tsconfig.json`)**

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

**JavaScript (`jsconfig.json`)**

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

---

## 範例輸出 / Example Output

**Astro + TypeScript + 絕對路徑**

```js
import astro from 'eslint-plugin-astro'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'

export default [
  ...astro.configs.recommended,

  {
    files: ['**/*.{js,ts,tsx,mts,cts}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tseslint,
      import: importPlugin,
    },
    rules: {
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'never'],
      // ...（完整規則見產出的 eslint.config.js）
    },
  },

  {
    files: ['**/*.astro'],
    rules: {
      'no-console': 'off',
    },
  },
]
```

**Vue + TypeScript**

```js
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintPluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginVue.configs['flat/recommended'],

  {
    files: ['*.vue', '**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
    },
  },

  {
    rules: {
      // base + TS + Vue rules...
    },
  },
]
```

---

## License

MIT
