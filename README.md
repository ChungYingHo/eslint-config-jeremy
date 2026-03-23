# frontend-eslint-config

[![npm version](https://img.shields.io/npm/v/frontend-eslint-config)](https://www.npmjs.com/package/frontend-eslint-config)
[![node](https://img.shields.io/node/v/frontend-eslint-config)](https://nodejs.org)
[![license](https://img.shields.io/npm/l/frontend-eslint-config)](./LICENSE)

適用於 Astro / Vue 專案的 ESLint 9+ 共用設定，附互動式 CLI 一鍵初始化。

Shareable ESLint 9+ flat config for Astro / Vue projects with an interactive CLI.

- 自動偵測 TypeScript、Package Manager
- 單選框架 plugin（Vue / Astro）避免 parser 衝突
- 可選強制絕對路徑 import
- 自動寫入 `.vscode/settings.json` 存檔自動 fix

---

## 需求 Requirements

- Node.js ≥ 18
- ESLint ^9.0.0

---

## 安裝 Installation

```bash
npm install -D frontend-eslint-config
```

安裝完成後執行初始化：

```bash
npx frontend-eslint-config init
```

---

## 初始化流程 Init

CLI 會依序進行：

1. 偵測 Node.js 版本、Package Manager、是否已有 ESLint config
2. 自動偵測 `package.json` 中是否安裝 TypeScript
3. 詢問框架 plugin（單選）：Vue / Astro / 不使用
4. 詢問是否強制絕對路徑 import
5. 詢問是否設定存檔自動 fix（寫入 `.vscode/settings.json`）
6. 詢問 config 副檔名（`.js` / `.mjs`）
7. 產生 `eslint.config.js`，並自動安裝所需 peer dependencies

---

## 產出範例 Example Output

<details>
<summary>Astro + TypeScript + 絕對路徑</summary>

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
      indent: ['error', 2, { SwitchCase: 1 }],
      'eol-last': ['error', 'always'],
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-useless-return': 'warn',
      'no-else-return': 'warn',
      'no-unexpected-multiline': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-restricted-imports': ['error', { patterns: ['../*', './*'] }],
      'import/no-relative-parent-imports': 'error',
      'import/no-relative-packages': 'error',
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

</details>

<details>
<summary>Vue + TypeScript</summary>

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
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'never'],
      indent: ['error', 2, { SwitchCase: 1 }],
      'eol-last': ['error', 'always'],
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-useless-return': 'warn',
      'no-else-return': 'warn',
      'no-unexpected-multiline': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'vue/html-quotes': ['error', 'single', { avoidEscape: true }],
      'vue/html-indent': ['error', 2],
      'vue/attributes-order': ['error', { alphabetical: true }],
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-components': 'warn',
      'no-undef': 'off',
    },
  },
]
```

</details>

---

## 絕對路徑設定 Absolute Path Setup

啟用絕對路徑後，需在專案中設定路徑別名：

**TypeScript — `tsconfig.json`**

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

**JavaScript — `jsconfig.json`**

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

## 規則說明 Rules

完整規則定義與說明見 [Rules.md](./Rules.md)。

---

## License

MIT
