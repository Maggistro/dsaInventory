import fs from 'fs';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import {jest} from '@jest/globals'

jest.mock('../data/getDb.js', () => ({
    getDb: () => open({
        filename: 'test/testDb.sqlite',
        driver: sqlite3.Database,
    })
}));

(async () => {
    fs.rm('test/testDb.sqlite', () => {
        open({
            filename: 'test/testDb.sqlite',
            driver: sqlite3.Database,
        }).then(async db => {
            const migrations = JSON.parse(fs.readFileSync('data/migrations.json'));
    
            await db.run("CREATE TABLE migrations (id int, date int)");
    
            for (let migrationId = 0; migrationId < Object.keys(migrations).length; migrationId++) {
                await Promise.all(migrations[migrationId].up.map(async instruction => {
                    await db.run(instruction);
                }))
                db.run(`INSERT INTO migrations VALUES (${migrationId}, ${Date.now()})`);
            };
    
            const sqlInstructions = fs.readFileSync('test/fixtures.sql', 'utf-8');
            await db.exec(sqlInstructions);
        })
    });
})()