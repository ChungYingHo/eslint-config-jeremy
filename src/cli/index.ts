#!/usr/bin/env node

import { init } from './init.js'
import { logger } from '../utils/logger.js'

const command = process.argv[2]

if (command === 'init') {
  try {
    await init()
  } catch (err) {
    logger.error(err instanceof Error ? err.message : String(err))
    process.exit(1)
  }
} else {
  console.log('Usage: frontend-eslint-config init')
  process.exit(1)
}
