import fs from 'fs'

let db = JSON.parse(fs.readFileSync('./data/db.json'));

/**
 * 
 * @returns {object}
 */
export const getDb = () => {
    return db;
}
