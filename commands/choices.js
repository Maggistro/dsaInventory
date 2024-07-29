import { getInventoryByName } from "../data/getInventoryByName.js";
import { getAllInventories } from "../data/getAllInventories.js";

export const createItemChoices = (name) => {
    return getInventoryByName(name)?.items?.map(item => ({
        name: item.name,
        value: item.name
    })) && [];
}

export const createInventoryChoices = (userId) => {
    return getAllInventories()
        .filter(inventory => inventory.userId === userId || inventory.shared)
        .map(inventory => ({
            name: inventory.name,
            value: inventory.name
        }));
}
