import { expect, test } from 'vitest'

test('production build succeeds', async () => {
  const { build } = await import('vite')
  const result = await build({
    logLevel: 'silent',
    build: { write: false },
  })
  expect(result).toBeTruthy()
})

test('index.html contains required meta tags', async () => {
  const fs = await import('node:fs')
  const html = fs.readFileSync('index.html', 'utf-8')
  expect(html).toContain('<title>shashidev.me</title>')
  expect(html).toContain('name="description"')
  expect(html).toContain('og:title')
  expect(html).toContain('color-scheme')
  expect(html).toContain('noscript')
})
