import { getDb } from './getDb.js'

/**
 * @returns {Array}
 */
export const getAllInventories = () => {
    return getDb().all("SELECT * from inventory");
}

export const getInventory = (userId, name) => {
    // if name was given, ignore userId
    if (name) {
        return getDb().get(`SELECT * FROM inventory WHERE name = ${name}`);
    }
    return getDb().get(`SELECT * FROM inventory WHERE (userId = ${userId} AND active = 1)`)
}

export const switchInventory = async (userId, name) => {
    await getDb().run(`UPDATE TABLE inventory SET active = 0 WHERE (userId = ${userId} AND active = 1)`);
    return getDb().run(`UPDATE TABLE inventory SET active = 1 WHERE (userId = ${userId} AND name = ${name})`);
}

export const insertInventory = async (userId, name, shared) => {
    // Creating shared inventory does not switch active
    if (shared) {
        return getDb().run(`INSERT INTO inventory (userId, name, active, shared) VALUES (${userId}, ${name}, 0, 1)`);
    }

    // Free old active inventory and attach new one to user
    await getDb().run(`UPDATE TABLE inventory SET active = 0 WHERE (userId = ${userId} AND active = 1)`);
    return getDb().run(`INSERT INTO inventory (userId, name, active) VALUES (${userId}, ${name}, 1)`);
}

export const removeInventory = async (userId, name) => {
    return getDb().run(`DELETE FROM inventory WHERE (userId = ${userId} AND name = ${name}) OR (name = ${name} AND shared = 1)`);
}