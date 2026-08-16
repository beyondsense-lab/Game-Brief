import { env } from 'cloudflare:workers';
import { now, readingTime, slugify } from '@/lib/utils/slug';
import { hashPassword } from '@/lib/auth/session';

type AdminCtx = {
  locals: App.Locals;
};

export async function adminAll(ctx: AdminCtx, table: string) {
  return (await env.DB.prepare(`SELECT * FROM ${table} ORDER BY updated_at DESC, created_at DESC`).all()).results || [];
}

export async function dashboardStats(ctx: AdminCtx) {
  const db = env.DB;
  const names = ['articles', 'games', 'reviews', 'guides', 'newsletter_subscribers', 'newsletter_issues'];
  const out: Record<string, number> = {};

  for (const n of names) {
    const result = await db.prepare(`SELECT count(*) as c FROM ${n}`).first<{ c: number }>();
    out[n] = result?.c ?? 0;
  }

  for (const s of ['draft', 'published', 'scheduled']) {
    const result = await db.prepare('SELECT count(*) as c FROM articles WHERE status=?').bind(s).first<{ c: number }>();
    out[s] = result?.c ?? 0;
  }

  return out;
}

export async function saveArticle(ctx: AdminCtx, form: FormData, id?: string) {
  const db = env.DB;
  const n = now();
  const title = String(form.get('title') || 'Untitled Brief');
  const data = [
    title,
    String(form.get('slug') || slugify(title)),
    String(form.get('excerpt') || ''),
    String(form.get('content') || ''),
    String(form.get('heroImage') || ''),
    String(form.get('heroImageAlt') || ''),
    Number(form.get('authorId') || 0) || null,
    Number(form.get('categoryId') || 0) || null,
    Number(form.get('gameId') || 0) || null,
    String(form.get('status') || 'draft'),
    String(form.get('publishedAt') || ''),
    String(form.get('scheduledAt') || ''),
    readingTime(String(form.get('content') || '')),
    form.get('featured') === 'on' ? 1 : 0,
    form.get('trending') === 'on' ? 1 : 0,
    String(form.get('seoTitle') || title),
    String(form.get('seoDescription') || form.get('excerpt') || ''),
    String(form.get('canonicalUrl') || ''),
    String(form.get('ogImage') || ''),
    form.get('allowIndexing') === 'on' ? 1 : 0,
  ];

  if (id) {
    await db
      .prepare(
        `UPDATE articles SET title=?,slug=?,excerpt=?,content=?,hero_image=?,hero_image_alt=?,author_id=?,category_id=?,game_id=?,status=?,published_at=?,scheduled_at=?,reading_time=?,featured=?,trending=?,seo_title=?,seo_description=?,canonical_url=?,og_image=?,allow_indexing=?,updated_at=? WHERE id=?`
      )
      .bind(...data, n, id)
      .run();
    return id;
  }

  const r = await db
    .prepare(
      `INSERT INTO articles(title,slug,excerpt,content,hero_image,hero_image_alt,author_id,category_id,game_id,status,published_at,scheduled_at,reading_time,featured,trending,seo_title,seo_description,canonical_url,og_image,allow_indexing,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    )
    .bind(...data, n, n)
    .run();

  return (r.meta as any).last_row_id;
}

export async function ensureEsportsCategory() {
  const db = env.DB;
  let cat = await db.prepare(`SELECT * FROM categories WHERE slug='esports'`).first<any>();

  if (!cat) {
    const n = now();
    const r = await db
      .prepare(
        `INSERT INTO categories(name,slug,description,seo_title,seo_description,created_at,updated_at) VALUES(?,?,?,?,?,?,?)`
      )
      .bind(
        'Esports',
        'esports',
        'Competitive gaming, tournaments and esports industry news.',
        'Esports — GAME//BRIEF',
        'GAME//BRIEF esports coverage: tournaments, teams and competitive gaming news.',
        n,
        n
      )
      .run();
    cat = await db
      .prepare(`SELECT * FROM categories WHERE id=?`)
      .bind((r.meta as any).last_row_id)
      .first<any>();
  }

  return cat;
}

export async function saveCategory(ctx: AdminCtx, form: FormData, id?: string) {
  const db = env.DB;
  const n = now();
  const name = String(form.get('name') || 'Untitled category');
  const data = [
    name,
    String(form.get('slug') || slugify(name)),
    String(form.get('description') || ''),
    Number(form.get('parentId') || 0) || null,
    String(form.get('seoTitle') || name),
    String(form.get('seoDescription') || form.get('description') || ''),
  ];

  if (id) {
    await db
      .prepare(
        `UPDATE categories SET name=?,slug=?,description=?,parent_id=?,seo_title=?,seo_description=?,updated_at=? WHERE id=?`
      )
      .bind(...data, n, id)
      .run();
    return id;
  }

  const r = await db
    .prepare(
      `INSERT INTO categories(name,slug,description,parent_id,seo_title,seo_description,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?)`
    )
    .bind(...data, n, n)
    .run();

  return (r.meta as any).last_row_id;
}

export async function saveAccount(userId: number, form: FormData) {
  const db = env.DB;
  const name = String(form.get('name') || '');
  const email = String(form.get('email') || '').toLowerCase();
  const newPassword = String(form.get('newPassword') || '');

  if (newPassword) {
    const hash = await hashPassword(newPassword);
    await db
      .prepare(`UPDATE users SET name=?,email=?,password_hash=?,updated_at=? WHERE id=?`)
      .bind(name, email, hash, now(), userId)
      .run();
  } else {
    await db
      .prepare(`UPDATE users SET name=?,email=?,updated_at=? WHERE id=?`)
      .bind(name, email, now(), userId)
      .run();
  }
}

export async function saveTag(ctx: AdminCtx, form: FormData, id?: string) {
  const db = env.DB;
  const n = now();
  const name = String(form.get('name') || 'Untitled tag');
  const data = [
    name,
    String(form.get('slug') || slugify(name)),
    String(form.get('description') || ''),
    String(form.get('seoTitle') || name),
    String(form.get('seoDescription') || form.get('description') || ''),
  ];

  if (id) {
    await db
      .prepare(
        `UPDATE tags SET name=?,slug=?,description=?,seo_title=?,seo_description=?,updated_at=? WHERE id=?`
      )
      .bind(...data, n, id)
      .run();
    return id;
  }

  const r = await db
    .prepare(
      `INSERT INTO tags(name,slug,description,seo_title,seo_description,created_at,updated_at) VALUES(?,?,?,?,?,?,?)`
    )
    .bind(...data, n, n)
    .run();

  return (r.meta as any).last_row_id;
}

export async function savePlatform(ctx: AdminCtx, form: FormData, id?: string) {
  const db = env.DB;
  const name = String(form.get('name') || 'Untitled platform');
  const data = [
    name,
    String(form.get('slug') || slugify(name)),
    String(form.get('description') || ''),
    String(form.get('logo') || ''),
    String(form.get('seoTitle') || name),
    String(form.get('seoDescription') || form.get('description') || ''),
  ];

  if (id) {
    await db
      .prepare(`UPDATE platforms SET name=?,slug=?,description=?,logo=?,seo_title=?,seo_description=? WHERE id=?`)
      .bind(...data, id)
      .run();
    return id;
  }

  const r = await db
    .prepare(`INSERT INTO platforms(name,slug,description,logo,seo_title,seo_description) VALUES(?,?,?,?,?,?)`)
    .bind(...data)
    .run();

  return (r.meta as any).last_row_id;
}

export async function saveDeveloper(ctx: AdminCtx, form: FormData, id?: string) {
  const db = env.DB;
  const name = String(form.get('name') || 'Untitled developer');
  const data = [
    name,
    String(form.get('slug') || slugify(name)),
    String(form.get('description') || ''),
    String(form.get('logo') || ''),
    String(form.get('website') || ''),
    String(form.get('seoTitle') || name),
    String(form.get('seoDescription') || form.get('description') || ''),
  ];

  if (id) {
    await db
      .prepare(`UPDATE developers SET name=?,slug=?,description=?,logo=?,website=?,seo_title=?,seo_description=? WHERE id=?`)
      .bind(...data, id)
      .run();
    return id;
  }

  const r = await db
    .prepare(`INSERT INTO developers(name,slug,description,logo,website,seo_title,seo_description) VALUES(?,?,?,?,?,?,?)`)
    .bind(...data)
    .run();

  return (r.meta as any).last_row_id;
}

export async function saveAuthor(ctx: AdminCtx, form: FormData, id?: string) {
  const db = env.DB;
  const n = now();
  const name = String(form.get('name') || 'Untitled author');
  const data = [
    name,
    String(form.get('slug') || slugify(name)),
    String(form.get('bio') || ''),
    String(form.get('avatar') || ''),
    String(form.get('website') || ''),
    String(form.get('socialLinks') || ''),
    String(form.get('seoTitle') || name),
    String(form.get('seoDescription') || form.get('bio') || ''),
  ];

  if (id) {
    await db
      .prepare(
        `UPDATE authors SET name=?,slug=?,bio=?,avatar=?,website=?,social_links=?,seo_title=?,seo_description=?,updated_at=? WHERE id=?`
      )
      .bind(...data, n, id)
      .run();
    return id;
  }

  const r = await db
    .prepare(
      `INSERT INTO authors(name,slug,bio,avatar,website,social_links,seo_title,seo_description,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?)`
    )
    .bind(...data, n, n)
    .run();

  return (r.meta as any).last_row_id;
}

export async function saveGame(ctx: AdminCtx, form: FormData, id?: string) {
  const db = env.DB;
  const n = now();
  const name = String(form.get('name') || 'Untitled game');
  const data = [
    name,
    String(form.get('slug') || slugify(name)),
    String(form.get('description') || ''),
    String(form.get('coverImage') || ''),
    String(form.get('coverImageAlt') || ''),
    String(form.get('releaseDate') || ''),
    String(form.get('genre') || ''),
    Number(form.get('developerId') || 0) || null,
    String(form.get('officialWebsite') || ''),
    String(form.get('seoTitle') || name),
    String(form.get('seoDescription') || form.get('description') || ''),
  ];

  let gameId: string | number;

  if (id) {
    await db
      .prepare(
        `UPDATE games SET name=?,slug=?,description=?,cover_image=?,cover_image_alt=?,release_date=?,genre=?,developer_id=?,official_website=?,seo_title=?,seo_description=?,updated_at=? WHERE id=?`
      )
      .bind(...data, n, id)
      .run();
    gameId = id;
  } else {
    const r = await db
      .prepare(
        `INSERT INTO games(name,slug,description,cover_image,cover_image_alt,release_date,genre,developer_id,official_website,seo_title,seo_description,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`
      )
      .bind(...data, n, n)
      .run();
    gameId = (r.meta as any).last_row_id;
  }

  const platformIds = form
    .getAll('platformIds')
    .map((v) => Number(v))
    .filter((v) => Number.isInteger(v) && v > 0);

  await db.prepare(`DELETE FROM game_platforms WHERE game_id=?`).bind(gameId).run();
  for (const platformId of platformIds) {
    await db
      .prepare(`INSERT OR IGNORE INTO game_platforms(game_id,platform_id) VALUES(?,?)`)
      .bind(gameId, platformId)
      .run();
  }

  return gameId;
}

export async function saveReview(ctx: AdminCtx, form: FormData, id?: string) {
  const db = env.DB;
  const n = now();
  const data = [
    Number(form.get('articleId') || 0) || null,
    Number(form.get('gameId') || 0) || null,
    Number(form.get('score') || 0) || null,
    String(form.get('verdict') || ''),
    String(form.get('pros') || ''),
    String(form.get('cons') || ''),
    String(form.get('platform') || ''),
  ];

  if (id) {
    await db
      .prepare(
        `UPDATE reviews SET article_id=?,game_id=?,score=?,verdict=?,pros=?,cons=?,platform=?,updated_at=? WHERE id=?`
      )
      .bind(...data, n, id)
      .run();
    return id;
  }

  const r = await db
    .prepare(
      `INSERT INTO reviews(article_id,game_id,score,verdict,pros,cons,platform,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?)`
    )
    .bind(...data, n, n)
    .run();

  return (r.meta as any).last_row_id;
}

export async function saveGuide(ctx: AdminCtx, form: FormData, id?: string) {
  const db = env.DB;
  const n = now();
  const title = String(form.get('title') || 'Untitled guide');
  const data = [
    title,
    String(form.get('slug') || slugify(title)),
    String(form.get('content') || ''),
    String(form.get('excerpt') || ''),
    String(form.get('heroImage') || ''),
    Number(form.get('gameId') || 0) || null,
    Number(form.get('authorId') || 0) || null,
    String(form.get('category') || ''),
    String(form.get('status') || 'draft'),
    String(form.get('publishedAt') || ''),
    String(form.get('seoTitle') || title),
    String(form.get('seoDescription') || form.get('excerpt') || ''),
    String(form.get('canonicalUrl') || ''),
  ];

  if (id) {
    await db
      .prepare(
        `UPDATE guides SET title=?,slug=?,content=?,excerpt=?,hero_image=?,game_id=?,author_id=?,category=?,status=?,published_at=?,seo_title=?,seo_description=?,canonical_url=?,updated_at=? WHERE id=?`
      )
      .bind(...data, n, id)
      .run();
    return id;
  }

  const r = await db
    .prepare(
      `INSERT INTO guides(title,slug,content,excerpt,hero_image,game_id,author_id,category,status,published_at,seo_title,seo_description,canonical_url,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    )
    .bind(...data, n)
    .run();

  return (r.meta as any).last_row_id;
}
