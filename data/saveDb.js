import fs from 'fs'
import { getDb } from './getDb.js';

export const saveDb = () => {
    console.log(JSON.stringify(getDb()));
    fs.writeFileSync('./data/db.json', JSON.stringify(getDb()));
}