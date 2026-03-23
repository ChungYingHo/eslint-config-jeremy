# Rules 說明

此文件列出 frontend-eslint-config 所使用的預設規則、TypeScript 規則、Vue 規則，以及絕對路徑規則，並說明每條規則的用途。

---

## 預設 Rules（所有專案共用）

### 排版風格

| Rule | 設定 | 說明 |
|------|------|------|
| `quotes` | `['error', 'single', { avoidEscape: true }]` | 強制使用單引號。若字串內含單引號則允許用雙引號避免跳脫 |
| `semi` | `['error', 'never']` | 禁止行尾分號 |
| `indent` | `['error', 2, { SwitchCase: 1 }]` | 統一 2 格縮排，switch-case 內縮 1 層 |
| `eol-last` | `['error', 'always']` | 檔案結尾必須有空行 |
| `no-multiple-empty-lines` | `['error', { max: 1, maxEOF: 1 }]` | 最多允許連續 1 行空行，檔案末尾最多 1 行空行 |

### 程式碼品質

| Rule | 設定 | 說明 |
|------|------|------|
| `eqeqeq` | `['error', 'always']` | 強制使用 `===` 與 `!==`，禁止 `==` / `!=`，避免隱式型別轉換造成的 bug |
| `no-var` | `'error'` | 禁止使用 `var`，強制使用 `let` 或 `const` |
| `prefer-const` | `'error'` | 若變數不會被重新賦值，強制使用 `const` |
| `no-useless-return` | `'warn'` | 警告無意義的 return（例如函式尾端多餘的 `return`） |
| `no-else-return` | `'warn'` | 當 if 區塊已有 return，提示不需要 else 區塊，鼓勵 early return |
| `no-unexpected-multiline` | `'error'` | 防止因缺少分號導致的多行語句被意外合併（搭配 no-semi 風格的安全網） |

### 其他

| Rule | 設定 | 說明 |
|------|------|------|
| `no-console` | `['warn', { allow: ['warn', 'error'] }]` | 警告使用 `console.log`，但允許 `console.warn` 與 `console.error`。避免正式環境殘留 debug log |

---

## TypeScript Rules

當偵測到專案已安裝 `typescript` 時自動啟用。需安裝 `@typescript-eslint/eslint-plugin` 與 `@typescript-eslint/parser`。

| Rule | 設定 | 說明 |
|------|------|------|
| `@typescript-eslint/no-unused-vars` | `['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }]` | 警告未使用的變數。以 `_` 開頭的參數或變數視為刻意忽略，不會觸發警告 |
| `@typescript-eslint/consistent-type-imports` | `['error', { prefer: 'type-imports', disallowTypeAnnotations: false, fixStyle: 'inline-type-imports' }]` | 強制使用 `import { type Foo }` 的 inline 寫法引入型別，讓 bundler 能正確 tree-shake 掉純型別 import |
| `@typescript-eslint/no-explicit-any` | `'warn'` | 警告使用 `any` 型別，鼓勵明確定義型別以維持型別安全 |

---

## Vue Rules

選裝 `eslint-plugin-vue` 後啟用。會搭配 `vue-eslint-parser` 解析 `.vue` 檔案。

| Rule | 設定 | 說明 |
|------|------|------|
| `vue/html-quotes` | `['error', 'single', { avoidEscape: true }]` | template 中屬性值強制使用單引號，與 JS 引號風格一致 |
| `vue/html-indent` | `['error', 2]` | template 區塊統一 2 格縮排 |
| `vue/attributes-order` | `['error', { alphabetical: true }]` | 元件屬性依字母排序，提升可讀性與 diff 一致性 |
| `vue/multi-word-component-names` | `'off'` | 關閉強制多詞元件名稱（例如允許 `<Header>` 而非強制 `<AppHeader>`） |
| `vue/no-unused-components` | `'warn'` | 警告已引入但未在 template 中使用的元件 |
| `no-undef` | `'off'` | 關閉未定義變數檢查。Vue 3 搭配 auto-import（unplugin-auto-import）時，全域 API 如 `ref`、`computed` 不需手動 import，此規則會誤報 |

---

## 絕對路徑 Rules（選用）

使用者選擇強制絕對路徑時啟用。需安裝 `eslint-plugin-import`，若有 TS 則額外安裝 `eslint-import-resolver-typescript`。

| Rule | 設定 | 說明 |
|------|------|------|
| `no-restricted-imports` | `['error', { patterns: ['../*', './*'] }]` | 禁止所有相對路徑 import，從 ESLint 原生層級攔截 |
| `import/no-relative-parent-imports` | `'error'` | 禁止 `../` 形式的父層相對路徑 import |
| `import/no-relative-packages` | `'error'` | 禁止跨 package 的相對路徑 import（monorepo 情境適用） |

> 啟用絕對路徑時，專案需設定路徑別名。有 TS 的專案在 `tsconfig.json` 中設定 `baseUrl` + `paths`；純 JS 專案則需建立 `jsconfig.json` 做對應設定。
