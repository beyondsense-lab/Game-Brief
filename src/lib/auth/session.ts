import type { APIContext } from 'astro';
import { env } from 'cloudflare:workers';

export type SessionUser = {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'editor';
};

const cookie = 'gb_session';

export async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', data);

  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function createSession(
  ctx: APIContext,
  user: SessionUser
): Promise<void> {
  const id = crypto.randomUUID();

  const exp = new Date(
    Date.now() + 1000 * 60 * 60 * 24 * 7
  ).toISOString();

  await env.DB
    .prepare(
      'INSERT INTO sessions(id,user_id,expires_at,created_at) VALUES(?,?,?,?)'
    )
    .bind(id, user.id, exp, new Date().toISOString())
    .run();

  ctx.cookies.set(cookie, id, {
    httpOnly: true,
    secure: ctx.url.protocol === 'https:',
    sameSite: 'lax',
    path: '/',
    expires: new Date(exp),
  });
}

export async function getUser(
  ctx: APIContext
): Promise<SessionUser | null> {
  const id = ctx.cookies.get(cookie)?.value;

  if (!id) {
    return null;
  }

  const user = await env.DB
    .prepare(
      `SELECT
        u.id,
        u.email,
        u.name,
        u.role
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.id = ?
         AND s.expires_at > datetime('now')
         AND u.status = 'active'`
    )
    .bind(id)
    .first<SessionUser>();

  return user ?? null;
}

export async function logout(ctx: APIContext): Promise<void> {
  const id = ctx.cookies.get(cookie)?.value;

  if (id) {
    await env.DB
      .prepare('DELETE FROM sessions WHERE id=?')
      .bind(id)
      .run();
  }

  ctx.cookies.delete(cookie, {
    path: '/',
  });
}

export function requireRole(
  user: SessionUser | null,
  roles: Array<'admin' | 'editor'> = ['admin', 'editor']
): boolean {
  return !!user && roles.includes(user.role);
}
