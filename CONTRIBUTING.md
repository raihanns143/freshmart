# Contributing to FreshMart Pro

First off — thank you for considering contributing! 🎉  
Every contribution, from fixing a typo to shipping a new feature, is genuinely appreciated.

Please read this guide before submitting your first pull request.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Branch Naming Convention](#branch-naming-convention)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Coding Style](#coding-style)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)

---

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md).  
By participating, you agree to uphold this code. Please report unacceptable behaviour to the project maintainers.

---

## How Can I Contribute?

### 🐛 Report a Bug
Open a [Bug Report](https://github.com/yourusername/freshmart/issues/new?template=bug_report.md).  
Include reproduction steps, expected vs actual behaviour, and screenshots if possible.

### 💡 Suggest a Feature
Open a [Feature Request](https://github.com/yourusername/freshmart/issues/new?template=feature_request.md).  
Explain the problem you're solving and how your feature addresses it.

### 📝 Improve Documentation
Documentation PRs are always welcome — even fixing a typo!

### 🔧 Submit a Pull Request
Pick an [open issue](https://github.com/yourusername/freshmart/issues) labelled `good first issue` or `help wanted`.

---

## Development Setup

### 1. Fork & Clone

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/YOUR_USERNAME/freshmart.git
cd freshmart
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment

```bash
cp .env.example .env
# Edit .env with your local values
```

### 4. Start Database

```bash
docker-compose up db -d
```

### 5. Initialise Database

```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### 6. Start Dev Server

```bash
npm run dev
```

The app runs at `http://localhost:3000`.  
Admin panel: `http://localhost:3000/admin` (credentials from seed output)

### 7. Run Tests

```bash
# E2E tests
npm test

# Type checking
npm run typecheck

# Lint
npm run lint
```

---

## Branch Naming Convention

Use this format for all feature branches:

```
<type>/<short-description>
```

| Type | When to use |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `refactor` | Code restructure (no feature change) |
| `test` | Tests only |
| `chore` | Tooling, deps, config |
| `style` | Formatting, CSS |

### Examples

```
feat/stripe-checkout
fix/cart-quantity-bug
docs/update-readme
refactor/product-form-validation
test/add-checkout-e2e
```

---

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/).

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

### Examples

```bash
feat(checkout): add Stripe payment intent creation
fix(cart): prevent negative quantity on decrement
docs(readme): update installation instructions
refactor(products): extract ProductForm into separate component
test(e2e): add checkout flow test
chore(deps): bump prisma to 5.22.0
```

### Rules
- Use the **imperative mood** in the subject line ("add" not "added")
- Keep the subject line under **72 characters**
- Reference the issue number in the footer: `Closes #42`

---

## Pull Request Process

### Before Opening a PR

- [ ] Create a branch from `main` using the naming convention above
- [ ] Make your changes in small, focused commits
- [ ] Ensure `npm run typecheck` passes with no errors
- [ ] Ensure `npm run lint` passes with no errors
- [ ] Add or update tests if relevant
- [ ] Update documentation if you added a new feature

### Opening the PR

1. Push your branch: `git push origin feat/your-feature`
2. Go to GitHub → **New Pull Request**
3. Fill in the PR template completely
4. Link the related issue: `Closes #<issue-number>`
5. Request a review from a maintainer

### Review Process

- A maintainer will review within **2–3 business days**
- Address all review comments with new commits (do not force-push during review)
- Once approved, the maintainer will squash-merge your PR

---

## Coding Style

### TypeScript

- Prefer `interface` over `type` for object shapes
- Avoid `any` — use proper types or generics
- Use `const` by default; `let` only when reassignment is needed
- Export types and interfaces from `types/index.ts`

### React / Next.js

- Server Components by default — only add `"use client"` when necessary
- Co-locate component logic with the file that uses it
- Use named exports (not default exports) for components
- Keep components under ~200 lines — extract into smaller pieces

### Database

- Never bypass Prisma with raw SQL unless absolutely necessary
- Add an `@@index` for every foreign key in the schema
- Always test schema changes with `npx prisma db push` locally before committing

### CSS / Tailwind

- Use Tailwind utility classes — no custom CSS unless absolutely needed
- Extract repeated class combinations into component-level constants
- Never use `!important`

---

## Reporting Bugs

When filing a bug report, please include:

1. **Summary** — One-sentence description
2. **Steps to reproduce** — Exact steps to trigger the bug
3. **Expected behaviour** — What should happen
4. **Actual behaviour** — What actually happens
5. **Environment** — OS, browser, Node.js version
6. **Screenshots / console errors** — If applicable

---

## Requesting Features

When filing a feature request, please include:

1. **Problem statement** — What problem does this solve?
2. **Proposed solution** — How should it work?
3. **Alternatives considered** — What else did you consider?
4. **Additional context** — Mockups, references, related issues

---

Thank you for helping make FreshMart better! 🥦🛒
