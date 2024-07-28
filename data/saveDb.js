import fs from 'fs'
import { getDb } from './getDb.js';

export const saveDb = () => {
    fs.writeFileSync('./data/db.json', JSON.stringify(getDb()));
}