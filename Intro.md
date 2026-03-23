## 主要功能
安裝此套件希望讓使用者達到快速建置 eslint rules，分為「安裝」與「初始化」兩階段。

### 安裝
```
npm install -D frontend-eslint-config
```
套件將透過 peerDependencies 指定相容的版本區間，確保各 plugin 之間版本不衝突：
- `eslint` ^9.x
- `@typescript-eslint/eslint-plugin` ^8.x
- `@typescript-eslint/parser` ^8.x
- `eslint-plugin-vue` ^10.x
- `eslint-plugin-astro` ^2.x
- `eslint-plugin-import` ^2.x
- `eslint-import-resolver-typescript` ^4.x

> 以上版本區間為初版預估值，實際開發時需驗證各 plugin 之間的相容性後確定。

安裝完成後透過 postinstall 印出提示：
```
✔ frontend-eslint-config installed
→ Run "npx frontend-eslint-config init" to set up your config
```

### 初始化流程
執行 `npx frontend-eslint-config init` 後依序進行：

1. 偵測專案環境
    - 檢查 Node.js 版本（ESLint 9+ 需要 Node 18+）
    - 自動偵測 Package Manager：檢查專案目錄下的 lock 檔（package-lock.json → npm、yarn.lock → yarn、pnpm-lock.yaml → pnpm、bun.lockb → bun），後續所有安裝指令皆使用對應的 package manager 執行
    - 檢查專案是否已有 eslint config 檔案（eslint.config.js / .eslintrc.*），若有則警告使用者覆蓋後將失去原有自定義設定，確認後才繼續
2. 根據使用者選項組合產生 eslint.config.js（default 為 .js，可支援使用者選擇 .mjs 格式）
    - 採用模板區塊拼接策略：套件內預先準備好各功能的 boilerplate 區塊（base rules、TS 區塊、Vue 區塊、Astro 區塊、絕對路徑區塊），根據使用者在後續步驟的選擇動態組合產出最終檔案
    - 此步驟在所有問答結束後才實際寫入檔案
3. 自動偵測 TS
    - 讀取 package.json 的 devDependencies，若已安裝 typescript 則自動帶入 TS 相關 eslint 套件（@typescript-eslint/eslint-plugin、@typescript-eslint/parser）並設定對應 rules
    - 若未安裝 typescript 則跳過，維持純 JS 設定
4. 詢問使用者是否選裝框架 eslint plugin，並寫入 recommended 設定（可複選）
    - vue eslint
    - astro eslint
    - 不選（空白送出）
    > Vue 與 Astro 可同時選取。兩者各自針對不同副檔名（`.vue` vs `.astro`），在 ESLint 9 flat config 架構下每個 config object 擁有獨立的 `files` glob 與 `languageOptions.parser`，不會產生 parser 衝突。此設計支援 Astro islands 中使用 Vue 元件的專案。
5. 詢問使用者是否強制使用絕對路徑
    - Y: 寫入禁止相對路徑的規則 & 安裝 eslint-plugin-import。若步驟 3 偵測到有 TS，額外安裝 eslint-import-resolver-typescript 並檢查 tsconfig.json 是否存在做相關設定。純 JS 則檢查是否需要建立 jsconfig.json
    - N: 維持預設 eslint.config.js
6. 詢問使用者是否設定 save 就 lint -fix
    - Y: 檢查專案根目錄是否有 `.vscode/settings.json`，若有則將設定補入，若無則建立。寫入內容如下：
      ```json
      {
        "editor.codeActionsOnSave": {
          "source.fixAll.eslint": "explicit"
        },
        "eslint.validate": [
          "javascript",
          "javascriptreact",
          "typescript",
          "typescriptreact",
          "vue",
          "astro"
        ]
      }
      ```
      > `eslint.validate` 的值會根據前面步驟的選擇動態調整，僅加入實際選用的語言（例如未選 Vue 則不加入 "vue"）。
    - N: 跳過，但仍印出提示推薦安裝 VS Code ESLint extension

## 範例
以一個 astro 專案來說，以下為一個預設 rules + TS + 絕對路經 + astro eslint 的 eslint.config.js。  
(因為此為真實 astro 專案設定，故含部分非 eslint 內容)

```
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
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      'no-restricted-imports': [
        'error',
        {
          patterns: ['../*', './*'],
        },
      ],

      'import/no-relative-parent-imports': 'error',
      'import/no-relative-packages': 'error',

      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
          fixStyle: 'inline-type-imports',
        },
      ],
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

另外一個以 vue 為主軸的如下：
```
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
        extraFileExtensions: ['.vue']
      }
    }
  },

  {
    rules: {
      // --- 排版與引號 ---
      'semi': ['error', 'never'],
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'vue/html-quotes': ['error', 'single', { avoidEscape: true }],
      'brace-style': ['error', '1tbs', { allowSingleLine: false }],
      'indent': ['error', 2, { SwitchCase: 1 }],
      'vue/html-indent': ['error', 2],

      // --- Vue 與 TypeScript 檢查 ---
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'warn',
      'vue/attributes-order': ['error', { alphabetical: true }],
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-components': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn'
      'no-undef': 'off',
    }
  }
]
```

## tsconfig.json
以下提供有 TS 又需要絕對路徑的話會需要設定 tsconfig.json。  
(因為此為真實 astro 專案設定，故含部分非 eslint 內容)

```
{
  "extends": "astro/tsconfigs/strict",
  "include": [
    ".astro/types.d.ts",
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.astro",
    "src/**/*.svelte"
  ],
  "exclude": ["dist"],
  "compilerOptions": {
    "types": ["node"],
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```
