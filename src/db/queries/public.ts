import { env } from 'cloudflare:workers';

export type Ctx = {
  locals: App.Locals;
};

const safe = <T>(p: Promise<T>, fallback: T): Promise<T> =>
  p.catch(() => fallback);

export async function all<T = any>(
  ctx: Ctx,
  sql: string,
  ...params: any[]
): Promise<T[]> {
  return safe(
    env.DB
      .prepare(sql)
      .bind(...params)
      .all<T>()
      .then((r: D1Result<T>) => r.results || []),
    []
  );
}

export async function first<T = any>(
  ctx: Ctx,
  sql: string,
  ...params: any[]
): Promise<T | null> {
  return safe(
    env.DB
      .prepare(sql)
      .bind(...params)
      .first<T>(),
    null
  );
}

export const publishedWhere =
  "status='published' AND (published_at IS NULL OR published_at <= datetime('now')) AND allow_indexing=1";

export const getPublishedArticles = (
  ctx: Ctx,
  limit = 12
) =>
  all(
    ctx,
    `SELECT a.*, 
      au.name author_name,
      au.slug author_slug,
      c.name category_name,
      c.slug category_slug
     FROM articles a
     LEFT JOIN authors au ON au.id=a.author_id
     LEFT JOIN categories c ON c.id=a.category_id
     WHERE ${publishedWhere}
     ORDER BY published_at DESC
     LIMIT ?`,
    limit
  );

export const getFeaturedArticles = (ctx: Ctx) =>
  all(
    ctx,
    `SELECT *
     FROM articles
     WHERE ${publishedWhere}
       AND featured=1
     ORDER BY published_at DESC
     LIMIT 4`
  );

export const getTrendingArticles = (ctx: Ctx) =>
  all(
    ctx,
    `SELECT *
     FROM articles
     WHERE ${publishedWhere}
     ORDER BY trending DESC, featured DESC, published_at DESC
     LIMIT 6`
  );

export const getArticleBySlug = (
  ctx: Ctx,
  slug: string
) =>
  first(
    ctx,
    `SELECT a.*,
      au.name author_name,
      au.slug author_slug,
      au.bio author_bio,
      c.name category_name,
      c.slug category_slug,
      g.name game_name,
      g.slug game_slug
     FROM articles a
     LEFT JOIN authors au ON au.id=a.author_id
     LEFT JOIN categories c ON c.id=a.category_id
     LEFT JOIN games g ON g.id=a.game_id
     WHERE a.slug=?
       AND ${publishedWhere}`,
    slug
  );

export const getGames = (
  ctx: Ctx,
  limit = 24
) =>
  all(
    ctx,
    `SELECT g.*,
      d.name developer_name,
      d.slug developer_slug
     FROM games g
     LEFT JOIN developers d ON d.id=g.developer_id
     ORDER BY release_date IS NULL, release_date
     LIMIT ?`,
    limit
  );

export const getGameBySlug = (
  ctx: Ctx,
  slug: string
) =>
  first(
    ctx,
    `SELECT g.*,
      d.name developer_name,
      d.slug developer_slug
     FROM games g
     LEFT JOIN developers d ON d.id=g.developer_id
     WHERE g.slug=?`,
    slug
  );

export const getDevelopers = (ctx: Ctx) =>
  all(ctx, `SELECT * FROM developers ORDER BY name ASC`);

export const getDeveloperBySlug = (
  ctx: Ctx,
  slug: string
) =>
  first(ctx, `SELECT * FROM developers WHERE slug=?`, slug);

export const getGamesByDeveloper = (
  ctx: Ctx,
  developerId: number,
  limit = 24
) =>
  all(
    ctx,
    `SELECT * FROM games WHERE developer_id=? ORDER BY release_date IS NULL, release_date LIMIT ?`,
    developerId,
    limit
  );

export const getTags = (ctx: Ctx) =>
  all(ctx, `SELECT * FROM tags ORDER BY name ASC`);

export const getTagBySlug = (
  ctx: Ctx,
  slug: string
) =>
  first(ctx, `SELECT * FROM tags WHERE slug=?`, slug);

export const getArticlesByTag = (
  ctx: Ctx,
  tagId: number,
  limit = 24
) =>
  all(
    ctx,
    `SELECT a.*,
      au.name author_name,
      au.slug author_slug,
      c.name category_name,
      c.slug category_slug
     FROM articles a
     JOIN article_tags at ON at.article_id=a.id
     LEFT JOIN authors au ON au.id=a.author_id
     LEFT JOIN categories c ON c.id=a.category_id
     WHERE at.tag_id=?
       AND ${publishedWhere}
     ORDER BY a.published_at DESC
     LIMIT ?`,
    tagId,
    limit
  );

export const getCategories = (ctx: Ctx) =>
  all(
    ctx,
    `SELECT c.*, p.name parent_name, p.slug parent_slug
     FROM categories c
     LEFT JOIN categories p ON p.id=c.parent_id
     ORDER BY c.name ASC`
  );

