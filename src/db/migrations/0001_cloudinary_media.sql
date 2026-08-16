CREATE TABLE media_cloudinary(id integer primary key autoincrement,provider text not null default 'cloudinary',public_id text,filename text not null,original_name text not null,url text not null,secure_url text,resource_type text default 'image',mime_type text not null,width integer,height integer,bytes integer,alt_text text,caption text,uploaded_by integer references users(id),created_at text not null,updated_at text);
INSERT INTO media_cloudinary(id,provider,public_id,filename,original_name,url,secure_url,resource_type,mime_type,width,height,bytes,alt_text,caption,uploaded_by,created_at,updated_at)
SELECT id,'legacy-r2',NULL,filename,original_name,url,url,'image',mime_type,width,height,size,alt_text,caption,uploaded_by,created_at,NULL FROM media;
DROP TABLE media;
ALTER TABLE media_cloudinary RENAME TO media;
CREATE INDEX IF NOT EXISTS media_provider_idx ON media(provider);
CREATE INDEX IF NOT EXISTS media_public_id_idx ON media(public_id);
