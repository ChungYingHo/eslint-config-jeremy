export function serializeValue(value: unknown, indent: number): string {
  const pad = ' '.repeat(indent)

  if (value === null || value === undefined) {
    return String(value)
  }

  if (typeof value === 'string') {
    return `'${value}'`
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'

    const items = value.map(item => serializeValue(item, indent + 2))
    const singleLine = `[${items.join(', ')}]`
    if (singleLine.length < 60 && !singleLine.includes('\n')) {
      return singleLine
    }

    const innerPad = ' '.repeat(indent + 2)
    return `[\n${items.map(item => `${innerPad}${item}`).join(',\n')},\n${pad}]`
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>
    const entries = Object.entries(obj)
    if (entries.length === 0) return '{}'

    const innerPad = ' '.repeat(indent + 2)
    const serialized = entries.map(([key, val]) => {
      const serializedVal = serializeValue(val, indent + 2)
      return `${innerPad}${key}: ${serializedVal},`
    })

    const singleLine = `{ ${entries.map(([k, v]) => `${k}: ${serializeValue(v, 0)}`).join(', ')} }`
    if (singleLine.length < 60 && !singleLine.includes('\n')) {
      return singleLine
    }

    return `{\n${serialized.join('\n')}\n${pad}}`
  }

  return String(value)
}

export function serializeRules(rules: Record<string, unknown>, indent: number): string {
  const pad = ' '.repeat(indent)
  const lines: string[] = []

  for (const [key, value] of Object.entries(rules)) {
    const needsQuotes = key.includes('/') || key.includes('@') || key.includes('-')
    const formattedKey = needsQuotes ? `'${key}'` : key
    const serializedValue = serializeValue(value, indent)
    lines.push(`${pad}${formattedKey}: ${serializedValue},`)
  }

  return lines.join('\n')
}
