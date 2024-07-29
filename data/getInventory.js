import { getDb } from "./getDb.js";

export const getInventory = (userId, name) => {
    const inventoryName = name ? name : getDb().activeInventories[userId];
    return getDb().inventories[inventoryName];
}
