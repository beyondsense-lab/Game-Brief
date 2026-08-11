export type MediaFolder='articles'|'games'|'reviews'|'guides'|'authors'|'developers'|'publishers'|'newsletter'|'general';
export type UploadImageInput={file:File; folder?:MediaFolder; slug?:string; altText?:string; caption?:string};
export type UploadedImage={provider:'cloudinary'; publicId:string; url:string; secureUrl:string; resourceType:string; mimeType:string; width?:number; height?:number; bytes:number; originalName:string; filename:string};
export interface StorageProvider{uploadImage(input:UploadImageInput):Promise<UploadedImage>; deleteImage(publicId:string):Promise<void>; getImageUrl(publicId:string):string; getOptimizedImageUrl(publicIdOrUrl:string,options?:ImageTransformOptions):string; isConfigured():boolean; status():Promise<{provider:string; configured:boolean; connected:boolean}>;}
export type ImageTransformOptions={width?:number;height?:number;crop?:'fill'|'fit'|'limit'|'thumb';quality?:'auto'|number;format?:'auto'|string};
export const allowedImageTypes=new Set(['image/jpeg','image/png','image/webp','image/avif']);
export const allowedExtensions=new Set(['jpg','jpeg','png','webp','avif']);
export function validateImageFile(file:File){const ext=(file.name.split('.').pop()||'').toLowerCase(); if(!allowedImageTypes.has(file.type)) throw new Error('Unsupported image type'); if(!allowedExtensions.has(ext)) throw new Error('Unsupported image extension'); if(file.size>5_000_000) throw new Error('Image exceeds 5MB');}
