import { getDb } from "./getDb.js";

export const getInventoryByName = (name) => {
    return getDb().inventories[name];
}
