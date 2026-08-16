# GAME//BRIEF

GAME//BRIEF is an Astro SSR gaming publication and CMS for Cloudflare Workers, Cloudflare D1, Cloudinary image storage and configurable newsletter email providers.

## Tech stack
- Astro SSR with the official Cloudflare adapter
- Tailwind CSS design system
- Cloudflare D1 with Drizzle schema and SQL migrations
- Cloudinary media storage, optimization and CDN delivery
- Session-based CMS authentication with HTTP-only cookies
- Provider-based newsletter email abstraction

## Local development
```bash
npm install
cp .env.example .env
npm run dev
```

## Environment variables
`PUBLIC_SITE_URL`, `DATABASE_ID`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `EMAIL_PROVIDER`, `EMAIL_API_KEY`, `EMAIL_FROM`, `EMAIL_REPLY_TO`, `SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.

Use these local placeholders until real Cloudinary credentials are configured:
```bash
CLOUDINARY_CLOUD_NAME=<YOUR_CLOUDINARY_CLOUD_NAME>
CLOUDINARY_API_KEY=<YOUR_CLOUDINARY_API_KEY>
CLOUDINARY_API_SECRET=<YOUR_CLOUDINARY_API_SECRET>
```

Never commit real Cloudinary credentials. `CLOUDINARY_API_SECRET` is server-only and must not be prefixed with `PUBLIC_`.

## D1 and migrations
Create a D1 database named `game-brief`, update `wrangler.toml`, then run:
```bash
npm run db:migrate:local
npm run db:migrate:remote
```
Generate future migrations with `npm run db:generate`.

## Seed data and admin account
Run `npm run db:seed` to produce a local password hash, then insert a real admin user through a controlled Wrangler D1 command or deployment seed workflow. Do not commit credentials.

## Cloudinary setup
1. Create a Cloudinary account.
2. Open the Cloudinary dashboard.
3. Copy the Cloud Name into `CLOUDINARY_CLOUD_NAME`.
4. Copy the API Key into `CLOUDINARY_API_KEY`.
5. Copy the API Secret into `CLOUDINARY_API_SECRET`.
6. Add the same values to local `.env` for development.
7. Add production credentials with Cloudflare Worker secrets:
```bash
wrangler secret put CLOUDINARY_API_KEY
wrangler secret put CLOUDINARY_API_SECRET
```
8. Set `CLOUDINARY_CLOUD_NAME` as a Worker environment variable or secret.
9. Deploy and test `/admin/media` by uploading a JPEG, PNG, WebP or AVIF image.

Cloudinary folders are centralized under `gamebrief/articles`, `gamebrief/games`, `gamebrief/reviews`, `gamebrief/guides`, `gamebrief/authors`, `gamebrief/developers`, `gamebrief/publishers`, `gamebrief/newsletter` and `gamebrief/general`.

## Legacy R2 migration status
R2 is no longer required for runtime image uploads. The app now uploads through the server-side Cloudinary storage abstraction and stores provider/public ID/secure URL metadata in D1. Existing rows from earlier R2 builds can be preserved as `legacy-r2` during migration and should be moved manually with `scripts/migrate-r2-to-cloudinary.ts`. That utility is intentionally non-destructive and never deletes source R2 objects automatically.

## Email provider setup
Set `EMAIL_PROVIDER` and provider credentials. Cloudflare Email Routing is suitable for inbound contact addresses, not bulk newsletters.

## CMS usage
1. Visit `/admin/login`.
2. Log in with an active admin or editor account.
3. Open Articles → New article.
4. Add title, slug, excerpt, Markdown content, hero image URL/alt text, author, category, tags/relationships and SEO metadata.
5. Upload media in `/admin/media`; the server stores it in Cloudinary and records the HTTPS URL in D1.
6. Save as draft, open Preview, then change status to Published or Scheduled and save.
7. Published articles appear at `/news/[slug]`, in lists, RSS and sitemap automatically.

## Cloudflare deployment
```bash
npm run build
npm run deploy
```

## Production checklist
- Create Cloudflare D1 database.
- Configure Cloudinary credentials in Cloudflare Worker environment/secrets.
- Set secrets with `wrangler secret put SESSION_SECRET`, `wrangler secret put CLOUDINARY_API_KEY`, `wrangler secret put CLOUDINARY_API_SECRET` and provider API keys.
- Configure DNS, SSL/TLS, caching rules and Cloudflare Web Analytics.
- Review legal placeholder pages before launch.
