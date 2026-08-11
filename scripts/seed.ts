import { hashPassword } from '../src/lib/auth/session';
console.log('Seed with Wrangler SQL after migrations. Admin password hash for ADMIN_PASSWORD=change-me-locally:', await hashPassword('change-me-locally'));
