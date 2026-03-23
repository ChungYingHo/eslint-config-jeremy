# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`frontend-eslint-config` is a shareable ESLint config npm package (not yet implemented). The repository currently contains design specifications in Chinese (Traditional) describing:

- **Intro.md** — Package functionality, installation flow, interactive init CLI (`npx frontend-eslint-config init`), and example configs for Astro and Vue projects
- **Rules.md** — Complete rule definitions: base rules, TypeScript rules, Vue rules, and absolute-path import rules

## Planned Architecture

The package will be an npm installable (`npm install -D frontend-eslint-config`) targeting ESLint 9+ / Node 18+. Key design decisions:

- **Two-phase setup**: install via npm, then run `npx frontend-eslint-config init` for interactive configuration
- **Template block assembly**: the CLI assembles `eslint.config.js` by combining boilerplate blocks (base, TS, Vue, Astro, absolute-path) based on user answers
- **Auto-detection**: TypeScript detected from `package.json` devDependencies; package manager detected from lock files
- **Single framework constraint**: only one framework plugin (Vue or Astro) at a time to avoid parser conflicts
- **Optional absolute-path enforcement**: uses `eslint-plugin-import` + `no-restricted-imports` to ban relative imports

## Key Dependencies (peer)

- `eslint` ^9.x, `@typescript-eslint/eslint-plugin` ^8.x, `@typescript-eslint/parser` ^8.x
- `eslint-plugin-vue` ^10.x, `eslint-plugin-astro` ^2.x
- `eslint-plugin-import` ^2.x, `eslint-import-resolver-typescript` ^4.x

## Collaboration Rules

- **回覆格式**：每次對話或調整結束時，必須以「親愛的 Jeremy」開頭，用中文撰寫本次調整的 summary。
- **審核流程**：所有調整皆會由 antigravity 與 codex 共同審核。

## Language

All spec documents are written in Traditional Chinese (zh-TW). Maintain this convention for documentation.
