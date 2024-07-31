import { InteractionResponseType } from 'discord-interactions'
import { getInventory } from '../data/getInventory.js'
import { createInventoryChoices, createItemChoices } from './choices.js'

const DELETE_ITEM = 'deleteitem'

const deleteItemDefinition = {
    name: DELETE_ITEM,
    description: 'Lösche ein item',
    options: [
        {
            type: 3,
            name: 'item',
            description: 'Itemname',
            required: true,
        },
        {
            type: 3,
            name: 'inventory',
            description: 'Alternatives Inventar',
            required: false,
        },
    ],
    type: 1,
}

const deleteItem = (data, userId, res) => {
    const optionalName = data.options[2] ? data.options[2].value : null
    let inventory = getInventory(userId, optionalName)

    if (!inventory) {
        return res.status(404).json({ error: 'Inventar nicht gefunden' })
    }

    if (userId !== inventory.userId && !inventory.shared) {
        return res
            .status(404)
            .json({ error: 'Dieses Inventar gehört einem anderen Nutzer' })
    }

    let item = inventory.items.find(
        (item) => item.name === data.options[0].value
    )

    if (!item) {
        return res.status(404).json({ error: 'Item nicht gefunden' })
    }

    inventory.items = inventory.items.filter(
        (item) => item.name !== data.options[0].value
    )

    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: `Item ${data.options[0].value} gelöscht`,
        },
    })
}

export { DELETE_ITEM, deleteItemDefinition, deleteItem }
