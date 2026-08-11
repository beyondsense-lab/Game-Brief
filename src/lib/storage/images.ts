import { getStorage, type ImageTransformOptions } from './index';
const url=(env:Env,src:string,opts:ImageTransformOptions)=>getStorage(env).getOptimizedImageUrl(src,opts);
export const getArticleHeroUrl=(env:Env,src:string)=>url(env,src,{width:1280,quality:'auto',format:'auto',crop:'limit'});
export const getCardImageUrl=(env:Env,src:string)=>url(env,src,{width:640,height:360,crop:'fill',quality:'auto',format:'auto'});
export const getThumbnailUrl=(env:Env,src:string)=>url(env,src,{width:320,height:180,crop:'fill',quality:'auto',format:'auto'});
export const getGameCoverUrl=(env:Env,src:string)=>url(env,src,{width:480,height:640,crop:'fill',quality:'auto',format:'auto'});
export const getAvatarUrl=(env:Env,src:string)=>url(env,src,{width:160,height:160,crop:'thumb',quality:'auto',format:'auto'});
export const getOgImageUrl=(env:Env,src:string)=>url(env,src,{width:1200,height:630,crop:'fill',quality:'auto',format:'auto'});
