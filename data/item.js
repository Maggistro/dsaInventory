import { getDb } from './getDb.js';

export const insertItem = async (inventoryId, name, count, weight) => {
    return getDb().run(
        `INSERT INTO item (inventory, name, count, weight) VALUES ('${inventoryId}', '${name}', '${count}', '${weight}')`,
    );
};

export const updateItem = async (id, count, weight) => {
    return getDb().run(`UPDATE item SET count = ${count}, weight = '${weight}' WHERE id = '${id}'`);
};

export const removeItemByName = async (inventoryId, name) => {
    return getDb().run(`DELETE FROM item WHERE inventory = '${inventoryId}' AND name = '${name}'`);
};

export const getItemByName = async (inventoryId, name) => {
    return getDb().get(`SELECT * FROM item WHERE inventory = ${inventoryId} AND name = '${name}'`);
};

export const suggestItems = async (userId, start) => {
    return getDb().all(`SELECT item.* FROM item INNER JOIN inventory ON inventory.id = item.inventory WHERE userId = '${userId}' AND inventory.active = 1 AND item.name LIKE '%${start}%' LIMIT 25`);
};
