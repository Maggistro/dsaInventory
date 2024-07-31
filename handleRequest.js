import {
    ACTIVATE_INVENTORY,
    activateInventory,
} from './commands/activateInventory.js'
import { ADD_ITEM, addItem } from './commands/addItem.js'
import {
    CREATE_INVENTORY,
    createInventory,
} from './commands/createInventory.js'
import {
    DELETE_INVENTORY,
    deleteInventory,
} from './commands/deleteInventory.js'
import { DELETE_ITEM, deleteItem } from './commands/deleteItem.js'
import {
    LIST_INVENTORIES,
    listInventories,
} from './commands/listInventories.js'
import { LIST_ITEMS, listItems } from './commands/listItems.js'

export const handleRequest = async (name, data, userId, res) => {
    switch (name) {
        case ACTIVATE_INVENTORY:
            return activateInventory(data, userId, res)
        case ADD_ITEM:
            return addItem(data, userId, res)
        case CREATE_INVENTORY:
            return createInventory(data, userId, res)
        case DELETE_INVENTORY:
            return deleteInventory(data, userId, res)
        case DELETE_ITEM:
            return deleteItem(data, userId, res)
        case LIST_INVENTORIES:
            return listInventories(data, userId, res)
        case LIST_ITEMS:
            return listItems(data, userId, res)
        default:
            return res
                .status(400)
                .json({ error: `${name} ist keine gültige Anweisung` })
    }
}