export const getCategoryBySlug = (
  ctx: Ctx,
  slug: string
) =>
  first(
    ctx,
    `SELECT c.*, p.name parent_name, p.slug parent_slug
     FROM categories c
     LEFT JOIN categories p ON p.id=c.parent_id
     WHERE c.slug=?`,
    slug
  );

export const getArticlesByCategory = (
  ctx: Ctx,
  categoryId: number,
  limit = 24
) =>
  all(
    ctx,
    `SELECT a.*,
      au.name author_name,
      au.slug author_slug,
      c.name category_name,
      c.slug category_slug
     FROM articles a
     LEFT JOIN authors au ON au.id=a.author_id
     LEFT JOIN categories c ON c.id=a.category_id
     WHERE a.category_id=?
       AND ${publishedWhere}
     ORDER BY a.published_at DESC
     LIMIT ?`,
    categoryId,
    limit
  );

export const getAuthors = (ctx: Ctx) =>
  all(ctx, `SELECT * FROM authors ORDER BY name ASC`);

export const getAuthorBySlug = (
  ctx: Ctx,
  slug: string
) =>
  first(ctx, `SELECT * FROM authors WHERE slug=?`, slug);

export const getArticlesByAuthor = (
  ctx: Ctx,
  authorId: number,
  limit = 24
) =>
  all(
    ctx,
    `SELECT a.*,
      au.name author_name,
      au.slug author_slug,
      c.name category_name,
      c.slug category_slug
     FROM articles a
     LEFT JOIN authors au ON au.id=a.author_id
     LEFT JOIN categories c ON c.id=a.category_id
     WHERE a.author_id=?
       AND ${publishedWhere}
     ORDER BY a.published_at DESC
     LIMIT ?`,
    authorId,
    limit
  );

export const getPlatforms = (ctx: Ctx) =>
  all(ctx, `SELECT * FROM platforms ORDER BY name ASC`);

export const getPlatformBySlug = (
  ctx: Ctx,
  slug: string
) =>
  first(ctx, `SELECT * FROM platforms WHERE slug=?`, slug);

export const getArticlesByPlatform = (
  ctx: Ctx,
  platformId: number,
  limit = 24
) =>
  all(
    ctx,
    `SELECT DISTINCT a.*,
      au.name author_name,
      au.slug author_slug,
      c.name category_name,
      c.slug category_slug
     FROM articles a
     JOIN games g ON g.id=a.game_id
     JOIN game_platforms gp ON gp.game_id=g.id
     LEFT JOIN authors au ON au.id=a.author_id
     LEFT JOIN categories c ON c.id=a.category_id
     WHERE gp.platform_id=?
       AND ${publishedWhere}
     ORDER BY a.published_at DESC
     LIMIT ?`,
    platformId,
    limit
  );

export const getArticlesByGame = (
  ctx: Ctx,
  gameId: number,
  limit = 24
) =>
  all(
    ctx,
    `SELECT a.*,
      au.name author_name,
      au.slug author_slug,
      c.name category_name,
      c.slug category_slug
     FROM articles a
     LEFT JOIN authors au ON au.id=a.author_id
     LEFT JOIN categories c ON c.id=a.category_id
     WHERE a.game_id=?
       AND ${publishedWhere}
     ORDER BY a.published_at DESC
     LIMIT ?`,
    gameId,
    limit
  );

export const getPlatformsForGame = (
  ctx: Ctx,
  gameId: number
) =>
  all(
    ctx,
    `SELECT p.*
     FROM platforms p
     JOIN game_platforms gp ON gp.platform_id=p.id
     WHERE gp.game_id=?
     ORDER BY p.name ASC`,
    gameId
  );

export const getReviews = (
  ctx: Ctx,
  limit = 24
) =>
  all(
    ctx,
    `SELECT r.*,
      a.title article_title,
      a.slug article_slug,
      a.hero_image article_hero_image,
      a.hero_image_alt article_hero_image_alt,
      a.published_at article_published_at,
      g.name game_name,
      g.slug game_slug
     FROM reviews r
     JOIN articles a ON a.id=r.article_id
     LEFT JOIN games g ON g.id=r.game_id
     WHERE a.status='published'
     ORDER BY a.published_at DESC
     LIMIT ?`,
    limit
  );

export const searchAll = (
  ctx: Ctx,
  q: string
) =>
  all(
    ctx,
    `SELECT
      'news' type,
      title,
      slug,
      excerpt
     FROM articles
     WHERE ${publishedWhere}
       AND (title LIKE ? OR excerpt LIKE ?)

     UNION ALL

     SELECT
      'games' type,
      name,
      slug,
      description
     FROM games
     WHERE name LIKE ? OR description LIKE ?

     LIMIT 30`,
    ...Array(4).fill(`%${q}%`)
  );
