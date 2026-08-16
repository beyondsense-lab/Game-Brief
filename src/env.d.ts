/// <reference types="astro/client" />
/// <reference types="@cloudflare/workers-types" />

declare namespace App {
  interface Locals {
    user?: import('./lib/auth/session').SessionUser | null;
  }
}

declare namespace Cloudflare {
  interface Env {
    DB: D1Database;

    PUBLIC_SITE_URL: string;

    CLOUDINARY_CLOUD_NAME?: string;
    CLOUDINARY_API_KEY?: string;
    CLOUDINARY_API_SECRET?: string;

    EMAIL_PROVIDER?: string;
    EMAIL_API_KEY?: string;
    EMAIL_FROM?: string;
    EMAIL_REPLY_TO?: string;

    SESSION_SECRET: string;

    ADMIN_EMAIL?: string;
    ADMIN_PASSWORD?: string;
  }
}

type Env = Cloudflare.Env;
