import { InteractionResponseType } from 'discord-interactions'
import { deleteItem } from './deleteItem.js'
import { getInventory } from '../data/inventory.js'
import { insertItem, updateItem } from '../data/item.js'

const ADD_ITEM = 'additem'

const addItemDefinition = {
    name: ADD_ITEM,
    description: 'Add or Increase Item',
    options: [
        {
            type: 3,
            name: 'item',
            description: 'Itemname',
            required: true,
        },
        {
            type: 4,
            name: 'count',
            description: 'Neue Anzahl der Items',
            required: true,
        },
        {
            type: 3,
            name: 'weight',
            description: 'Gewicht einer Einheit',
            required: false,
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

const addItem = async (data, userId, res) => {
    const optionalName = data.options[3] ? data.options[3].value : null
    let inventory = await getInventory(userId, optionalName)

    if (!inventory) {
        return res.status(404).json({ error: 'Inventar nicht gefunden' })
    }

    if (userId !== inventory.userId && !inventory.shared) {
        return res
            .status(404)
            .json({ error: 'Dieses Inventar gehört einem anderen Nutzer' })
    }

    if (data.options[1].value === 0) {
        data.options[1] = data.options[2]
        return deleteItem(data, userId, res)
    }

    let item = inventory.items.find(
        (item) => item.name === data.options[0].value
    )

    if (!item) {
        await insertItem(
            inventory.id,
            data.options[0].value,
            data.options[1].value,
            data.options[2] ? Number.parseFloat(data.options[2].value) : 0
        )
    } else {
        await updateItem(
            item.id,
            (item.count = item.count + data.options[1].value),
            (item.weight = data.options[2]
                ? Number.parseFloat(data.options[2].value)
                : item.weight)
        )
    }

    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: `Item ${data.options[0].value} mit Anzahl ${data.options[1].value} aktualisiert`,
        },
    })
}

export { ADD_ITEM, addItemDefinition, addItem }
