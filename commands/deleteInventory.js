import { createInventoryChoices } from "./choices.js";

const DELETE_INVENTORY = 'deleteinventory';

const deleteInventoryDefinition = {
    name: DELETE_INVENTORY,
    description: 'Lösche ein inventar',
    options: [
      {
        type: 3,
        name: 'inventory',
        description: 'Inventarname',
        required: true,
        choices: createInventoryChoices(),
      }
    ],
    type: 1,
}

const deleteInventory = (data, userId, res) => {

}

export { DELETE_INVENTORY, deleteInventoryDefinition, deleteInventory }