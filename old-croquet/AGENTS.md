# AGENTS.md

## Development rules

Always stick to DRY and KISS principles
Make changes atomic and always commit after each small change

## Purpose

This file records the active migration plan, decisions, and progress while modernizing this codebase and preparing it for a proper Tina Cloud CMS integration.

## Current State

- Repository is a legacy Stackbit/Sourcebit Next.js site.
- Content lives in `content/pages`, `content/data/config.json`, and `content/data/team`.
- Build and routing currently depend on `sourcebit`, `sourcebit-target-next`, and `next export`.
- Deployment is configured for a static `out/` directory on Netlify.

## Migration Goals

1. Stabilize the local toolchain and dependency story.
2. Upgrade the site off the legacy Stackbit/Sourcebit static-export path.
3. Preserve current content structure while moving the data layer to Tina.
4. Connect the repo to Tina Cloud with a maintainable schema and editor workflow.

## Progress Log

### 2026-04-08

- Process correction:
  - Future changes should be cut into smaller atomic slices.
  - Dependency modernization should be treated as a separate commit boundary from Tina integration.

- Completed initial repository review.
- Identified the main blockers:
  - Next 11 / React 17 / Node 14 era dependency set.
  - Sourcebit-driven page generation and data cache.
  - Static export deploy flow incompatible with a clean Tina setup.
  - Relaxed lint/type settings that will hide migration regressions.
- Installed dependencies with current local Node `24.14.1` / npm `11.11.0`.
- Baseline install results:
  - Engine mismatch warnings for the repo's `node >=14 <16` and `npm ~6` requirement.
  - Old lockfile metadata refresh was required.
  - 62 reported vulnerabilities across the legacy dependency tree.
  - Multiple deprecated transitive packages confirm the stack is overdue for a framework refresh.
- Baseline production build result:
  - Current `npm run build` fails under modern Node during the legacy Next 11 / webpack hashing step.
  - Failure is `ERR_OSSL_EVP_UNSUPPORTED`, which is a known symptom of older webpack-era stacks on newer OpenSSL runtimes.
  - Decision: do not patch this with `NODE_OPTIONS=--openssl-legacy-provider`; upgrade the framework baseline instead.
- Completed first remediation slice:
  - Updated project engines and core package versions toward a modern baseline.
  - Removed the runtime dependency on `sourcebit` from `next.config.js` and the catch-all page.
  - Added a direct filesystem content loader that reads Markdown and JSON from `content/`.
  - Updated `getStaticProps` handling to return `notFound` when a page slug is missing.
  - Updated the custom internal link wrapper for modern Next.js `Link` behavior.
- Verified the modernized app compiles successfully on Next `16.2.2` when built with webpack.
- Noted a follow-up debt item:
  - Turbopack currently trips over legacy CSS parsing in `src/css/main.css`, so webpack is the active build path for now.
- Added Tina scaffolding:
  - Introduced `tina/config.ts` with collections for site pages, blog posts, site config, and team members.
  - Added `.env.example` with Tina Cloud variables.
  - Updated npm scripts to use `tinacms dev` and `tinacms build`.
- Tina integration follow-up:
  - Converted the schema file to `tina/config.js` to avoid unnecessary TypeScript field-generic friction.
  - Cleaned `null` object values out of content files because Tina indexing is stricter than the legacy runtime.
  - Updated `.nvmrc` to `v20` because Tina's native dependency chain installs cleanly there.
  - Renamed the legacy contact-form secret usage to prefer `CONTACT_FORM_SECRET` while keeping backward compatibility.
- Validation status:
  - Plain application build now passes on Node `20.20.2` with `npx next build --webpack`.
  - Tina Cloud production build is intentionally still blocked until valid `NEXT_PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN` are provided.
  - Tina CLI local mode in this environment still attempts a cloud project lookup, so end-to-end Tina verification cannot complete without a real Tina Cloud project.
- Local environment check:
  - `.env` now contains the Tina-related variables: `NEXT_PUBLIC_TINA_BRANCH`, `NEXT_PUBLIC_TINA_CLIENT_ID`, `TINA_TOKEN`, `TINA_SEARCH_TOKEN`, and `NEXT_PUBLIC_SITE_URL`.
  - `CONTACT_FORM_SECRET` is still absent locally; that only affects the legacy contact form signing path.
