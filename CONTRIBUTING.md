# Contributing

Thanks for your interest in contributing to this project. Here's how to get started.

## Dev Environment Setup

You need [Bun](https://bun.sh/) installed.

```bash
git clone https://github.com/shashikundur1/portfolio.git
cd portfolio
bun install
bun run dev
```

The dev server starts at `http://localhost:5175` with HMR.

## Running Tests

```bash
bun run test          # single run
bun run test:watch    # watch mode
```

Tests use Vitest with jsdom. Test files live next to source files as `*.test.js`.

## Linting & Formatting

```bash
bun run lint          # run ESLint
bun run format        # format with Prettier (writes changes)
bun run check         # check formatting + lint (no writes, CI-friendly)
```

## Code Style

- Follow the project's [.editorconfig](.editorconfig): 2-space indentation, LF line endings, UTF-8, trailing newline.
- Prettier config is in [.prettierrc](.prettierrc): single quotes, no semicolons, 2-space tabs.
- ESLint config is in [eslint.config.js](eslint.config.js): flat config with Svelte and Prettier integration.

Run `bun run check` before pushing to make sure everything passes.

## Pull Request Process

1. Fork the repo and create a branch from `main`.
2. Make your changes. Add tests if applicable.
3. Run `bun run check` and `bun run test` to verify.
4. Commit with a clear, descriptive message.
5. Open a PR against `main` with a summary of what changed and why.

Keep PRs focused on a single concern. If you're fixing a bug, don't refactor unrelated code in the same PR.
