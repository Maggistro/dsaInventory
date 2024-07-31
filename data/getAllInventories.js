import { getDb } from './getDb.js'

/**
 * @returns {Array}
 */
export const getAllInventories = () => {
    return getDb().inventories
}