- Working decision:
  - Tina should be tested locally first with the real local `.env` values before pushing any Netlify changes.
  - Netlify variables are still required for deployed preview/production validation after the local Tina flow succeeds.
- Tina env validation result:
  - `NEXT_PUBLIC_TINA_CLIENT_ID`, `TINA_TOKEN`, and `TINA_SEARCH_TOKEN` appear to be real values and Tina can resolve the Cloud project.
  - Local `tinacms build` fails because `NEXT_PUBLIC_TINA_BRANCH` is currently `master`, and Tina Cloud reports that `master` is not a configured branch for the project.
  - `NEXT_PUBLIC_SITE_URL` also does not currently look like a valid absolute URL, which should be corrected before preview validation.
- Additional branch validation:
  - GitHub remote confirms `master` is the repository default branch.
  - Tina Cloud also rejects `preview`, so the issue is not just a local branch name typo.
  - Current conclusion: the Tina Cloud project is not configured for the repository branches that currently exist remotely, or it has not synced them yet.
- Next step: update the Tina Cloud project branch configuration in the Tina dashboard, then rerun the local Tina build before making any Netlify changes.

### 2026-04-09

- Pushed branch `codex-tina-baseline` to GitHub.
- Local test result:
  - `yarn build:local` now completes successfully.
  - Tina local build emits generated files and `public/admin/index.html`.
  - The remaining local confusion is endpoint-related: port `4001` is the Tina GraphQL/dev service, while the site/admin should be checked through the Next app on port `3000`.
- Immediate next step:
  - Verify the site at `http://localhost:3000` and the Tina admin route at `http://localhost:3000/admin/index.html` while `yarn dev` is running.
- Clarification:
  - `yarn build:local` generates Tina assets and admin HTML, but it does not serve the site UI on `localhost:3000`.
  - `localhost:4001` is Tina's local API/dev asset server, not the stable browser entrypoint for normal use.
  - The intended browser route during local development remains `http://localhost:3000/admin/index.html` while `yarn dev` is running.
- Admin runtime fix:
  - Removed `fs`/`path` usage from `tina/config.js` because Tina prebuild bundles that config into a browser-consumed artifact.
  - The previous `teamOptions` generation was causing `Dynamic require of "fs" is not supported` in the admin shell.
- Tina artifact policy:
  - `tina/tina-lock.json` should be committed when it changes.
  - `tina/__generated__` remains generated output and is still ignored.
- Tooling correction:
  - Enabled `yarn` under Node 20 via Corepack so repo validation can use one package manager consistently.
- Tina config runtime correction:
  - Converted `tina/config` back to ESM TypeScript to avoid CommonJS dynamic-require failures in Tina's browser-facing prebuild bundle.
- Package manager normalization:
  - `yarn` is now the canonical package manager for the repo.
  - Added a repo-level `.yarnrc` so Yarn uses `/tmp` for temp files and cache in this environment instead of read-only host paths.
  - Removed `package-lock.json` to avoid split lockfile state.
- Local Tina dev correction:
  - Moved Tina's datalayer service to port `9001` in the repo scripts because port `9000` is already occupied in this environment.
  - The on-disk `public/admin` bundle was also confirmed stale and still contained the old `tina/config.js`; it needs to be regenerated after the Yarn/Tina script fixes.
- Branch consolidation:
  - `main` is now the canonical remote branch for the migration work.
  - The remote `master` branch has been deleted after `main` was updated with the latest Tina/Yarn fixes.
- Visual editing follow-up:
  - The Tina admin could load, but the site preview was still rendering only from the filesystem loader, so no live page editing was possible.
  - The current fix wires Tina query results back through the existing page/site resolver path so the preview can update without rewriting the whole rendering layer at once.
  - Tina's stricter schema validation also exposed a missing required `footer.socialLinks[*].type` value in `content/data/config.json`; content cleanup is part of making the visual editor render reliably.
