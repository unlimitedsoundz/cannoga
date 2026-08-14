const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase env variables. Ensure .env.local contains NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function parseCSV(csvText) {
  const rows = [];
  let current = '';
  let row = [];
  let inQuotes = false;
  let i = 0;

  while (i < csvText.length) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(current);
      current = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i += 1;
      }
      row.push(current);
      rows.push(row);
      row = [];
      current = '';
    } else {
      current += char;
    }

    i += 1;
  }

  if (current !== '' || row.length > 0) {
    row.push(current);
    rows.push(row);
  }

  return rows;
}

function normalizeField(value) {
  if (value === undefined || value === null) return null;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

async function main() {
  const csvPath = process.argv[2];
  if (!csvPath) {
    console.error('Usage: node scripts/seed_courses_from_csv.js <path-to-csv>');
    process.exit(1);
  }

  const resolvedPath = path.resolve(csvPath);
  if (!fs.existsSync(resolvedPath)) {
    console.error(`CSV file not found: ${resolvedPath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(resolvedPath, 'utf8');
  const rows = parseCSV(content);
  if (rows.length < 2) {
    console.error('No rows found in CSV.');
    process.exit(1);
  }

  const header = rows[0].map((value) => value.trim());
  const dataRows = rows.slice(1);

  console.log(`Parsed ${dataRows.length} rows with ${header.length} columns.`);

  let importCount = 0;
  for (const row of dataRows) {
    if (row.every((cell) => normalizeField(cell) === null)) continue;

    const record = {};
    for (let j = 0; j < header.length; j += 1) {
      record[header[j]] = row[j] === undefined ? null : row[j];
    }

    const degreeLevelRaw = normalizeField(record.degreeLevel);
    const normalizedDegreeLevel = degreeLevelRaw
      ? ['BACHELOR', 'MASTER', 'DIPLOMA', 'CERTIFICATE'].includes(degreeLevelRaw.toUpperCase())
        ? degreeLevelRaw.toUpperCase()
        : degreeLevelRaw.toUpperCase() === 'CERTICACATE'
          ? 'CERTIFICATE'
          : null
      : null;

    const courseData = {
      id: normalizeField(record.id) || undefined,
      title: normalizeField(record.title) || undefined,
      slug: normalizeField(record.slug) || undefined,
      degreeLevel: normalizedDegreeLevel || undefined,
      duration: normalizeField(record.duration) || undefined,
      description: normalizeField(record.description) || undefined,
      language: normalizeField(record.language) || 'English',
      entryRequirements: normalizeField(record.entryRequirements) || undefined,
      minimumGrade: normalizeField(record.minimumGrade) || undefined,
      careerPaths: normalizeField(record.careerPaths) || undefined,
      imageUrl: normalizeField(record.imageUrl) || undefined,
      schoolId: normalizeField(record.schoolId) || undefined,
      departmentId: normalizeField(record.departmentId) || undefined,
    };

    const requiredMissing = ['id', 'title', 'slug', 'degreeLevel', 'duration', 'schoolId'].filter(
      (key) => !courseData[key]
    );
    if (requiredMissing.length > 0) {
      console.warn(`Skipping row because required fields are missing: ${requiredMissing.join(', ')}`, {
        row: record.title || record.slug,
        degreeLevel: record.degreeLevel,
      });
      continue;
    }

    const { data, error } = await supabase
      .from('Course')
      .upsert(courseData, { onConflict: 'id' })
      .select('id')
      .single();

    if (error) {
      console.error(`Failed to upsert course ${record.title || record.slug}:`, error.message || error);
      if (error.details) {
        console.error(error.details);
      }
    } else {
      console.log(`Imported: ${record.title || record.slug}`);
      importCount += 1;
    }
  }

  console.log(`Finished. Imported or updated ${importCount} courses.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
