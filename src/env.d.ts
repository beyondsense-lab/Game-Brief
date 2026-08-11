type Runtime = import('@astrojs/cloudflare').Runtime<Env>;
declare namespace App { interface Locals extends Runtime { user?: import('./lib/auth/session').SessionUser | null } }
interface Env { DB: D1Database; MEDIA_BUCKET: R2Bucket; PUBLIC_SITE_URL: string; EMAIL_PROVIDER?: string; EMAIL_API_KEY?: string; EMAIL_FROM?: string; EMAIL_REPLY_TO?: string; SESSION_SECRET: string; }
