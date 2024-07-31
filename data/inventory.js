import { getDb } from '@data/getDb.js'

export const getAllInventories = () => {
    // do not resolve items
    return getDb().all("SELECT * from inventory");
}

export const getInventory = async (userId, name) => {
    // if name was given, ignore userId
    let result = [];
    if (name) {
        result = await getDb().all(`SELECT * FROM inventory LEFT JOIN item ON inventory.id = item.inventory WHERE invenvory.name = '${name}'`);
    } else {
        result = await getDb().all(`SELECT * FROM inventory WHERE (userId = '${userId}' AND active = 1)`);
    }

    console.log(getDb().config);
    if (result.length === 0) {
        return null;
    }

    // build js object from result list
    return result.reduce((inventory, entry) => {
        inventory.items.push({
            id: entry.id,
            name: entry.name,
            count: entry.count,
            weight: entry.weight,
            inventory: entry.inventory,
        });

        return inventory;
    }, {
        id: result[0].id,
        name: result[0].name,
        userId: result[0].userId,
        active: result[0].active,
        shared: result[0].shared,
        items: [],
    });
}

export const switchInventory = async (userId, name) => {
    await getDb().run(`UPDATE TABLE inventory SET active = 0 WHERE (userId = '${userId}' AND active = 1)`);
    return getDb().run(`UPDATE TABLE inventory SET active = 1 WHERE (userId = '${userId}' AND name = '${name}')`);
}

export const insertInventory = async (userId, name, shared) => {
    // Creating shared inventory does not switch active
    if (shared) {
        return getDb().run(`INSERT INTO inventory (userId, name, active, shared) VALUES ('${userId}', '${name}', 0, 1)`);
    }

    // Free old active inventory and attach new one to user
    await getDb().run(`UPDATE TABLE inventory SET active = 0 WHERE (userId = '${userId}' AND active = 1)`);
    return getDb().run(`INSERT INTO inventory (userId, name, active) VALUES ('${userId}', '${name}', 1)`);
}

export const removeInventory = async (userId, name) => {
    return getDb().run(`DELETE FROM inventory WHERE (userId = '${userId}' AND name = '${name}') OR (name = '${name}' AND shared = 1)`);
}