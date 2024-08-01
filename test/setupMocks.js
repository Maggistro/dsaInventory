import { jest } from '@jest/globals';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const db = await open({
    filename: 'test/testDb.sqlite',
    driver: sqlite3.Database,
});

jest.unstable_mockModule('../data/getDb.js', () => ({
    __esModule: true,
    getDb: () => db,
}));
