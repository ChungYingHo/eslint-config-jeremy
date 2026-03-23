import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    'cli/index': 'src/cli/index.ts',
    'scripts/postinstall': 'src/scripts/postinstall.ts',
    index: 'src/index.ts',
  },
  format: ['esm'],
  target: 'node18',
  clean: true,
  splitting: false,
  bundle: true,
  noExternal: ['@clack/prompts', 'picocolors'],
  dts: {
    entry: 'src/index.ts',
  },
})
