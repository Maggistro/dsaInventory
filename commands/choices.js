import { getInventoryByName } from "../data/getInventoryByName.js";
import { getAllInventories } from "../data/getAllInventories.js";

export const createItemChoices = (name) => {
    return getInventoryByName(name)?.items?.map(item => ({
        name: item.name,
        value: item.name
    })) && [];
}

export const createInventoryChoices = () => {
    return getAllInventories()
        .map(inventory => ({
            name: inventory.name,
            value: inventory.name
        }));
}
