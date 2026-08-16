import { createCloudinaryStorage } from './cloudinary';
export const getStorage=(env:Env)=>createCloudinaryStorage(env);
export type { MediaFolder, UploadedImage, ImageTransformOptions } from './storage';
