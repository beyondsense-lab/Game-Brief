import type { APIRoute } from 'astro';
import { getUser, requireRole } from '@/lib/auth/session';
import { getStorage } from '@/lib/storage';
export const GET:APIRoute=async(ctx)=>{const user=await getUser(ctx); if(!requireRole(user)) return new Response('Unauthorized',{status:401}); return Response.json(await getStorage(ctx.locals.runtime.env).status())};
