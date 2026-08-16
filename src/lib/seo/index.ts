export type Seo={title:string;description:string;path?:string;image?:string;noindex?:boolean;type?:string};
export const siteName='GAME//BRIEF';
export const siteTagline='The gaming news worth knowing.';
export function canonical(base:string,path='/'){return new URL(path,base).toString().replace(/\/$/,'') || base}
export function organizationJsonLd(base:string){return { '@context':'https://schema.org','@type':'Organization',name:siteName,url:base,slogan:siteTagline};}
export function websiteJsonLd(base:string){return {'@context':'https://schema.org','@type':'WebSite',name:siteName,url:base,potentialAction:{'@type':'SearchAction',target:`${base}/search?q={search_term_string}`,'query-input':'required name=search_term_string'}}}
export function breadcrumbJsonLd(items:{name:string;url:string}[]){return {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:items.map((i,n)=>({'@type':'ListItem',position:n+1,name:i.name,item:i.url}))}}
