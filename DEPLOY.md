# Deploy to Vercel

This project is prepared as a Next.js app.

## What to commit

Commit these folders/files:

- app/
- components/
- hooks/
- lib/
- styles/
- public/
- package.json
- next.config.mjs
- postcss.config.mjs
- tsconfig.json
- next-env.d.ts
- components.json
- .gitignore

Do not commit:

- node_modules/
- .next/
- .vercel/
- .env*

## Vercel settings

- Framework Preset: Next.js
- Root Directory: ./
- Install Command: npm install
- Build Command: npm run build
- Output Directory: leave blank
- Node.js Version: 20.x

## Current migration strategy

The completed HTML prototype is served from:

- public/prototype/index.html

The Next.js homepage (`app/page.tsx`) loads it in a full-screen iframe so the current UI can deploy immediately.
Later, screens can be migrated one by one from the prototype into React components.
