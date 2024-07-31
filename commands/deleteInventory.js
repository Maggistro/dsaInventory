import { InteractionResponseType } from 'discord-interactions'
import { createInventoryChoices } from './choices.js'
import { getDb } from '../data/getDb.js'
import { getInventory } from '../data/getInventory.js'

const DELETE_INVENTORY = 'deleteinventory'

const deleteInventoryDefinition = {
    name: DELETE_INVENTORY,
    description: 'Lösche ein inventar',
    options: [
        {
            type: 3,
            name: 'inventory',
            description: 'Inventarname',
            required: true,
        },
    ],
    type: 1,
}

const deleteInventory = (data, userId, res) => {
    const inventory = getInventory(userId)
    delete getDb().inventories[inventory.name]
    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: `Inventar gelöscht`,
        },
    })
}

export { DELETE_INVENTORY, deleteInventoryDefinition, deleteInventory }
