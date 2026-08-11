import type { APIRoute } from 'astro'; import { logout } from '@/lib/auth/session'; export const POST:APIRoute=async(ctx)=>{await logout(ctx); return ctx.redirect('/admin/login',303)};
