import { getDb } from './getDb.js';

export const getAllInventories = async () => {
    return getDb().all('SELECT * from inventory');
};

export const getInventory = async (userId, name) => {
    // if name was given, ignore userId
    let result = [];
    if (name) {
        result = await getDb().all(
            `SELECT inventory.id as inv_id, inventory.name as inv_name, * FROM inventory LEFT JOIN item ON inventory.id = item.inventory WHERE inventory.name = '${name}'`,
        );
    } else {
        result = await getDb().all(
            `SELECT inventory.id as inv_id, inventory.name as inv_name, * FROM inventory LEFT JOIN item ON inventory.id = item.inventory WHERE (userId = '${userId}' AND active = 1)`,
        );
    }

    if (result.length === 0) {
        return null;
    }

    // build js object from result list
    return result.reduce(
        (inventory, entry) => {
            // no related items
            if (entry.id === null) {
                return inventory;
            }

            inventory.items.push({
                id: entry.id,
                name: entry.name,
                count: entry.count,
                weight: entry.weight,
                inventory: entry.inventory,
            });

            return inventory;
        },
        {
            id: result[0].inv_id,
            name: result[0].inv_name,
            userId: result[0].userId,
            active: result[0].active,
            shared: result[0].shared,
            items: [],
        },
    );
};

export const switchInventory = async (userId, name) => {
    await getDb().run(`UPDATE inventory SET active = 0 WHERE (userId = '${userId}' AND active = 1)`);
    return getDb().run(`UPDATE inventory SET active = 1 WHERE (userId = '${userId}' AND name = '${name}')`);
};

export const insertInventory = async (userId, name, shared) => {
    // Creating shared inventory does not switch active
    if (shared) {
        return getDb().run(
            `INSERT INTO inventory (userId, name, active, shared) VALUES ('${userId}', '${name}', 0, 1)`,
        );
    }

    // Free old active inventory and attach new one to user
    await getDb().run(`UPDATE inventory SET active = 0 WHERE (userId = '${userId}' AND active = 1)`);
    return getDb().run(`INSERT INTO inventory (userId, name, active) VALUES ('${userId}', '${name}', 1)`);
};

export const removeInventory = async (userId, name) => {
    return getDb().run(
        `DELETE FROM inventory WHERE (userId = '${userId}' AND name = '${name}') OR (name = '${name}' AND shared = 1)`,
    );
};
