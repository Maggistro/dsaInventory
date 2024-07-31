import { getDb } from './getDb.js'

export const saveDb = () => {
    getDb().close()
}
