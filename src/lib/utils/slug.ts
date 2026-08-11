export const slugify=(s:string)=>s.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
export const now=()=>new Date().toISOString();
export const readingTime=(md:string)=>Math.max(1,Math.ceil(md.split(/\s+/).filter(Boolean).length/220));
