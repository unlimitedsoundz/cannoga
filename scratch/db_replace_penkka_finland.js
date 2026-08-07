const { Client } = require('pg');

const connectionString = "postgresql://postgres.mrqzlmkdhzwvbpljikjz:Guiliababy21%23@aws-1-eu-west-3.pooler.supabase.com:5432/postgres";

async function main() {
    const client = new Client({ connectionString });
    try {
        await client.connect();
        console.log("Connected to Supabase Postgres database successfully.");

        // Query all tables and columns in the 'public' schema that are text or varchar
        const res = await client.query(`
            SELECT table_name, column_name 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
              AND data_type IN ('text', 'character varying')
        `);

        const columns = res.rows;
        console.log(`Found ${columns.length} text/varchar columns in public schema.`);

        let totalUpdatedRows = 0;

        for (const col of columns) {
            const tableName = col.table_name;
            const columnName = col.column_name;

            // Quote table and column names to handle mixed case/reserved words safely
            const quotedTable = `"${tableName}"`;
            const quotedCol = `"${columnName}"`;

            // Check if there are rows in this column containing "Penkka University", "Penkka", or "Canada"
            // We use simple LIKE queries
            const checkRes = await client.query(`
                SELECT COUNT(*) as count FROM ${quotedTable}
                WHERE ${quotedCol} ILIKE '%Penkka%' OR ${quotedCol} ILIKE '%Canada%'
            `).catch(err => {
                // Some tables/columns might be views, or fail due to other reasons - ignore them safely
                return null;
            });

            if (checkRes && parseInt(checkRes.rows[0].count) > 0) {
                const count = parseInt(checkRes.rows[0].count);
                console.log(`Found ${count} rows matching criteria in table ${quotedTable}, column ${quotedCol}`);

                // Perform update replacements:
                // 1. "Penkka University" -> "Cannoga College"
                // 2. "Penkka" -> "Cannoga" (for any other occurrences)
                // 3. "Canada" -> "Ottawa, Canada"
                // 4. "finland" -> "ottawa, canada" (and other casing cases)
                const updateQuery = `
                    UPDATE ${quotedTable}
                    SET ${quotedCol} = REPLACE(
                        REPLACE(
                            REPLACE(
                                REPLACE(
                                    REPLACE(
                                        REPLACE(
                                            ${quotedCol}, 
                                            'Penkka University', 'Cannoga College'
                                        ),
                                        'Penkka', 'Cannoga'
                                    ),
                                    'Canada', 'Ottawa, Canada'
                                ),
                                'finland', 'ottawa, canada'
                            ),
                            'CANLAND', 'OTTAWA, CANADA'
                        ),
                        'penkka', 'cannoga'
                    )
                    WHERE ${quotedCol} ILIKE '%Penkka%' OR ${quotedCol} ILIKE '%Canada%'
                `;

                const updateRes = await client.query(updateQuery);
                console.log(`Updated ${updateRes.rowCount} rows in ${quotedTable}.${quotedCol}`);
                totalUpdatedRows += updateRes.rowCount;
            }
        }

        console.log(`\nSuccess! Total updated tables/columns row counts: ${totalUpdatedRows}`);

    } catch (e) {
        console.error("Error running DB search and replace script:", e);
    } finally {
        await client.end();
    }
}

main();
