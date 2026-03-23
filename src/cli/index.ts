#!/usr/bin/env node

import { init } from './init.js'

const command = process.argv[2]

if (command === 'init') {
  init()
} else {
  console.log('Usage: frontend-eslint-config init')
  process.exit(1)
}
