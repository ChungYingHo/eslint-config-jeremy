# 審查待修項目

此文件記錄 code review 發現的 bug 及待執行修正步驟，供後續對話直接實作。

---

## CRITICAL — 產出的 config 會在 ESLint runtime 報錯

### Bug 1：Vue 路徑缺少 `import` plugin 註冊

- **檔案**：`src/templates/blocks/vue-block.ts` → `buildVueRulesBlock()`
- **問題**：absolutePath 啟用時，`importPlugin` 有 import 但未在 `plugins: {}` 中註冊。ESLint 9 flat config 要求 plugin rules 必須先註冊 plugin
- **影響**：所有 Vue + absolutePath 組合（4 個 snapshot）→ runtime 報 `Definition for rule 'import/no-relative-parent-imports' was not found`
- **修法**：`buildVueRulesBlock(options)` 中，當 `options.absolutePath` 為 true 時，在 rules 前加入 `plugins: { import: importPlugin }`；當 `options.absolutePath && options.typescript` 時，再加入 `settings: { 'import/resolver': { typescript: {} } }`

### Bug 2：缺少 `eslint-import-resolver-typescript` 的 `settings` 區塊

- **檔案**：`src/templates/blocks/base-block.ts` + `vue-block.ts`
- **問題**：TS + absolutePath 時，`eslint-plugin-import` 需要 `settings` 區塊才能正確解析 TS path aliases：
  ```js
  settings: {
    'import/resolver': {
      typescript: {}
    }
  }
  ```
- **影響**：所有 TS + absolutePath 組合（8 個 snapshot）→ `import/*` rules 無法解析 `@/*` 等 alias
- **修法**：`buildMainBlock(options)` 中，當 `options.absolutePath && options.typescript` 時，在 rules 前加入 `settings` 區塊

---

## MEDIUM — 規則 / 文件不一致

### Bug 3：Intro.md Vue 範例語法錯誤（L185）

- `'@typescript-eslint/no-explicit-any': 'warn'` 後缺逗號 → 不合法 JS
- **修法**：補逗號

### Bug 4：新增 `brace-style` 至正式規則

- Intro.md 範例有 `brace-style: ['error', '1tbs', { allowSingleLine: false }]`，但 Rules.md 和 `src/rules/base.ts` 均無
- **經 Jeremy 確認保留此規則**
- **修法**：
  - `src/rules/base.ts`：加入 `'brace-style': ['error', '1tbs', { allowSingleLine: false }]`
  - `Rules.md` 排版風格表格：加入 `brace-style` 說明（強制 1TBS 大括號風格，`{` 不換行，禁止單行寫法）

### Bug 5：Intro.md Vue 範例與實作不一致

以下以 Rules.md / 實作為 source of truth，Intro.md 範例對齊：
- L172：`maxEOF: 0` → `maxEOF: 1`
- L181：`'no-console': 'warn'` → `['warn', { allow: ['warn', 'error'] }]`

---

## LOW — 功能缺漏

### Bug 6：init.ts 未檢查 tsconfig.json / jsconfig.json

- Intro.md L44 spec 要求：absolutePath 時檢查這些檔案是否存在並提示
- **修法**：`src/cli/init.ts` 中 absolutePath 選擇後加檢查：
  - TS → 檢查 `tsconfig.json`，不存在則 `logger.warn('需要在 tsconfig.json 設定 baseUrl + paths')`
  - 非 TS → 檢查 `jsconfig.json`，不存在則 `logger.warn('需要建立 jsconfig.json 設定 baseUrl + paths')`

---

## 修正後驗證

1. `npm run build` — 無 type error
2. `npx vitest run -u` — 更新 snapshot，35+ tests 全過
3. 手動確認 snapshot：TS + absolutePath 有 `settings` 區塊、Vue + absolutePath 有 `plugins` 區塊
4. 所有 16 個 snapshot 因 `brace-style` 加入 base rules 而更新

## 受影響的檔案

| 檔案 | 修改 |
|------|------|
| `src/templates/blocks/vue-block.ts` | `buildVueRulesBlock` 加 plugins + settings |
| `src/templates/blocks/base-block.ts` | `buildMainBlock` 加 settings |
| `src/rules/base.ts` | 加入 `brace-style` 規則 |
| `Rules.md` | 排版風格表格加入 `brace-style` |
| `Intro.md` | 修正 Vue 範例（語法 + 規則對齊） |
| `src/cli/init.ts` | absolutePath 加 tsconfig/jsconfig 檢查 |
| `tests/__snapshots__/*.snap` | 自動更新 |
