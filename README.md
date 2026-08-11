# GAME//BRIEF

GAME//BRIEF is an Astro SSR gaming publication and CMS for Cloudflare Workers, D1, R2 and configurable newsletter email providers.

## Tech stack
- Astro SSR with the official Cloudflare adapter
- Tailwind CSS design system
- Cloudflare D1 with Drizzle schema and SQL migrations
- Cloudflare R2 media storage
- Session-based CMS authentication with HTTP-only cookies
- Provider-based newsletter email abstraction

## Local development
```bash
npm install
cp .env.example .env
npm run dev
```

## Environment variables
`PUBLIC_SITE_URL`, `DATABASE_ID`, `R2_BUCKET`, `EMAIL_PROVIDER`, `EMAIL_API_KEY`, `EMAIL_FROM`, `EMAIL_REPLY_TO`, `SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.

## D1 and migrations
Create a D1 database named `game-brief`, update `wrangler.toml`, then run:
```bash
npm run db:migrate:local
npm run db:migrate:remote
```
Generate future migrations with `npm run db:generate`.

## Seed data and admin account
Run `npm run db:seed` to produce a local password hash, then insert a real admin user through a controlled Wrangler D1 command or deployment seed workflow. Do not commit credentials.

## R2 setup
Create an R2 bucket, bind it as `MEDIA_BUCKET`, and configure public media delivery or a Worker media route before production.

## Email provider setup
Set `EMAIL_PROVIDER` and provider credentials. Cloudflare Email Routing is suitable for inbound contact addresses, not bulk newsletters.

## CMS usage
1. Visit `/admin/login`.
2. Log in with an active admin or editor account.
3. Open Articles → New article.
4. Add title, slug, excerpt, Markdown content, hero image URL/alt text, author, category, tags/relationships and SEO metadata.
5. Save as draft, open Preview, then change status to Published or Scheduled and save.
6. Published articles appear at `/news/[slug]`, in lists, RSS and sitemap automatically.

## Cloudflare deployment
```bash
npm run build
npm run deploy
```

## Production checklist
- Create Cloudflare D1 database and R2 bucket.
- Set secrets with `wrangler secret put SESSION_SECRET` and provider API keys.
- Configure DNS, SSL/TLS, caching rules and Cloudflare Web Analytics.
- Review legal placeholder pages before launch.
