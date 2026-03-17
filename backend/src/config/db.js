import { fileURLToPath } from 'url';
import { pathToFileURL } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// When using SQLite (db:use-sqlite), load client from separate output to avoid EPERM when MySQL client is in use
const url = process.env.DATABASE_URL || '';
const useSqliteClient = url.startsWith('file:');

const clientMod = useSqliteClient
  ? await import(pathToFileURL(join(__dirname, '..', '..', 'node_modules', '.prisma', 'client-sqlite', 'index.js')).href)
  : await import('@prisma/client');

const prisma = new clientMod.PrismaClient();

export default prisma;
