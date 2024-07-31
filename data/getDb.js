import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const db = await open({
    filename: 'data/db.sqlite',
    driver: sqlite3.Database
});

/**
 *
 * @returns {object}
 */
export const getDb = () => {
    return db;
}
