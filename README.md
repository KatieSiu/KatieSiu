# Linear Interview Prototypes

This is one merged Next.js app for the two interview prototypes.

## Routes

- `/` - basic prototype index page
- `/ctv` - CTV prototype
- `/campaign-planner` - Campaign Planner prototype

## Quick Start

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Layout

- `app/` - Next.js routes, including `/ctv` and `/campaign-planner`
- `features/ctv/` - CTV prototype components and helpers
- `features/campaign-planner/` - Campaign Planner prototype components, hooks, and helpers
- `public/` - static prototype assets

## Scripts

- `npm run dev` - start the merged app on port 3000
- `npm run build` - build the merged app
- `npm run lint` - run Next.js linting

## Notes

The old standalone `portfolio`, `CTV`, and `Campaign Planner` apps were consolidated into this root app. You no longer need three terminals or localhost links between apps.
