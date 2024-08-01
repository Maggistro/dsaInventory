import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';

open({
    filename: 'data/db.sqlite',
    driver: sqlite3.Database,
}).then(async (db) => {
    const migrations = JSON.parse(fs.readFileSync('data/migrations.json'));

    await db.run('CREATE TABLE IF NOT EXISTS migrations (id int, date int)');
    const migrationList = await db.all('SELECT * FROM migrations ORDER BY id ASC');

    for (let migrationId = 0; migrationId < Object.keys(migrations).length; migrationId++) {
        if (migrationList.find((row) => row.id === migrationId) !== undefined) {
            continue;
        }

        await Promise.all(
            migrations[migrationId].up.map(async (instruction) => {
                await db.run(instruction);
            }),
        );
        db.run(`INSERT INTO migrations VALUES (${migrationId}, ${Date.now()})`);
    }
});
