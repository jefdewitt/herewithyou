# Repo Breakdown

## What it is

This is the **Payload CMS monorepo**, version `4.0.0-canary.37`. It is the framework's own source, not a site. Branch `prototype/here-with-you` is the start of the "Here With You" prototype. Its first commit deletes `templates/with-vercel-website/src/app/(frontend)/page.tsx`, the homepage re-export of `[slug]/page`.

## Type of site

- **Monorepo contents:** the headless CMS and admin panel, plus database adapters, plugins and templates.
- **Possible site:** "Here With You" is probably built from `templates/with-vercel-website`. That is Payload's website template: pages, posts, a layout builder, SEO, search, redirects and forms.
- **Dev sandbox:** day to day, you run the dev sandbox in `test/`.

## Frontend

- **Framework:** Next.js App Router with React Server Components. A TanStack Start variant exists in `app-tanstack/` and `packages/tanstack-start`.
- **Admin UI:** `packages/ui` holds the components and `packages/next` holds the views and routing glue.
- **Rich text:** Lexical, in `packages/richtext-lexical`.
- **Styling:** plain CSS with design tokens. SCSS is being phased out.
- **Your site frontend:** `templates/with-vercel-website/src/app/(frontend)`.

## Backend

- **Core:** `packages/payload` provides collections, fields, hooks, access control, auth, the Local API, jobs, versions and uploads.
- **APIs:** REST and GraphQL. REST lives in `app/(payload)/api/[...slug]`, and GraphQL in `packages/graphql` and `app/(payload)/api/graphql`.
- **Database:** Mongo (the default), Postgres, SQLite, Vercel Postgres or D1. The SQL adapters use Drizzle.
- **Storage and email:** S3, Azure, GCS, R2 or Vercel Blob for storage. Nodemailer or Resend for email.

## Project structure

```
app/(payload)/        admin + REST/GraphQL routes (Next.js host app)
app/(app)/            sandbox frontend
packages/
  payload/            core engine
  ui/  next/          admin UI and Next integration
  db-* drizzle/       database adapters
  richtext-lexical/   editor
  plugin-*            seo, search, form-builder, ecommerce, multi-tenant, mcp...
  storage-* email-*   adapters
  translations/       i18n strings
test/<suite>/         config.ts (a mini Payload config) + int.spec.ts + e2e.spec.ts
templates/            starters (blank, website, ecommerce, with-vercel-website...)
examples/  docs/  tools/  scripts/
```

## End-to-end vertical slice: creating a post in the default dev suite

1. **Start:** `pnpm dev` runs `test/dev.ts`. That loads `test/_community/config.ts` through `buildConfigWithDefaults`, which seeds `dev@payloadcms.com` / `test` and an "example post".
2. **Config:** `PostsCollection` and `MediaCollection` come from `test/_community/collections`. `lexicalEditor` supplies the editor.
3. **UI:** at `/admin`, `app/(payload)/admin/[[...segments]]/page.tsx` renders the RSC views from `packages/next`. The form components come from `packages/ui`. Auto-login is on.
4. **Request:** saving the form calls `POST /api/posts`, handled by `app/(payload)/api/[...slug]/route.ts`.
5. **Core:** `packages/payload` runs access control, then hooks, then field validation.
6. **Database:** the adapter (`db-mongodb` by default, or Drizzle) writes the document. Versions and drafts are stored if enabled.
7. **Read side:** a frontend page calls `payload.find()` through the Local API, or `/api/posts` or GraphQL, and renders the result. In your template that is `(frontend)/[slug]/page.tsx`.

## Start and serve locally

```sh
pnpm install
pnpm run build:core          # first time only
pnpm run dev                 # in-memory Mongo, http://localhost:3000/admin
pnpm run dev <suite>         # e.g. pnpm run dev fields
pnpm run dev:postgres        # Postgres (needs docker: pnpm docker:start)
pnpm run dev:tanstack        # TanStack Start framework
pnpm dev:prod <suite>        # production-style run (after prepare-run-test-against-prod)
```

Node must be >=24.15.0 and pnpm ^11.9.0. To run your site template, you have to work inside `templates/with-vercel-website`. It has its own `package.json` and env, and needs a `DATABASE_URL` and `PAYLOAD_SECRET`.

## Most-touched areas

These counts come from the last 2000 commits:

| Area                        | File touches |
| --------------------------- | ------------ |
| `packages/ui`               | 4272         |
| `packages/payload`          | 2507         |
| `packages/translations`     | 2250         |
| `packages/richtext-lexical` | 1196         |
| `packages/next`             | 781          |
| `packages/plugin-mcp`       | 671          |
| `test/fields`               | 468          |
| `templates/ecommerce`       | 461          |

For your prototype, the files that matter most are the `templates/with-vercel-website` collections, globals and `(frontend)` routes. You will also touch the template's `payload.config.ts`.

## Inputs and outputs

**Inputs**

- **Config:** `payload.config.ts` or `test/<suite>/config.ts` (collections, globals, fields, plugins, adapters).
- **Environment:** `DATABASE_URL` or `PAYLOAD_DATABASE`, `PAYLOAD_SECRET`, and storage, email and Stripe keys.
- **Content:** edits in the admin UI, uploads, and API calls.
- **Dev flags:** `--no-auto-login`, `--prod-server`, `--framework-tanstack-start`, `--no-turbo`.

**Outputs**

- **Admin UI:** `/admin`.
- **APIs:** REST `/api/*`, GraphQL `/api/graphql`, and the Local API.
- **Rendered pages:** the frontend.
- **Generated files:** `payload-types.ts`, `schema.graphql` and the import map.
- **Build artifacts:** the packages' `dist/` folders.
- **Stored data:** DB rows and documents, plus files in storage.
- **npm packages:** published from `packages/*`.
