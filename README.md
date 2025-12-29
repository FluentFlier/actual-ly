# Actual.ly

Verified humans. Real posts. An AI agent for every user.

## Stack
- Next.js 14 (App Router)
- TypeScript + Tailwind
- Clerk (email + phone verification)
- Supabase (Postgres)
- Cerebras (agent)

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

### Required env vars
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CEREBRAS_API_KEY`
- `CRON_SECRET`
- `ADMIN_EMAILS` (comma-separated)
- `TWILIO_*` (if using SMS)

### Supabase setup
Run these in the Supabase SQL editor:
- `supabase/schema.sql`
- `supabase/rls.sql`

## Core flows
1. Landing page → claim username
2. Clerk sign-up → verify email + phone
3. Sync profile → dashboard + agent

## Project docs
See `docs/` for the full spec, implementation plan, and issue breakdown.
