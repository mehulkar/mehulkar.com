# mehulkar.com

My personal website. Built with [Eleventy](https://11ty.dev).

## Write

```bash
pnpm new
```

## Run locally

```bash
pnpm i
pnpm dev        # Eleventy dev server
# or, to also run the /api functions:
pnpm add -g vercel
vc dev
```

## Build locally

```bash
pnpm build      # outputs to _site/
```

## Layout

- `source/`: site content and templates (Eleventy input)
- `api/`: Vercel serverless functions
- `lib/`: build-time helpers used by `.eleventy.js`
- `scripts/`: maintenance scripts (`pnpm new`, `pnpm update-movies`,
  `pnpm fetch-tweets`, `pnpm convert-tags`)

## Deploy

The `main` branch is auto deployed by Vercel:

<https://vercel.com/mehul-kar/mehulkar>
