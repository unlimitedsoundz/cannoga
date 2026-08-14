const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const connectionString = 'postgresql://postgres.lbkrzyqpdqgtqbodkcyi:Guiliababy21@aws-0-eu-west-1.pooler.supabase.com:6543/postgres';
const schemaPath = path.join(__dirname, 'schema.sql');

function splitSql(sql) {
  const statements = [];
  let current = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inDollar = false;
  let dollarTag = '';

  for (let i = 0; i < sql.length; i++) {
    const ch = sql[i];
    const next = sql[i + 1];

    if (!inSingleQuote && !inDoubleQuote && ch === '$') {
      const rest = sql.slice(i);
      const match = rest.match(/^\$[a-zA-Z0-9_]*\$/);
      if (match) {
        const tag = match[0];
        if (!inDollar) {
          inDollar = true;
          dollarTag = tag;
          current += tag;
          i += tag.length - 1;
          continue;
        } else if (tag === dollarTag) {
          inDollar = false;
          dollarTag = '';
          current += tag;
          i += tag.length - 1;
          continue;
        }
      }
    }

    if (!inDollar) {
      if (ch === "'" && !inDoubleQuote) {
        inSingleQuote = !inSingleQuote;
      } else if (ch === '"' && !inSingleQuote) {
        inDoubleQuote = !inDoubleQuote;
      }
    }

    if (ch === ';' && !inSingleQuote && !inDoubleQuote && !inDollar) {
      statements.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) statements.push(current.trim());
  return statements;
}

async function main() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    const sql = fs.readFileSync(schemaPath, 'utf8');
    const statements = splitSql(sql);
    console.log(`Loaded ${statements.length} SQL statements from schema.sql`);

    for (const statement of statements) {
      const trimmed = statement.trim();
      if (!trimmed) continue;
      try {
        await client.query(trimmed);
      } catch (err) {
        const msg = (err.message || '').toLowerCase();
        if (msg.includes('does not exist') || msg.includes('already exists') || msg.includes('duplicate') || msg.includes('cannot drop index because it does not exist')) {
          console.log('Ignored expected warning:', err.message.split('\n')[0]);
          continue;
        }
        console.error('Failed statement:', trimmed.slice(0, 200));
        throw err;
      }
    }

    console.log('Applying system_settings table...');
    await client.query(`CREATE TABLE IF NOT EXISTS "system_settings" (
      "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "key" TEXT UNIQUE NOT NULL,
      "value" TEXT NOT NULL,
      "description" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`);

    console.log('Created system_settings table successfully.');
  } catch (err) {
    console.error('Schema apply error:', err.message || err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
