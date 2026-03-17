// Updates backend/.env to use SQLite so backend and seed use prisma/dev.db
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '..', '.env');
const sqliteUrl = 'file:./prisma/dev.db';

let content = '';
try {
  content = readFileSync(envPath, 'utf8');
} catch (e) {
  content = '';
}

const line = `DATABASE_URL="${sqliteUrl}"`;
if (content.includes('DATABASE_URL=')) {
  content = content.replace(/DATABASE_URL=.*(?=\n|$)/m, line);
} else {
  content = (content.trimEnd() ? content + '\n' : '') + line + '\n';
}

writeFileSync(envPath, content);
console.log('Updated .env to use SQLite (file:./prisma/dev.db). Backend will use local DB.');
