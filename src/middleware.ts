import { defineMiddleware } from 'astro:middleware';
import { getUser } from './lib/auth/session';

export const onRequest = defineMiddleware(async (ctx, next) => {
  const { pathname } = ctx.url;

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const user = await getUser(ctx);

    if (!user) {
      return ctx.redirect('/admin/login', 302);
    }

    ctx.locals.user = user;
  }

  return next();
});
