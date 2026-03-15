import { expect, test, describe } from 'vitest'

describe('build', () => {
  test('production build succeeds', async () => {
    const { build } = await import('vite')
    const result = await build({
      logLevel: 'silent',
      build: { write: false },
    })
    expect(result).toBeTruthy()
  })
})

describe('index.html', () => {
  let html

  test('loads index.html', async () => {
    const fs = await import('node:fs')
    html = fs.readFileSync('index.html', 'utf-8')
    expect(html).toBeTruthy()
  })

  test('has correct title', () => {
    expect(html).toContain('<title>shashidev.me</title>')
  })

  test('has meta description', () => {
    expect(html).toContain('name="description"')
  })

  test('has Open Graph tags', () => {
    expect(html).toContain('og:title')
    expect(html).toContain('og:description')
    expect(html).toContain('og:image')
    expect(html).toContain('og:url')
  })

  test('has og:image pointing to PNG', () => {
    expect(html).toContain('og.png')
  })

  test('has dark color scheme', () => {
    expect(html).toContain('color-scheme')
    expect(html).toContain('theme-color')
  })

  test('has noscript fallback', () => {
    expect(html).toContain('noscript')
    expect(html).toContain('JavaScript is required')
  })

  test('has correct viewport', () => {
    expect(html).toContain('width=device-width')
  })

  test('mounts app to #app div', () => {
    expect(html).toContain('id="app"')
    expect(html).toContain('src="/src/main.js"')
  })
})

describe('theme', () => {
  let css

  test('loads theme.css', async () => {
    const fs = await import('node:fs')
    css = fs.readFileSync('src/lib/styles/theme.css', 'utf-8')
    expect(css).toBeTruthy()
  })

  test('defines background variables', () => {
    expect(css).toContain('--bg:')
    expect(css).toContain('--bg-surface:')
    expect(css).toContain('--bg-elevated:')
  })

  test('defines text variables', () => {
    expect(css).toContain('--text:')
    expect(css).toContain('--text-muted:')
  })

  test('defines accent color', () => {
    expect(css).toContain('--accent:')
  })

  test('defines font stacks', () => {
    expect(css).toContain('--font-sans:')
    expect(css).toContain('--font-mono:')
  })

  test('defines spacing tokens', () => {
    expect(css).toContain('--radius-sm:')
    expect(css).toContain('--radius-md:')
    expect(css).toContain('--radius-lg:')
  })

  test('defines transition tokens', () => {
    expect(css).toContain('--transition-fast:')
    expect(css).toContain('--transition-normal:')
  })
})

describe('global styles', () => {
  let css

  test('loads global.css', async () => {
    const fs = await import('node:fs')
    css = fs.readFileSync('src/lib/styles/global.css', 'utf-8')
    expect(css).toBeTruthy()
  })

  test('has box-sizing reset', () => {
    expect(css).toContain('box-sizing: border-box')
  })

  test('has dark color scheme', () => {
    expect(css).toContain('color-scheme: dark')
  })

  test('sets full height on html/body', () => {
    expect(css).toContain('height: 100%')
  })

  test('has focus-visible styles', () => {
    expect(css).toContain(':focus-visible')
    expect(css).toContain('--accent')
  })
})

describe('project structure', () => {
  const fs = require('node:fs')
  const path = require('node:path')

  const requiredDirs = [
    'src/lib/components/Desktop',
    'src/lib/components/Window',
    'src/lib/components/Loading',
    'src/lib/components/Cursor',
    'src/lib/stores',
    'src/lib/utils',
    'src/lib/styles',
    'src/apps/Projects',
    'src/apps/Experience',
    'src/apps/Internet',
    'public/assets/icons',
    'public/assets/cursors',
    'public/assets/backgrounds',
  ]

  for (const dir of requiredDirs) {
    test(`${dir}/ exists`, () => {
      expect(fs.existsSync(path.resolve(dir))).toBe(true)
    })
  }

  const requiredFiles = [
    'Dockerfile',
    'nginx-app.conf',
    'nginx.conf',
    '.editorconfig',
    '.prettierrc',
    'eslint.config.js',
    'CONTRIBUTING.md',
    'public/favicon.svg',
    'public/og.png',
  ]

  for (const file of requiredFiles) {
    test(`${file} exists`, () => {
      expect(fs.existsSync(path.resolve(file))).toBe(true)
    })
  }
})
