# Web3LD Website

[![Deploy to Vercel](https://github.com/web3ld/web3ld-website/actions/workflows/deploy-vercel.yml/badge.svg)](https://github.com/web3ld/web3ld-website/actions/workflows/deploy-vercel.yml)
[![Lint](https://github.com/web3ld/web3ld-website/actions/workflows/lint.yml/badge.svg)](https://github.com/web3ld/web3ld-website/actions/workflows/lint.yml)
[![Playwright Tests](https://github.com/web3ld/web3ld-website/actions/workflows/playwright-tests.yml/badge.svg)](https://github.com/web3ld/web3ld-website/actions/workflows/playwright-tests.yml)
[![Vitest Tests](https://github.com/web3ld/web3ld-website/actions/workflows/vitest-tests.yml/badge.svg)](https://github.com/web3ld/web3ld-website/actions/workflows/vitest-tests.yml)

The main repo hub for the open-source **Web3LD** initiative website, deployed to **Vercel** at **[web3ld.org](https://web3ld.org)**.

![Web3LD Wordmark](https://web3ld.org/images/logos/wordmark.png)

Founded and led by **Rito** via **RitoVision** — see **[ritovision.com](https://ritovision.com)**.

---

## Tech Stack

* **Framework:** Next.js (App Router)
* **Package Manager:** pnpm (preferred to avoid phantom dependencies)
* **Repo Layout:** Monorepo with workspaces

  * Root workspace = the main Next.js website
  * `cloudflare-worker/` = Worker that powers the Contact Form API (via Wrangler)
* **Testing:** Vitest (unit), Playwright (E2E) at the root, and Supertest (Worker)
* **CI:** GitHub Actions (deploy, lint, unit, and E2E)

---

## Monorepo Structure

```
web3ld-website/
├─ app/                     # Next.js app router source
├─ components/              # Reusable UI components
├─ e2e/                     # Playwright tests (root workspace)
├─ scripts/                 # Repo scripts (e.g., JSON-LD generation)
├─ cloudflare-worker/       # Contact form Cloudflare Worker (separate workspace)
│  ├─ src/contact/          # Worker entry + routes
│  ├─ scripts/              # Worker-specific scripts (OpenAPI, secrets)
│  └─ tests/                # Supertest for Worker
├─ app/_data/jsonld/global # Global JSON-LD definitions
├─ app/_data/jsonld/homepage # Homepage JSON-LD definitions
├─ app/<page>/jsonld # Page-specific JSON-LD folder (e.g., app/terms/jsonld)
├─ public/                  # Static assets
├─ .env.local               # Local env (not committed)
└─ package.json             # Root workspace
```

---

## Getting Started

### 1) Use **pnpm**

This repo is pinned to pnpm via `packageManager` in `package.json`.

```bash
# Install all workspaces
pnpm install
```

### 2) Local env

Copy and rename `.env.local.example` to `.env.local` at the project root (same directory as the root `package.json`):

```bash
NEXT_PUBLIC_CLOUDFLARE_WORKER_URL=http://localhost:8787
```

> This lets the Next.js site hit your local Worker for the contact form.

---

## Run It Locally

### Next.js website (root workspace)

```bash
pnpm dev
```

This runs `next dev -H 0.0.0.0`.

Additionally, when the dev server runs, it automatically generates and maintains index files for JSON-LD folders. This is handled by `index-plugin.ts` configured in next.config.ts, so whenever JSON-LD files are added or removed, the indexes are updated automatically.

### Cloudflare Worker (contact form API)

From the **root** (thanks to workspace scripts in `cloudflare-worker/package.json`):

```bash
pnpm dev:contact
```

This starts Wrangler at `http://localhost:8787`. Make sure your `.env.local` contains the `NEXT_PUBLIC_CLOUDFLARE_WORKER_URL` shown above.

---

## Tests

### Unit / Integration (root, website)

```bash
# Vitest
pnpm test
pnpm test:watch
pnpm test:coverage
```

### End-to-End (root, website)

```bash
# Playwright (CI-style run)
pnpm test:e2e

# With UI
pnpm test:e2e:ui

```

> First time using Playwright locally? Install browsers:
>
> ```bash
> pnpm exec playwright install
> ```

---

## Contributing

PRs welcome. Grab that ✅.

### Flagging Intentional “Spec” Changes (so test failures are expected)

Sometimes a PR **intentionally** changes behavior/contract and breaks existing tests. Please **mark it clearly** so reviewers know to review/adjust tests rather than reject the PR.

You can do **either** (or both):

1. **Label the PR:** `Type: spec-change`

   * Maintainers: create this label once in the repo settings (color your vibe).
2. **Prefix the PR title:** `[spec] Your concise description`

   * Example: `[spec] Switch contact validation to server-only`

Add a short note in the PR body explaining what changed and which tests (roughly) are expected to fail until updated.

> If you’re changing public API/UX flows (like the contact form contract), include a quick migration note.

---

## Deployment

* **Production:** Vercel → **[web3ld.org](https://web3ld.org)**
* **Contact API:** Cloudflare Worker (deployed via Wrangler scripts in `cloudflare-worker/`)

CI will run lint, unit tests, and Playwright E2E as shown by the badges above.

---

## License & Trademarks

* **Code:** MIT License (open-source, have fun).
* **Branding & Marks:** All branding, names, wordmarks, and logos for **Web3LD** and **RitoVision** are proprietary and protected.
  Using the code ≠ permission to use the marks. If you need brand assets usage for commercial purposes beyond ordinary attributions or sharing, contact us through the site's [contact form](https://web3ld.org/#contact).

---

## Contact

* Main Site: **[web3ld.org](https://web3ld.org/#contact)**
