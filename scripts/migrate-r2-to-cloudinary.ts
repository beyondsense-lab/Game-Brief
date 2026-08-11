/**
 * Manual R2-to-Cloudinary migration plan for deployments that already used R2.
 * This repo no longer binds R2 at runtime; run this script only from a controlled
 * maintenance environment where you can read legacy objects and update D1.
 * Dry-run is the default. This script intentionally never deletes source R2 files.
 */
const dryRun=!process.argv.includes('--apply');
console.log(`R2 to Cloudinary migration utility (${dryRun?'dry-run':'apply'}).`);
console.log('Steps: select media rows with provider=legacy-r2, fetch each legacy object from verified storage, upload through the Cloudinary storage API, update provider/public_id/secure_url/bytes, log failures, and do not delete originals.');
console.log('Wire this script to your production D1/R2 access only if legacy production media exists.');
