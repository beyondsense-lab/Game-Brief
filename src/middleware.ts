import { defineMiddleware } from 'astro:middleware';
import { getUser } from './lib/auth/session';
export const onRequest = defineMiddleware(async (ctx,next)=>{ if(ctx.url.pathname.startsWith('/admin') && ctx.url.pathname!='/admin/login'){ const user=await getUser(ctx); if(!user) return ctx.redirect('/admin/login',302); ctx.locals.user=user; } return next(); });
