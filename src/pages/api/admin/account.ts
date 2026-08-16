import type { APIRoute } from 'astro'; import { getUser } from '@/lib/auth/session'; import { saveAccount } from '@/db/queries/admin';
export const POST:APIRoute=async (ctx)=>{const user=await getUser(ctx); if(!user) return new Response('Unauthorized',{status:401}); const form=await ctx.request.formData(); await saveAccount(user.id,form); return ctx.redirect('/admin/settings?saved=1',303)};
