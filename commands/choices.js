import { getInventory } from '../data/getInventory.js';
import { getAllInventories } from '../data/getAllInventories.js';

export const createItemChoices = (name) => {
    return (
        getInventory('', name)?.items?.map((item) => ({
            name: item.name,
            value: item.name,
        })) && []
    );
};

export const createInventoryChoices = () => {
    return Object.values(getAllInventories()).map((inventory) => ({
        name: inventory.name,
        value: inventory.name,
    }));
};
