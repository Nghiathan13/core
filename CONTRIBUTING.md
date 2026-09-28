# Contributing Guide

Welcome to **Core**! This document outlines guidelines and workflow standards to ensure clean, high-quality contributions.

---

## Quick Start

```bash
# 1. Clone repository
git clone https://github.com/Nghiathan13/core.git
cd core

# 2. Install dependencies (auto-configures git hooks)
pnpm install

# 3. Start development
pnpm dev        # Browser preview
pnpm tauri dev  # Desktop app preview
```

> [!NOTE]
> Requirements: **Node.js >= 24** and **pnpm >= 12**.

---

## How to Contribute

To keep reviews efficient and maintain high code quality:

| Contribution Type                          | Recommended Flow                                                                             |
| :----------------------------------------- | :------------------------------------------------------------------------------------------- |
| **Small Fixes & Improvements**             | Pick an issue or bug, implement the targeted fix, verify CI locally, and open a PR directly. |
| **Major Features or Architecture Changes** | Open an Issue or Discussion first to align on approach and roadmap before writing code.      |

---

## Architecture (FSD v2.1)

The frontend strictly follows **Feature-Sliced Design v2.1**:

```text
src/
├── app/        # Global init, styles, router, main layouts
├── pages/      # Route pages & page-level composition
├── features/   # Reusable user interactions (e.g. language-switcher)
├── entities/   # Business domain entities (when needed)
└── shared/     # Reusable infrastructure (ui, lib, i18n)
```

- **Downward imports only**: Slices may only import from layers strictly below them (`app` $\rightarrow$ `pages` $\rightarrow$ `features` $\rightarrow$ `entities` $\rightarrow$ `shared`).
- **Public API**: Always import via the slice's `index.ts`. Never cross-import internal files.
- **Doc Sync**: If folder structure in `src/` changes, run `pnpm docs:gen` to update [`docs/architecture-frontend.md`](docs/architecture-frontend.md).

---

## Development Commands

| Command             | Purpose                                                     |
| :------------------ | :---------------------------------------------------------- |
| `pnpm format:check` | Verify formatting with Prettier (`pnpm format` to auto-fix) |
| `pnpm lint`         | Check code with ESLint                                      |
| `pnpm lint:css`     | Check styles with Stylelint                                 |
| `pnpm check:fsd`    | Validate architecture boundaries with Steiger               |
| `pnpm coverage`     | Run tests with Vitest (100% threshold on `lib` & `i18n`)    |
| `pnpm build`        | Type-check (`tsc`) and bundle frontend                      |
| `pnpm docs:gen`     | Regenerate architecture documentation tree                  |

---

## Git & Pull Request Guidelines

### 1. Branch Naming

- `feat/<name>`: New features (`feat/settings-panel`)
- `fix/<name>`: Bug fixes (`fix/sidebar-width`)
- `chore/<name>`: Maintenance & tooling (`chore/update-pnpm`)

### 2. PR Title & Squash Merging

This repository enforces **Squash and Merge**.

> [!IMPORTANT]
> The **PR Title** becomes the final commit message on `main`. It **must** follow [Conventional Commits](https://www.conventionalcommits.org/):
>
> - `feat: add settings modal`
> - `fix(i18n): fallback to default language`
> - `chore: update dependencies`

### 3. Pre-flight Check

Before opening a PR, ensure all checks pass:

```bash
pnpm format:check && pnpm lint && pnpm lint:css && pnpm check:fsd && pnpm coverage && pnpm build
```
