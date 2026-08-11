type Runtime = import('@astrojs/cloudflare').Runtime<Env>;
declare namespace App { interface Locals extends Runtime { user?: import('./lib/auth/session').SessionUser | null } }
interface Env { DB: D1Database; PUBLIC_SITE_URL: string; CLOUDINARY_CLOUD_NAME?: string; CLOUDINARY_API_KEY?: string; CLOUDINARY_API_SECRET?: string; EMAIL_PROVIDER?: string; EMAIL_API_KEY?: string; EMAIL_FROM?: string; EMAIL_REPLY_TO?: string; SESSION_SECRET: string; }
